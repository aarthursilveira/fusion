import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as nextfitService from '../services/nextfit.js';

const router = express.Router();

// ── Public route (before auth middleware) ─────────────────
router.get('/available-plans', async (req, res) => {
  try {
    const plans = await nextfitService.getAvailablePlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans' });
  }
});

// ── All routes below require authentication ───────────────
router.use(authenticateToken);

router.get('/status', async (req, res) => {
  try {
    const status = await nextfitService.getMemberStatus(req.user.nextfit_id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member status' });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const payments = await nextfitService.getMemberPayments(req.user.nextfit_id);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

router.get('/plan', async (req, res) => {
  try {
    const plan = await nextfitService.getMemberPlan(req.user.nextfit_id);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan info' });
  }
});

router.put('/profile', async (req, res) => {
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
