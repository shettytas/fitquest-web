import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, challenge: 1, date: 1 });

export default mongoose.model('Progress', progressSchema);


