import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Progress from '../models/Progress.js';
import Challenge from '../models/Challenge.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/update',
  requireAuth,
  [body('challengeId').isString(), body('amount').isFloat({ min: 0 }), body('date').isISO8601()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { challengeId, amount, date } = req.body;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    if (!challenge.participants.map(String).includes(req.userId)) {
      return res.status(403).json({ message: 'Join the challenge first' });
    }
    const progress = await Progress.create({ user: req.userId, challenge: challengeId, amount, date });
    res.status(201).json(progress);
  }
);

export default router;


