const express = require('express');
const router = express.Router();
const { protectUser } = require('../middlewares/authMiddleware');
const { getMe, registerUser, loginUser } = require('../controllers/usersController');


router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protectUser, getMe);

module.exports = router;