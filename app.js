// Gets access to environment variables
require("dotenv").config();

// Connects to the database
require("./db");

// Handles http requests
const express = require("express");

var app = express();

require("./config")(app);

// Route handling
var indexRouter = require('./routes/index.routes');
app.use('/api', indexRouter);


module.exports = app;
