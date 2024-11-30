
const express = require('express');
const { createTask, Test } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createTask);
router.get('/test', Test)
// Other routes for update, delete, getTasks, etc.

module.exports = router;
                