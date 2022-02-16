const express = require('express');
const router = express.Router();
const { protectUser } = require('../middlewares/authMiddleware');
const { getAllProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectsController');


router.get('/', protectUser, getAllProjects);
router.get('/:project_id', protectUser, getProject);
router.post('/', protectUser, createProject);
router.patch('/:project_id', protectUser, updateProject);
router.delete('/:project_id', protectUser, deleteProject);




module.exports = router;