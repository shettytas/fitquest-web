import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import challengeRoutes from './routes/challenges.js';
import progressRoutes from './routes/progress.js';
import leaderboardRoutes from './routes/leaderboard.js';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Optional: serve built frontend via Express when enabled
{
  const distPath = path.resolve(process.cwd(), '../client/dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving static frontend from', distPath);
  }
}

async function start() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitquest';
    console.log('Connecting to MongoDB at:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`✓ API server listening on http://localhost:${PORT}`);
      console.log(`✓ CORS enabled for: ${CLIENT_ORIGIN}`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    console.error('Make sure MongoDB is running and the connection string is correct.');
    process.exit(1);
  }
}

start();


