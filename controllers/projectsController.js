const Project = require('../models/project');
const Board = require('../models/board');
const asyncHandler = require('express-async-handler');
const { deleteAllBoards, deleteAllTasks, deleteTask } = require('../middlewares/deleteMiddleware');



// @desc get all projects
// @route GET tasky/projects
// @access PRIVATE
const getAllProjects = asyncHandler(async(req, res) => {
    const projects = await Project.find({ user: req.user.id });
    if (projects) res.status(200).json(projects);
    else res.status(200).json({ message: "You dont have any projects create one" });
});


// @desc Get single project
// @route GET tasky/projects/:project_id
// @access PRIVATE
const getProject = asyncHandler(async(req, res) => {
    const project = await Project.findById(req.params.project_id);
    if (project) {

        if (project.user.toString() !== req.user.id) {
            res.status(403).json({ message: "Sorry not your property :)" });;
            throw new Error("Sorry not your property :)");
        }

        res.status(200).json(project);

    } else {
        res.status(400).json({ message: "Project doesn't exist" });
        throw new Error("Project doesn't exist");
    }
});


// @desc Create project
// @route POST tasky/projects/
// @access PRIVATE
const createProject = asyncHandler(async(req, res) => {

    const { title, description } = req.body;


    // check if default boards are created
    const project = await Project.create({
        user: req.user.id,
        title,
        description
    });

    // check if project is created
    if (project) {
        // creating default boards [todo,done]
        const todo = await Board.create({
            project: project._id,
            title: "To do Task",
            description: "start working on your very first tasks"
        });
        const done = await Board.create({
            project: project._id,
            title: "Completed",
            description: "List of completed tasks"
        });

        if (todo && done) {
            project.todoBoard = todo._id;
            project.doneBoard = done._id;
            const newProject = await Project.findByIdAndUpdate(project._id, project);
            if (newProject) {
                res.status(200).json(newProject);
            } else {
                res.status(500).json({ message: "Sorry couldn't create project" });
                throw new Error("Sorry couldn't create project");
            }
        } else {
            res.status(500).json({ message: "Sorry couldn't create project" });
            throw new Error("Sorry couldn't create project");
        }

    } else {
        res.status(500);
        console.log(error);
        throw new Error("Sorry couldn't create project");
    }
});


// @desc  Update project
// @route PATCH tasky/projects/:project_id
// @access PRIVATE
const updateProject = asyncHandler(async(req, res) => {
    const id = req.params.project_id;
    const project = await Project.findById(id);

    //Check if project exists
    if (!project) {
        res.status(400).json({ message: "This project doesn't exist" });
        throw new Error("This project doesn't exist");
    }

    //Check if project belongs to user
    if (project.user.toString() !== req.user.id) {
        res.status(403).json({ message: "Sorry not your property :)" });
        throw new Error("Sorry not your property :)");
    }

    //Update project
    const { title, description } = req.body;
    if (!title || !description) {
        res.status(400).json({ message: "invalid data" });
        throw new Error("invalid data");
    }

    try {
        await Project.findByIdAndUpdate(id, { title, description });
        const updatedProject = await Project.findById(id);
        res.status(200).json(updatedProject);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Sorry Couldn't update project :(" });
        throw new Error("Sorry Couldn't update project :( ")
    }

});

// @desc  Delete project
// @route DELETE tasky/projects/:project_id
// @access PRIVATE
const deleteProject = asyncHandler(async(req, res) => {
    const id = req.params.project_id;
    const project = await Project.findById(id);

    //Check if project exists
    if (!project) {
        res.status(400).json({ message: "This project doesn't exist" });
        throw new Error("This project doesn't exist");
    }

    //Check if project belongs to user
    if (project.user.toString() !== req.user.id) {
        res.status(403).json({ message: "Sorry not your property :)" });;
        throw new Error("Sorry not your property :)");
    }

    const boards = await Board.find({ project: id });
    deleteAllTasks(boards, res);
    deleteAllBoards(id, res);

    try {
        await Project.findByIdAndDelete(id);
        res.status(200).json({
            message: "Project Deleted Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "couldn't delete Project"
        });
        throw new Error("couldn't delete Project");
    }
});


module.exports = { getAllProjects, getProject, createProject, updateProject, deleteProject };