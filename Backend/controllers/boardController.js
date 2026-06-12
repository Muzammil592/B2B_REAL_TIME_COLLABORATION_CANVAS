import Board from '../models/Board.js';
export const createBoard = async (req, res) => {
  try {
    const newBoard = await Board.create({ owner: req.user._id, title: req.body.title });
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { 'collaborators.user': req.user._id }]
    }).populate('owner', 'name email');
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
