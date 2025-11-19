import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const challenges = [
  {
    title: '10K Steps Daily Challenge',
    description: 'Walk 10,000 steps every day for 30 days. Perfect for beginners and those looking to increase daily activity. Track your steps and stay active!',
    unit: 'steps',
    targetPerDay: 10000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: '3-4L Water Drinking Challenge',
    description: 'Drink 3-4 liters of water every day for 30 days. Stay hydrated, improve energy levels, and boost your overall health!',
    unit: 'water',
    targetPerDay: 4,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: '30-Day Yoga Journey',
    description: 'Complete 30 minutes of yoga practice daily. Improve flexibility, strength, and mindfulness.',
    unit: 'minutes',
    targetPerDay: 30,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Hydration Hero Challenge',
    description: 'Drink 8 glasses of water (2 liters) every day. Stay hydrated and feel the difference!',
    unit: 'water',
    targetPerDay: 8,
    startDate: new Date(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Running 5K Challenge',
    description: 'Run 5 kilometers every day. Build endurance and cardiovascular health.',
    unit: 'km',
    targetPerDay: 5,
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Cycling Adventure',
    description: 'Cycle 20 kilometers daily. Explore your neighborhood and build leg strength.',
    unit: 'km',
    targetPerDay: 20,
    startDate: new Date(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Strength Training 100',
    description: 'Complete 100 push-ups, sit-ups, and squats daily. Build muscle and core strength.',
    unit: 'reps',
    targetPerDay: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Meditation Mastery',
    description: 'Meditate for 20 minutes every day. Improve mental clarity and reduce stress.',
    unit: 'minutes',
    targetPerDay: 20,
    startDate: new Date(),
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
  },
  {
    title: '15K Steps Power Walk',
    description: 'Amp up your step game with 15,000 steps daily. For those ready to take it to the next level.',
    unit: 'steps',
    targetPerDay: 15000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Morning Run Club',
    description: 'Start your day with a 3km run. Energize your mornings and boost productivity.',
    unit: 'km',
    targetPerDay: 3,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Plank Challenge',
    description: 'Hold a plank for 5 minutes total per day. Strengthen your core and improve posture.',
    unit: 'minutes',
    targetPerDay: 5,
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Healthy Meal Prep',
    description: 'Prepare and eat 3 healthy meals every day. Fuel your body with nutritious food.',
    unit: 'meal',
    targetPerDay: 3,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Cardio Blast',
    description: 'Complete 45 minutes of cardio exercises daily. Burn calories and improve heart health.',
    unit: 'minutes',
    targetPerDay: 45,
    startDate: new Date(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Flexibility Flow',
    description: 'Do 30 minutes of stretching exercises daily. Improve flexibility and prevent injuries.',
    unit: 'minutes',
    targetPerDay: 30,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Evening Walk Routine',
    description: 'Take a 2km walk every evening. Unwind after a long day and get your steps in.',
    unit: 'km',
    targetPerDay: 2,
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'HIIT Workout Challenge',
    description: 'Complete 20 minutes of High-Intensity Interval Training daily. Maximize results in minimal time.',
    unit: 'minutes',
    targetPerDay: 20,
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  }
];

async function seedChallenges() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitquest';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Find or create a default user for challenges
    let defaultUser = await User.findOne({ email: 'admin@fitquest.com' });
    
    if (!defaultUser) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      defaultUser = await User.create({
        name: 'Admin User',
        email: 'admin@fitquest.com',
        passwordHash
      });
      console.log('✓ Created default admin user');
    }

    // Clear existing challenges (optional - comment out if you want to keep existing ones)
    // await Challenge.deleteMany({});
    // console.log('✓ Cleared existing challenges');

    // Create challenges
    const createdChallenges = [];
    for (const challengeData of challenges) {
      // Check if challenge already exists
      const existing = await Challenge.findOne({ 
        title: challengeData.title,
        creator: defaultUser._id
      });
      
      if (!existing) {
        const challenge = await Challenge.create({
          ...challengeData,
          creator: defaultUser._id,
          participants: [defaultUser._id] // Admin joins automatically
        });
        createdChallenges.push(challenge);
        console.log(`✓ Created challenge: ${challenge.title}`);
      } else {
        console.log(`⊘ Skipped existing challenge: ${challengeData.title}`);
      }
    }

    console.log(`\n✓ Successfully seeded ${createdChallenges.length} challenges!`);
    console.log(`⊘ Skipped ${challenges.length - createdChallenges.length} existing challenges`);
    
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding challenges:', error);
    process.exit(1);
  }
}

seedChallenges();

