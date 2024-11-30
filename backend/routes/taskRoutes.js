
const express = require('express');
const { createTask } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createTask);
// Other routes for update, delete, getTasks, etc.

module.exports = router;
                