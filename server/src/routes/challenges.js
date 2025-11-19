import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Challenge from '../models/Challenge.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// List + search
router.get('/', async (req, res) => {
  try {
    const q = req.query.q?.trim();
    const filter = q ? { title: new RegExp(q, 'i') } : {};
    const challenges = await Challenge.find(filter).populate('creator', 'name');
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Failed to fetch challenges', error: error.message });
  }
});

// Create
router.post(
  '/',
  requireAuth,
  [
    body('title').isLength({ min: 4 }),
    body('startDate').isISO8601(),
    body('endDate').isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const challenge = await Challenge.create({ ...req.body, creator: req.userId, participants: [req.userId] });
      const populated = await challenge.populate('creator', 'name');
      res.status(201).json(populated);
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(500).json({ message: 'Failed to create challenge', error: error.message });
    }
  }
);

// Read
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate('creator', 'name');
    if (!challenge) return res.status(404).json({ message: 'Not found' });
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Failed to fetch challenge', error: error.message });
  }
});

// Update
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Not found' });
    if (String(challenge.creator) !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(challenge, req.body);
    await challenge.save();
    res.json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ message: 'Failed to update challenge', error: error.message });
  }
});

// Delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Not found' });
    if (String(challenge.creator) !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    await challenge.deleteOne();
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ message: 'Failed to delete challenge', error: error.message });
  }
});

// Join / Leave
router.post('/:id/join', requireAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { participants: req.userId } },
      { new: true }
    ).populate('creator', 'name').populate('participants', 'name email');
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ message: 'Failed to join challenge', error: error.message });
  }
});

router.post('/:id/leave', requireAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { $pull: { participants: req.userId } },
      { new: true }
    ).populate('creator', 'name').populate('participants', 'name email');
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (error) {
    console.error('Error leaving challenge:', error);
    res.status(500).json({ message: 'Failed to leave challenge', error: error.message });
  }
});

export default router;


