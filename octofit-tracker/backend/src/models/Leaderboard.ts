import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  userId: string;
  name: string;
  score: number;
  rank: number;
  streak: number;
}

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    score: { type: Number, required: true },
    rank: { type: Number, required: true },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Leaderboard =
  mongoose.models.Leaderboard || mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);
