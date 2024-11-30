
const Task = require('../models/taskModel');

// Create task
exports.createTask = async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      deadline,
      priority,
      user: req.user.id, // Assign task to logged-in user
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};
                