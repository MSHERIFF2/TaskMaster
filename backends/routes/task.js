const express = require('express');
const Task = require('../models/task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new task (Protected)
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, deadline, priority } = req.body;

    try {
        const task = new Task({
            title,
            description,
            deadline,
            priority,
            user: req.user.id, // Link task to the authenticated user
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all tasks for the authenticated user (Protected)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }); // Filter tasks by the user's ID
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a task by ID (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user.id }, // Ensure only the owner's tasks can be updated
            req.body,
            { new: true } // Return the updated task
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a task by ID (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: id, user: req.user.id }); // Ensure only the owner's tasks can be deleted

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
