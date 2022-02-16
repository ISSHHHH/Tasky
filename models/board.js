const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
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
    }
}, {
    timestamps: true
});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;