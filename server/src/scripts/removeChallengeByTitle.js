import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from '../models/Challenge.js';

dotenv.config();

const targetTitle = process.argv[2] || 'msth';

async function cleanup() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitquest';
  await mongoose.connect(mongoUri);
  console.log('✓ Connected to MongoDB');

  const pattern = new RegExp(targetTitle, 'i');
  const challenges = await Challenge.find({ title: pattern });

  if (!challenges.length) {
    console.log('⊘ No challenges found matching title containing:', targetTitle);
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${challenges.length} challenge(s):`, challenges.map(c => `${c.title} (id: ${c._id})`).join(', '));

  const result = await Challenge.deleteMany({ _id: { $in: challenges.map(c => c._id) } });
  console.log(`✓ Deleted ${result.deletedCount} challenge(s).`);

  await mongoose.disconnect();
  console.log('✓ Disconnected');
}

cleanup().catch(err => {
  console.error('✗ Cleanup failed:', err);
  process.exit(1);
});
