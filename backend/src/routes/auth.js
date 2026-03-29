import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import prisma from '../config/prisma.js';
import axios from 'axios';
import { createNextFitMember } from '../services/nextfit.js';
import { authenticateToken } from '../middleware/auth.js';

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

// ── Validation Rules ──────────────────────────────────────
const registerValidation = [
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres.'),
  body('name').trim().notEmpty().withMessage('Nome é obrigatório.').escape(),
  body('cpf').matches(/^\d{11}$/).withMessage('CPF deve conter exatamente 11 dígitos numéricos.'),
  body('phone').optional().matches(/^\d{10,11}$/).withMessage('Telefone inválido (10 ou 11 dígitos).'),
  body('birthDate').optional().isISO8601().withMessage('Data de nascimento inválida.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha é obrigatória.'),
];

// ── Helper: mask CPF ──────────────────────────────────────
function maskCpf(cpf) {
  if (!cpf || cpf.length !== 11) return '***.***.***-**';
  return `***.***. ${cpf.slice(6, 9)}-${cpf.slice(9)}`;
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
    const nextfit_id = nextfitResponse.nextfit_id || `NF_${crypto.randomUUID()}`;

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

    const token = jwt.sign(
      { userId: user.id, email: user.email, nextfit_id: user.nextfit_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Sessão encerrada.' });
});

export default router;
