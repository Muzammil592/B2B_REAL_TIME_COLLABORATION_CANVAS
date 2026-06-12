import express from 'express';
import { protect } from '../middleware/auth.js';
import Board from '../models/Board.js';
const router = express.Router();

// Create a new board canvas
router.post('/', protect, createBoard);
// Get all boards user has access to
router.get('/', protect, getBoards);
     
export default router;