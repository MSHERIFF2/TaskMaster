
const express = require('express');
const { createTask, Test, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createTask);
router.get('/test', Test)
router.get('/tasks', getTasks)
router.put('/update', updateTask)
router.delete('/del', deleteTask)

// Other routes for update, delete, getTasks, etc.

module.exports = router;
                