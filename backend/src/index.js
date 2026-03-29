import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import memberRoutes from './routes/member.js';
import prisma from './config/prisma.js';

dotenv.config();

// ── Validate critical environment variables ───────────────
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL: Environment variable ${envVar} is not defined. Exiting.`);
    process.exit(1);
  }
}

if (process.env.NODE_ENV === 'production') {
  if (process.env.JWT_SECRET.length < 32) {
    console.error('FATAL: JWT_SECRET must be at least 32 characters in production. Exiting.');
    process.exit(1);
  }
  if (/secret|dev|test/i.test(process.env.JWT_SECRET)) {
    console.error('FATAL: JWT_SECRET contains insecure keywords. Use a strong random secret. Exiting.');
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// ── Security Headers ──────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// ── CORS ──────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/member', memberRoutes);

// Catchall → React
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Start Server ──────────────────────────────────────────
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ── Graceful Shutdown ─────────────────────────────────────
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Database connections closed. Goodbye.');
    process.exit(0);
  });
  // Force exit after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));