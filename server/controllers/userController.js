const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id name email role').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or member' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const isSelf = req.params.id === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, updateRole, getProfile, deleteUser };
