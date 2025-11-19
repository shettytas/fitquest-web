import { Router } from 'express';
import mongoose from 'mongoose';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const router = Router();

// Aggregated totals per user for a challenge
router.get('/:challengeId', async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
      return res.status(400).json({ message: 'Invalid challenge ID' });
    }

    const rows = await Progress.aggregate([
      { $match: { challenge: new mongoose.Types.ObjectId(challengeId) } },
      { $group: { _id: '$user', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 50 }
    ]);

    // Populate user names
    const leaderboard = await Promise.all(
      rows.map(async (row) => {
        const user = await User.findById(row._id).select('name email');
        return {
          _id: row._id,
          name: user?.name || 'Unknown User',
          email: user?.email || '',
          total: row.total
        };
      })
    );

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
});

export default router;


