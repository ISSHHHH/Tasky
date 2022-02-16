const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Board'
    },
    title: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 15
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: Number,
        min: 1,
        max: 3
    }

}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;