import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: string;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: string;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);
