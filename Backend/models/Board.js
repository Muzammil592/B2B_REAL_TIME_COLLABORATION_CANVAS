import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Canvas', trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Multi-tenant permission control
  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['viewer', 'editor'], default: 'editor' }
  }],
  // Snapshot baseline (Day 6-7 mein deep payload persistence ke liye)
  elements: { type: Array, default: [] } 
}, { timestamps: true });

export default mongoose.model('Board', boardSchema);