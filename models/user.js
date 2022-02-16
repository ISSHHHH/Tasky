const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter your username"],
        minLength: 4,
        maxLength: 15
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"]
    }

}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;