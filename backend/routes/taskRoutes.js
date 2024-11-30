
const express = require('express');
const { createTask, Test, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createTask);
router.get('/test', Test)
router.get('/tasks', getTasks)
router.put('/update/:taskId', updateTask)
router.delete('/del', deleteTask)



module.exports = router;
                