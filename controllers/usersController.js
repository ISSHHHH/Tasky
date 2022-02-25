const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');



const registerUser = asyncHandler(async(req, res) => {

    // Check for null values
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ message: "Please enter all fields" });
        throw new Error("Please enter all fields");
    }

    //Check if user exist
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400).json({ message: "Email already exist" });
        throw new Error("Email already exist");
        return;
    } else {
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //Create User

        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        if (!newUser) {
            res.status(400).json({ message: "Invalid User data" });
            throw new Error("Invalid User data");
            return;
        } else {
            res.status(200).json({
                _id: newUser.id,
                email: newUser.email,
                token: generateToken(newUser.id)
            });
        }
    }

});





const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {

        const matchPassword = await bcrypt.compare(password, user.password);
        if (matchPassword) {
            res.status(200).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
            throw new Error("Invalid credentials");
        }
    } else {
        res.status(400).json({ message: "Invalid credentials" });
        throw new Error("Invalid credentials");
    }


});


const getMe = asyncHandler(async(req, res) => {
    const { _id, username } = await User.findById(req.user.id);

    res.status(200).json({
        id: _id,
        username,
    })
});
/*
const deleteBoard = asyncHandler(async(req, res) => {
    const id = req.params.id;
    const project = await Project.findById(id);

    if (!project) {
        res.status(400);
        throw new Error("This project doesn't exist");
    }


});
*/

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '10d' });
};
module.exports = { registerUser, loginUser, getMe };