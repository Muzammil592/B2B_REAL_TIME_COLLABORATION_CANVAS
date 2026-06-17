import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// 1. Production CORS Middleware Configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());

const server = createServer(app);

// 2. Real-Time Web Socket Engine Optimization
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true
});

// 3. Database Connection Tunnel
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/miro_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 MongoDB Cluster Pipeline Connected Securely...'))
  .catch((err) => console.error('❌ Database Hookup Failure:', err));

// 4. WebSocket Operational Event Framework
io.on('connection', (socket) => {
  console.log(`🔌 New WebSocket client tunnel active: ${socket.id}`);

  // Workspace Channel Isolation (Rooms logic)
  socket.on('join-board', (boardId) => {
    socket.join(boardId);
    console.log(`🎯 Client [${socket.id}] joined workspace channel: ${boardId}`);
  });

  // Real-time matrix mutation broadcaster
  socket.on('canvas-update', (data) => {
    socket.to(data.boardId).emit('canvas-update-remote', data);
  });

  // Disconnect Lifecycle Cleanups
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// 5. Port Configuration & Secure Interface Binding
const PORT = process.env.PORT || 5001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 B2B Collaboration Pipeline executing transparently on port ${PORT}`);
});