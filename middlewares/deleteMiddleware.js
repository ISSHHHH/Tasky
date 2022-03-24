const Board = require('../models/board');
const Task = require('../models/task');
const asyncHandler = require('express-async-handler');


// Delete all boards of a particular project
const deleteAllBoards = asyncHandler(async(project_id, res) => {
    try {
        await Board.deleteMany({ project: project_id });
    } catch (error) {
        console.log(error);
        res.status(400);
    }
});

//Delete All Tasks for a particular board
const deleteTask = asyncHandler(async(board_id, res) => {
    try {
        await Task.deleteMany({ board: board_id });
    } catch (error) {
        console.log(error);
        res.status(400);
    }
});

//Delete All tasks for a particular board
const deleteAllTasks = asyncHandler(async(boards, res) => {

    boards.map((board) => {
        deleteTask(board._id, res);
    })
});


module.exports = { deleteAllBoards, deleteAllTasks, deleteTask };