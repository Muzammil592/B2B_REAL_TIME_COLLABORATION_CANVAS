import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';

// --- DATABASE INFRASTRUCTURE SCHEMAS ---
const BoardSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true },
  shapes: { type: Array, default: [] }, // Holds complex serialized Fabric vector trees
}, { timestamps: true });

const Board = mongoose.model('Board', BoardSchema);

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// --- REST ENDPOINT: INITIAL STATE FETCH ---
app.get('/api/boards/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;
    let board = await Board.findOne({ boardId });
    
    // Fail-safe init: Agar board database mein pehle se nahi hai toh blank structural setup return karein
    if (!board) {
      board = await Board.create({ boardId, shapes: [] });
    }
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch board operational vectors", details: error.message });
  }
});

// --- CORE SYSTEM HEALTH MONITOR ---
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.status(200).json({ status: 'OK', gateway: 'Operational', database: dbStatus });
});

const server = http.createServer(app);

// --- SOCKET.IO REAL-TIME REALM PIPELINE ---
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  
  socket.on("join-board", (boardId) => {
    socket.join(boardId);
  });

  // Intercept changes and sync immediately across peers
  socket.on("canvas-update", (payload) => {
    socket.to(payload.boardId).emit("canvas-update-remote", payload);
  });

  // 🚀 CRDT PERSISTENCE ACTION: Save full state layout drop asynchronously
  socket.on("save-canvas-state", async (payload) => {
    try {
      const { boardId, shapes } = payload;
      await Board.findOneAndUpdate(
        { boardId },
        { $set: { shapes } },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("❌ Critical: Failed to flush state to MongoDB Cluster:", err.message);
    }
  });

  socket.on("disconnect", () => {
    // Graceful socket termination
  });
});

// --- MONGO CONNECTION LOOPS ---
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/miro_db";
mongoose.connect(MONGO_URI)
  .then(() => console.log("🍃 MongoDB Cluster Pipeline Connected Securely..."))
  .catch(err => console.error("❌ MongoDB Connection Disaster:", err));

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`🚀 B2B Collaboration Pipeline executing transparently on port ${PORT}`);
});