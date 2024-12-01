
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const corsOptions = {
  origin: ['https://task-master-seven-steel.vercel.app/', 'http://localhost:5000', 'http://127.0.0.1:5000'],
  methods: 'GET, POST, PUT, DELETE', // specify the allowed methods if needed
};
// Import routes
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
console.log(process.env.JWT_SECRET)
const app = express();

// Middleware


app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
                