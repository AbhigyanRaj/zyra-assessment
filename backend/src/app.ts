import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import studentRoutes from './routes/students.routes';
import taskRoutes from './routes/tasks.routes';
import { timeStamp } from 'node:console';

const app = express();

// Security and Rate Limiting
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later in 15 mins' }
});
app.use(limiter);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://zyra.wuup.in'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Zyra Backend is Running Successfully!',
    timestamp: new Date().toISOString()
  });
});

// Health endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Backend is running successfully!', 
  timestamp: new Date().toISOString() });
});

//routes
app.use('/students', studentRoutes);
app.use('/tasks', taskRoutes);

export default app;