import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database if available
connectDB();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL || ''
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads folder
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Rate limiting on public endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Mount API v1
app.use('/api/v1', apiRoutes);

// Root test endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sweet Pearl Bakes API Server',
    status: 'Running',
    endpoints: '/api/v1'
  });
});

// Central Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🍰 [Sweet Pearl Bakes API] Listening at http://localhost:${PORT}`);
  console.log(`🌐 API routes mounted at http://localhost:${PORT}/api/v1`);
});
