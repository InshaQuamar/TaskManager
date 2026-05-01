const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
  addComment,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getTasks);
router.post(
  '/',
  body('title').notEmpty().withMessage('Title is required'),
  body('project').notEmpty().withMessage('Project is required'),
  createTask
);
router.get('/project/:projectId', getTasksByProject);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', adminOnly, deleteTask);
router.post('/:id/comments', addComment);

module.exports = router;
