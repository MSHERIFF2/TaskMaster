const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Ensure you have this model defined
const authTasks = require("./routes/tasks")
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://task-master-ynps.vercel.app/'],  // Your frontend URL(s)
  methods: ['GET', 'POST'],
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

//  get all tasks

app.use('/api/tasks', authTasks)

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
