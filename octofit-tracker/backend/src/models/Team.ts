import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  members: string[];
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    members: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);
