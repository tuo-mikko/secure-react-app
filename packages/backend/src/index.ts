
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectToMongo } from './config/db';

import usersRouter from './controllers/users';
import authRouter from './controllers/auth';
import postsRouter from './routes/posts';


const app = express();

// Global middleware
let morgan = require('morgan')
app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


// Database
connectToMongo();

// Routers
app.use('/api/users', usersRouter);
app.use('/api', authRouter);
app.use('/api/posts', postsRouter);

// Basic health check
app.get('/', (_req: Request, res: Response) => {
  res.send('<h1>Hello World!</h1>');
});

// Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'unknown endpoint' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
