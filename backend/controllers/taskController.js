// backend/controllers/taskController.js
const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  const { title, description, deadline, priority } = req.body;
  const userId = req.user.userId;

  try {
    const newTask = new Task({ title, description, deadline, priority, userId });
    await newTask.save();

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  const userId = req.user.userId;

  try {
    const tasks = await Task.find({ userId });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, deadline, priority } = req.body;
  const userId = req.user.userId;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { title, description, deadline, priority },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.userId;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.Test = (req, res) => {
  res.send("Welcome to my API")
}
                