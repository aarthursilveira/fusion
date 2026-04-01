import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import prisma from '../config/prisma.js';
import axios from 'axios';
import { createNextFitMember } from '../services/nextfit.js';
import { authenticateToken } from '../middleware/auth.js';
import { blacklistToken } from '../services/tokenBlacklist.js';

const router = express.Router();

// ── Rate Limiters ─────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' },
});

const changePasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas. Tente novamente em 1 hora.' },
});

// ── Validation Rules ──────────────────────────────────────
const registerValidation = [
  body('email')
    .isEmail().withMessage('E-mail inválido.')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('E-mail muito longo.'),
  body('password')
    .isLength({ min: 8, max: 128 }).withMessage('Senha deve ter entre 8 e 128 caracteres.'),
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório.')
    .isLength({ max: 100 }).withMessage('Nome muito longo.')
    .escape(),
  body('cpf')
    .matches(/^\d{11}$/).withMessage('CPF deve conter exatamente 11 dígitos numéricos.')
    .isLength({ min: 11, max: 11 }),
  body('phone')
    .optional()
    .matches(/^\d{10,11}$/).withMessage('Telefone inválido (10 ou 11 dígitos).')
    .isLength({ max: 11 }),
  body('birthDate')
    .optional()
    .isISO8601().withMessage('Data de nascimento inválida.')
    .isLength({ max: 10 }),
];

const loginValidation = [
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha é obrigatória.'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória.'),
  body('newPassword')
    .isLength({ min: 8, max: 128 }).withMessage('Nova senha deve ter entre 8 e 128 caracteres.')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('A nova senha deve ser diferente da senha atual.');
      }
      return true;
    }),
];

// ── Helper: mask CPF ──────────────────────────────────────
// Formato correto: ***.456.789-01
function maskCpf(cpf) {
  if (!cpf || cpf.length !== 11) return '***.***.***-**';
  return `***.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
}

// ── Helper: invalidate current session token ──────────────
function invalidateCurrentToken(req, res) {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded?.jti && decoded?.exp) {
        blacklistToken(decoded.jti, decoded.exp);
      }
    } catch {
      // Ignora erros de decode — limpeza do cookie prossegue
    }
  }
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}

// ── POST /register ────────────────────────────────────────
router.post('/register', registerLimiter, registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, cpf, birthDate, phone } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create member in NextFit (service handles mock if no token)
    const nextfitResponse = await createNextFitMember({ name, email, cpf, birthDate, phone });
    const nextfit_id = nextfitResponse.nextfit_id || `NF_${randomUUID()}`;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nextfit_id,
      },
    });

    // Notify n8n Webhook (fire-and-forget — failure never breaks registration)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.fusion.satomiq.com/webhook/portal';
    try {
      await axios.post(n8nWebhookUrl, {
        event: 'new_registration',
        user: {
          id: user.id,
          name,
          email,
          cpf: maskCpf(cpf),
          phone,
          nextfit_id,
        }
      });
    } catch (webhookError) {
      console.error('Failed to trigger n8n webhook:', webhookError.message);
    }

    res.status(201).json({ message: 'Conta criada com sucesso!', userId: user.id });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// ── POST /login ──────────────────────────────────────────
router.post('/login', loginLimiter, loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // jti garante que cada token emitido é único e pode ser revogado individualmente
    const jti = randomUUID();
    const token = jwt.sign(
      { userId: user.id, email: user.email, nextfit_id: user.nextfit_id, jti },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Reduzido de 7d para 15min — minimiza janela de abuso pós-logout
    );

    res.cookie('token', token, {
      httpOnly: true,                                // Sem acesso via JS — protege contra XSS
      secure: process.env.NODE_ENV === 'production', // HTTPS only em produção
      sameSite: 'strict',                            // Proteção CSRF
      maxAge: 15 * 60 * 1000,                        // 15 minutos
    });

    res.json({
      message: 'Login realizado com sucesso.',
      user: {
        email: user.email,
        nextfit_id: user.nextfit_id,
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// ── GET /me ──────────────────────────────────────────────
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    userId: req.user.userId,
    email: req.user.email,
    nextfit_id: req.user.nextfit_id,
  });
});

// ── POST /logout ─────────────────────────────────────────
router.post('/logout', (req, res) => {
  // Invalida o token atual na blacklist antes de limpar o cookie
  invalidateCurrentToken(req, res);
  res.json({ message: 'Sessão encerrada.' });
});

// ── PUT /change-password ──────────────────────────────────
router.put('/change-password', authenticateToken, changePasswordLimiter, changePasswordValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedNew },
    });

    // Invalida sessão atual — força re-login com a nova senha
    invalidateCurrentToken(req, res);

    res.json({ message: 'Senha alterada com sucesso. Faça login novamente.' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

export default router;
