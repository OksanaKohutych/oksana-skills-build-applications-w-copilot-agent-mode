import express from 'express';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { Team } from '../models/Team.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { Workout } from '../models/Workout.js';

const router = express.Router();

router.get('/users', async (_req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/activities', async (_req, res) => {
  try {
    const activities = await Activity.find().lean();
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

router.get('/teams', async (_req, res) => {
  try {
    const teams = await Team.find().lean();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

router.get('/leaderboard', async (_req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 }).lean();
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

router.get('/workouts', async (_req, res) => {
  try {
    const workouts = await Workout.find().lean();
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

export default router;
