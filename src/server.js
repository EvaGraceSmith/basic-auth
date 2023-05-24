'use strict';

// this is where we will connect to our database
const express = require('express');
const authRouter = require('./auth/router');

// Prepare the express app
const app = express();

//JSON input and put the data on req.body
app.use(express.json());

//FORM input and put the data on req.body
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRouter);

//
const start = (port) => app.listen(port, () => console.log('server up on port:', port));

// Export an object with the express app and a start method
module.exports = { app, start };
