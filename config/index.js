const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const FRONTEND_URL = process.env.ORIGIN || "https://openblend.netlify.app";

// Middleware configuration
module.exports = (app) => {
  // Using CORS to allow requests from the frontend
  app.use(cors());
  
  // app.set("trust proxy", 1)

  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
}