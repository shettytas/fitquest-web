import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    unit: { type: String, enum: ['steps', 'minutes', 'km', 'reps', 'water', 'liters', 'glasses', 'meal', 'meals', 'custom'], default: 'steps' },
    targetPerDay: { type: Number, default: 10000 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.model('Challenge', challengeSchema);


