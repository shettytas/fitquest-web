import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
    bio: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);


