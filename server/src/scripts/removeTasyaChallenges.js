import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Challenge from '../models/Challenge.js';

dotenv.config();

async function cleanup() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitquest';
  await mongoose.connect(mongoUri);
  console.log('✓ Connected to MongoDB');

  const targetNames = ['Tasya Shetty', 'Tasya'];
  const users = await User.find({ name: { $in: targetNames } });

  if (!users.length) {
    console.log('⊘ No users found with names:', targetNames.join(', '));
    await mongoose.disconnect();
    return;
  }

  const userIds = users.map((u) => u._id);
  console.log(`Found ${users.length} matching user(s):`, users.map(u => `${u.name} (${u.email})`).join(', '));

  const result = await Challenge.deleteMany({ creator: { $in: userIds } });
  console.log(`✓ Deleted ${result.deletedCount} challenge(s) created by target users.`);

  await mongoose.disconnect();
  console.log('✓ Disconnected');
}

cleanup().catch((err) => {
  console.error('✗ Cleanup failed:', err);
  process.exit(1);
});
