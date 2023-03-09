// Gets access to environment variables
require("dotenv").config();

// Connects to the database
require("./db");

// Handles http requests
const express = require("express");

const app = express();

require("./config")(app);

// Routes
const indexRouter = require('./routes/index.routes');
app.use('/', indexRouter);

const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

const formulaRouter = require('./routes/formula.routes');
app.use('/api', formulaRouter);

const collectionRouter = require('./routes/collection.routes');
app.use('/api', collectionRouter);


module.exports = app;
