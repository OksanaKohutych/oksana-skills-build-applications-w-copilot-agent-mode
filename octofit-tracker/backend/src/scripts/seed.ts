import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Team } from '../models/Team.js';
import { Activity } from '../models/Activity.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { Workout } from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await User.deleteMany({});
    await Team.deleteMany({});
    await Activity.deleteMany({});
    await Leaderboard.deleteMany({});
    await Workout.deleteMany({});

    const users = await User.insertMany([
      { name: 'Maya Chen', email: 'maya.chen@octofit.app', role: 'Captain', fitnessLevel: 'advanced' },
      { name: 'Jordan Lee', email: 'jordan.lee@octofit.app', role: 'Member', fitnessLevel: 'intermediate' },
      { name: 'Priya Patel', email: 'priya.patel@octofit.app', role: 'Member', fitnessLevel: 'beginner' },
    ]);

    await Team.insertMany([
      {
        name: 'Trail Blazers',
        description: 'Endurance-focused running group',
        members: users.map((user) => user.email),
      },
      {
        name: 'Core Circuit',
        description: 'Strength and mobility training team',
        members: [users[0].email, users[2].email],
      },
    ]);

    await Activity.insertMany([
      {
        userId: users[0]._id.toString(),
        type: 'run',
        durationMinutes: 32,
        caloriesBurned: 420,
        date: '2026-09-27',
      },
      {
        userId: users[1]._id.toString(),
        type: 'strength',
        durationMinutes: 45,
        caloriesBurned: 340,
        date: '2026-09-26',
      },
      {
        userId: users[2]._id.toString(),
        type: 'cycling',
        durationMinutes: 28,
        caloriesBurned: 310,
        date: '2026-09-25',
      },
    ]);

    await Leaderboard.insertMany([
      { userId: users[0]._id.toString(), name: 'Maya Chen', score: 980, rank: 1, streak: 12 },
      { userId: users[1]._id.toString(), name: 'Jordan Lee', score: 860, rank: 2, streak: 9 },
      { userId: users[2]._id.toString(), name: 'Priya Patel', score: 780, rank: 3, streak: 5 },
    ]);

    await Workout.insertMany([
      {
        name: 'Hill Sprint Interval',
        category: 'Cardio',
        durationMinutes: 25,
        difficulty: 'Advanced',
        focusArea: 'Legs',
      },
      {
        name: 'Core Stability Circuit',
        category: 'Strength',
        durationMinutes: 30,
        difficulty: 'Intermediate',
        focusArea: 'Core',
      },
      {
        name: 'Mobility Reset Flow',
        category: 'Recovery',
        durationMinutes: 20,
        difficulty: 'Beginner',
        focusArea: 'Recovery',
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
