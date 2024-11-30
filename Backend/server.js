// Backend (Express + MongoDB)

// Import necessary packages and models
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Task = require("./models/Task");
const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://task-master-seven-steel.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// Create new task
app.post("/new", auth, async (req, res) => {
  const { title, description, priority, deadline } = req.body;

  const task = new Task({
    title,
    description,
    priority,
    deadline,
    userId: req.userId,
  });

  try {
    await task.save();
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
});

// Get all tasks
app.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

// Edit task
app.put("/edit/:id", auth, async (req, res) => {
  const { title, description, priority, deadline } = req.body;
  const taskId = req.params.id;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.userId },
      { title, description, priority, deadline },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
});

// Delete task
app.delete("/tasks/:id", auth, async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted", task });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log("Error connecting to MongoDB:", err));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));