import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    `https://${codespaceName}-5173.app.github.dev`,
    `https://${codespaceName}-5174.app.github.dev`,
    `https://${codespaceName}-8000.app.github.dev`,
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
  res.json({
    message: 'OctoFit Tracker API',
    endpoints: ['/api/users', '/api/activities', '/api/teams', '/api/leaderboard', '/api/workouts'],
    baseUrl,
  });
});

app.get('/api/config', (_req, res) => {
  res.json({
    baseUrl,
    codespaceName: codespaceName ?? null,
    port: PORT,
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    baseUrl,
  });
});

async function startServer() {
  try {
    await connectDatabase();
    console.log('MongoDB connected to octofit_db');
  } catch (error) {
    console.warn('MongoDB unavailable; API will continue with empty collections.', error);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OctoFit API listening on http://localhost:${PORT}`);
    console.log(`Configured base URL: ${baseUrl}`);
  });
}

startServer();
