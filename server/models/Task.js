const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);