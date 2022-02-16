const Project = require('../models/project');
const asyncHandler = require('express-async-handler');


//Check if user is credible
const checkIsValid = asyncHandler(async(req, project_id) => {
    if (!project_id) {
        return false;
    }

    const project = await Project.findById(project_id);
    return project && project.user.toString() !== req.user.id;
});

module.exports = { checkIsValid };