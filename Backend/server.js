const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Ensure you have this model defined
const express = require("express");
const Task = require("./models/Task");
const auth = require("../middleware/auth");


require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://task-master-seven-steel.vercel.app'],  // Your frontend URL(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // This allows us to parse JSON request bodies

// Register a new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "Email already in use." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
      res.status(500).json({ message: "Server error." });
  }
});

// get all tasks
app.get("/tasks", auth, async (req, res) => {
  try {
      const tasks = await Task.find({ user: req.user.userId });
      res.json({ tasks }); // Return an object with a tasks property
  } catch (err) {
      res.status(500).json({ message: "Server error." });
  }
});



// Create a new task
app.post("/tasks", auth, async (req, res) => {
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
app.put("/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  const userId = req.headers["user-id"];
  const { title, description, priority, deadline } = req.body;

  try {
      const task = await Task.findOneAndUpdate(
          { _id: taskId, user: userId },
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
app.delete("/:id", auth, async (req, res) => {
  const taskId = req.params.id;
const userId = req.headers["user-id"]; // Get the user's ID from the headers
  try {
      const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

      if (!task) {
          return res.status(404).json({ message: "Task not found." });
      }

      res.json({ message: "Task deleted successfully." });
  } catch (err) {
      res.status(500).json({ message: "Server error." });
  }
});


// Login a user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "Invalid email or password." });
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid email or password." });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token, userId: user._id });
  } catch (err) {
      res.status(500).json({ message: "Server error." });
  }
});


// Testing route to ensure server is running
app.get('/', (req, res) => {
  res.send('Welcome to Taskmaster API');
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
