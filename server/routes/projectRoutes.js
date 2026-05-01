const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { body } = require('express-validator');

router.use(protect);

router.get('/', getProjects);
router.post('/', adminOnly, body('title').notEmpty().withMessage('Title is required'), createProject);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
