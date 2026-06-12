import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection Logic
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 Database Connection Established Successfully'))
  .catch((err) => console.error('Database connection error:', err));

// Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: "healthy", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.listen(PORT, () => {
  console.log(`🚀 Core Server runtime active on port ${PORT}`);
});