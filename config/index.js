const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
// const FRONTEND_URL = process.env.ORIGIN || "https://openblend.netlify.app";

// Middleware configuration
module.exports = (app) => {
  // Using CORS to allow requests from the frontend
  app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:8080', 'https://openblend.netlify.app'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Credentials', false);
    next();
  });
  
  // app.set("trust proxy", 1)

  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
}