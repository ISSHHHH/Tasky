const Board = require('../models/board');
const { deleteTask } = require('../middlewares/deleteMiddleware');
const { checkIsValid } = require('../middlewares/validityMiddleware');
const asyncHandler = require('express-async-handler');

// @desc  Get all boards of a project
// @route GET tasky/boards/:project_id
// @access PRIVATE
const getAllBoards = asyncHandler(async(req, res) => {
    const project_id = req.params.project_id;

    // Check if project belongs to user
    if (!checkIsValid(req, project_id)) {
        res.status(400);
        throw new Error("Invalid project");
    }

    // Get all boards
    const boards = await Board.find({ project: project_id });
    if (boards) {
        res.status(200).json(boards);
    } else {
        res.status(200).json({ message: "You dont have any boards create one" });
    }
});

// @desc  Create a board 
// @route POST tasky/boards/:project_id
// @access PRIVATE
const createBoard = asyncHandler(async(req, res) => {
    const project_id = req.params.project_id;

    //Check if project belongs to user
    if (!checkIsValid(req, project_id)) {
        res.status(400);
        throw new Error("Invalid project");
    }

    const { title, description } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error("Incomplete details");
    }

    //Create new Board
    try {
        const newBoard = await Board.create({
            project: project_id,
            title,
            description
        });

        res.status(200).json(newBoard);

    } catch (error) {
        console.log(error);
        throw new Error("Sorry couldn't create board");
    }

});


// @desc  update a board 
// @route PATCH tasky/boards/:project_id/:board_id
// @access PRIVATE
const updateBoard = asyncHandler(async(req, res) => {
    const project_id = req.params.project_id;
    const board_id = req.params.board_id;

    //Check if project belongs to user
    if (!checkIsValid(req, project_id)) {
        res.status(400);
        throw new Error("Invalid project");
    }
    if (!board_id) {
        res.status(400);
        throw new Error("Fucked again");
    }
    const { title, description } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error("Incomplete details");
    }

    //Check whether board exist
    const board = await Board.findById(board_id);

    if (!board) {
        res.status(404);
        throw new Error("Board doesn't exist");
    }

    //Check if board belongs to Project
    if (board.project.toString() !== project_id) {
        res.status(403);
        throw new Error("Access denied");
    }

    board.title = title;
    board.description = description;

    //Update Board
    try {
        await Board.findByIdAndUpdate(board_id, board);
        const updatedBoard = await Board.findById(board_id);
        res.status(200).json(updatedBoard);
    } catch (error) {
        console.log(error);
        throw new Error("Sorry couldn't update board :( ...")
    }
});

// @desc  delete a board
// @route DELETE tasky/boards/:project_id/:board_id
// @access PRIVATE
const deleteBoard = asyncHandler(async(req, res) => {
    const project_id = req.params.project_id;
    const board_id = req.params.board_id;

    // Check if project belongs to user
    if (!checkIsValid(req, project_id)) {
        res.status(400);
        throw new Error("Invalid project");
    }
    if (!board_id) {
        res.status(400);
        throw new Error("Fucked again");
    }

    //Delete board
    try {
        deleteTask(board_id, res);
        await Board.findByIdAndDelete(board_id);
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error("Couldn't delete Board");
    }
});


module.exports = { getAllBoards, createBoard, updateBoard, deleteBoard };