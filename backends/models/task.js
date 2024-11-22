const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const taskSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    Description: {type: String},
    deadline: {type: Date},
    priority: {type: String, enum:['low', 'medium', 'high'], default: 'low'},
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;