const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        minLength: 4,
    },
    description: {
        type: String,
        required: true,
    },
    todoBoard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    },
    doneBoard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }
}, {
    timestamps: true
});

const project = mongoose.model('project', projectSchema);
module.exports = project;