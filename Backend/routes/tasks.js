
const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all tasks for the logged-in user
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

// Create a new task
router.post("/", auth, async (req, res) => {
    const { title, description, priority, deadline } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            priority,
            deadline,
            user: req.user.userId,
        });
        await newTask.save();

        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

// Update a task
router.put("/:id", auth, async (req, res) => {
    const { title, description, priority, deadline } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { title, description, priority, deadline },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

// Delete a task
router.delete("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.json({ message: "Task deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
