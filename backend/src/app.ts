import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { envVars } from './config/env';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { notFound } from './middlewares/notFound';
import { IndexRoutes } from './routes';
import morgan from 'morgan';

const app: Application = express();

// CORS
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// API Routes
app.use('/api/v1', IndexRoutes);

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: '🚀 QuickHire API is running!' });
});

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
