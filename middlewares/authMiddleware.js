const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const protectUser = asyncHandler(async(req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            //Take the token from the header
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(decoded.id).select('-password');
            req.user = user;
            next();
        } catch (error) {
            res.status(401);
            console.log(error);
            throw new Error("Not authorized");
        }

    } else {
        res.status(403);
        throw new Error("Not authorized");
    }
});

module.exports = { protectUser };