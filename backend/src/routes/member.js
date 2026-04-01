import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import * as nextfitService from '../services/nextfit.js';

const router = express.Router();

// ── Rate Limiters ─────────────────────────────────────────
const publicPlanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas requisições. Tente novamente em breve.' },
});

const memberReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas requisições. Tente novamente em breve.' },
});

const profileUpdateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas de atualização. Tente novamente mais tarde.' },
});

// ── Validation para atualização de perfil ────────────────
const profileUpdateValidation = [
  body('phone')
    .optional()
    .matches(/^\d{10,11}$/).withMessage('Telefone inválido (10 ou 11 dígitos).')
    .isLength({ max: 11 }).withMessage('Telefone muito longo.'),
  body('email')
    .optional()
    .isEmail().withMessage('E-mail inválido.')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('E-mail muito longo.'),
];

// ── Public route (before auth middleware) ─────────────────
router.get('/available-plans', publicPlanLimiter, async (_req, res) => {
  try {
    const plans = await nextfitService.getAvailablePlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans' });
  }
});

// ── All routes below require authentication ───────────────
router.use(authenticateToken);

router.get('/status', memberReadLimiter, async (req, res) => {
  try {
    const status = await nextfitService.getMemberStatus(req.user.nextfit_id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member status' });
  }
});

router.get('/payments', memberReadLimiter, async (req, res) => {
  try {
    const payments = await nextfitService.getMemberPayments(req.user.nextfit_id);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

router.get('/plan', memberReadLimiter, async (req, res) => {
  try {
    const plan = await nextfitService.getMemberPlan(req.user.nextfit_id);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan info' });
  }
});

router.put('/profile', profileUpdateLimiter, profileUpdateValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Whitelist: only accept phone and email
  const { phone, email } = req.body;
  try {
    const result = await nextfitService.updateMemberProfile(req.user.nextfit_id, { phone, email });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;
