const express = require('express');
const router = express.Router();
const { protectUser } = require('../middlewares/authMiddleware');
const { getAllTasks, createTask, updateTask } = require('../controllers/tasksController');

router.get('/:project_id/:board_id', protectUser, getAllTasks);
router.post('/:project_id/:board_id', protectUser, createTask);
router.patch('/:project_id/:board_id/:task_id', protectUser, updateTask);

module.exports = router;