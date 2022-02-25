/* Importing dependencies */
const { errorHandler } = require('./middlewares/errorMiddleware');
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

/*-------------------------------------*/


/* Connect to Database */
connectDB();

/*------------------------------------*/


/*Importing Routes*/
const projectsRoute = require('./routes/projects');
const boardsRoute = require('./routes/boards');
const usersRoute = require('./routes/users');
const tasksRoute = require('./routes/tasks');

/*-------------------------------------*/

/* Middle wares */
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);
app.use('/tasky/projects', projectsRoute);
app.use('/tasky/boards', boardsRoute);
app.use('/tasky/users', usersRoute);
app.use('/tasky/tasks', tasksRoute);
/*-------------------------------------*/


/* Starting server */

app.listen(4000, () => {
    console.log("Server started at PORT : 4000");
});