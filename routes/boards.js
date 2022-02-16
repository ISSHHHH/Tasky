const express = require('express');
const router = express.Router();
const { protectUser } = require('../middlewares/authMiddleware');
const { getAllBoards, createBoard, updateBoard, deleteBoard } = require('../controllers/boardsController');

router.get('/:project_id', protectUser, getAllBoards);
router.post('/:project_id', protectUser, createBoard);
router.patch('/:project_id/:board_id', protectUser, updateBoard);
router.delete('/:project_id/:board_id', protectUser, deleteBoard);

module.exports = router;