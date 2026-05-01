const express = require('express');
const router = express.Router();
const { getAllUsers, updateRole, getProfile, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getAllUsers);
router.get('/me', getProfile);
router.patch('/:id/role', adminOnly, updateRole);
router.delete('/:id', deleteUser);

module.exports = router;
