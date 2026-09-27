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

app.use(express.json());
app.use('/api', apiRoutes);

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
