const Project = require('../models/project');
const Task = require('../models/task');
const Board = require('../models/board');
const { checkIsValid } = require('../middlewares/validityMiddleware');
const asyncHandler = require('express-async-handler');



//Checks whether board belongs to task
const validBoard = asyncHandler(async(req) => {
    const board = await Board.findById(req.params.board_id);
    return board && board.project.toString() === req.project_id;
});


// @desc get all tasks
// @route GET tasky/tasks/:project_id/:board_id
// @access PRIVATE
const getAllTasks = asyncHandler(async(req, res) => {
    const { project_id, board_id } = req.params;

    // Check if project belongs to user
    if (!checkIsValid(req, project_id)) {
        res.status(400);
        throw new Error("Invalid project");
    }

    //Check for valid board
    if (!validBoard(req)) {
        res.status(400);
        throw new Error("Inavlid Board");
    }

    // Get all tasks
    const tasks = await Task.find({ board: board_id });

    if (tasks)
        res.status(200).json(tasks);
    else
        res.status(200).json({ message: "You don't have any tasks...create some" });


});

// @desc create task(for a board)
// @route POST tasky/tasks/:project_id/:board_id
// @access PRIVATE
const createTask = asyncHandler(async(req, res) => {

    const { project_id, board_id } = req.params;

    // Check if project belongs to user
    if (!checkIsValid(req, project_id)) {
        res.status(400);
        throw new Error("Invalid project");
    }

    if (!validBoard(req)) {
        res.status(400);
        throw new Error("Inavlid Board");
    }

    const { title, description, priority, deadline, status } = req.body;

    if (!title || !description || !priority || !deadline || !status) {
        res.status(400);
        throw new Error("Please provide all details..");
    }
    try {
        const newTask = await Task.create({
            board: board_id,
            title,
            description,
            priority,
            deadline,
            status
        })

        res.status(200).json(newTask);
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error("Sorry couldn't create task");
    }
});


// @desc update a task
// @route PATCH tasky/tasks/:project_id/:board_id/:task_id
// @access PRIVATE
const updateTask = asyncHandler(async(req, res) => {
    const { project_id, board_id, task_id } = req.params;

    // Check if project belongs to user
    if (!checkIsValid(req, project_id)) {
        res.status(400);
        throw new Error("Invalid project");
    }

    if (!validBoard(req)) {
        res.status(400);
        throw new Error("Inavlid Board");
    }

    if (!task_id) {
        res.status(400);
        throw new Error("Invalid task");
    }

    const { board, title, description, priority, deadline, status } = req.body;

    try {
        const task = await Task.findById(task_id);

        if (task.board.toString() !== board_id) {
            res.status(400);
            throw new Error("Invalid task");
        }

        task.title = title;
        task.description = description;
        task.priority = priority;
        task.deadline = deadline;
        task.status = status;
        task.board = board;

        await Task.findByIdAndUpdate(task_id, task);
        const updatedTask = await Task.findById(task_id);
        res.status(200).json(updatedTask);

    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error("Sorry couldn't create task");
    }
});


// @desc delete task
// @route DELETE tasky/tasks/:project_id/:board_id/:task_id
// @access PRIVATE
const deleteATask = asyncHandler(async(req, res) => {
    const { project_id, board_id, task_id } = req.params;

    // Check if project belongs to user
    if (!checkIsValid(req, project_id)) {
        res.status(400);
        throw new Error("Invalid project");
    }

    if (!validBoard(req)) {
        res.status(400);
        throw new Error("Inavlid Board");
    }

    if (!task_id) {
        res.status(400);
        throw new Error("Invalid task");
    }

    try {
        const task = await Task.findById(task_id);

        if (task.board.toString() !== board_id) {
            res.status(400);
            throw new Error("Invalid task");
        }

        await Task.findByIdAndDelete(task_id);
        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error("Sorry couldn't create task");
    }


});

module.exports = { getAllTasks, createTask, updateTask, deleteATask };