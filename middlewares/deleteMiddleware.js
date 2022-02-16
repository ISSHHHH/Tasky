const Board = require('../models/board');
const Task = require('../models/task');
const asyncHandler = require('express-async-handler');


// Delete all boards of a particular project
const deleteAllBoards = asyncHandler(async(project_id, res) => {
    try {
        await Board.deleteMany({ project: project_id });
        res.status(200).json({ message: "Boards deleted successfully!!" });
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error("couldn't delete boards");
    }
});

//Delete All Tasks for a particular board
const deleteTask = asyncHandler(async(board_id, res) => {
    try {
        await Task.deleteMany({ board: board_id });
        res.status(200).status("Task deleted");
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error("couldn't delete task");
    }
});

//Delete All tasks for a particular board
const deleteAllTasks = asyncHandler(async(boards, res) => {

    boards.map((board) => {
        deleteTask(board._id, res);
    })
});


module.exports = { deleteAllBoards, deleteAllTasks, deleteTask };