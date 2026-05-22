import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Security, browser access, JSON parsing, and request logging middleware.
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Lightweight endpoint for setup checks and uptime monitors.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Versioned API routes live behind /api so the frontend has one stable base URL.
app.use('/api', chatRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
