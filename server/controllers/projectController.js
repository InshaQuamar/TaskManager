const Project = require('../models/Project');
const { validationResult } = require('express-validator');

const getProjects = async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin'
        ? {}
        : { $or: [{ owner: req.user._id }, { members: req.user._id }] };

    const projects = await Project.find(filter)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, deadline } = req.body;
    const project = await Project.create({
      title,
      description,
      deadline,
      owner: req.user._id,
      members: [req.user._id],
    });

    const populated = await project.populate([
      { path: 'owner', select: 'name email' },
      { path: 'members', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
    const isOwner = project.owner._id.toString() === req.user._id.toString();

    if (!isMember && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { owner, ...updates } = req.body;
    const updated = await Project.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    if (project.members.some(m => m.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();

    const populated = await project.populate([
      { path: 'owner', select: 'name email' },
      { path: 'members', select: 'name email' },
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project.members = project.members.filter(m => m.toString() !== req.params.userId);
    await project.save();

    const populated = await project.populate([
      { path: 'owner', select: 'name email' },
      { path: 'members', select: 'name email' },
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
