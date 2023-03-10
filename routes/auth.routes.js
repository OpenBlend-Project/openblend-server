const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware
const { isAuthenticated } = require('../middleware/jwt.middleware');

// Error handling
const errors = require('../utils/errors.utils');

// Models
const User = require('../models/User.model');

const saltRounds = 10;

// POST /auth/signup - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if username or email or password are provided as empty string
  if (username === "" || email === "" || password === "") {
    res.status(400).json({ message: errors.mandatorySignupFieldsMissing.errorMessage });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: errors.invalidEmail.errorMessage });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ message: errors.weakPassword.errorMessage });
    return;
  }

  
  User.findOne({ username })
  .then((foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: errors.duplicateUsername.errorMessage });
      return;
    }
    
    User.findOne({ email })
      .then((foundUser) => {
        if (foundUser) {
          res.status(400).json({ message: errors.duplicateEmail.errorMessage });
          return;
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        return User.create({ username, email, password: hashedPassword })
      })
      .then((createdUser) => {
        const { username, email, _id } = createdUser;
        const user = { username, email, _id };
        res.status(200).json({ user });

      })
      .catch((error) => {
        res.status(500).json({ message: errors.error500 });
      });
    });
});


// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: errors.mandatorySigninFieldsMissing.message });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: errors.userNotFound.message });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, email, username } = foundUser;

        const payload = { _id, email, username };

        const authToken = jwt.sign(
          payload,
          process.env.TOKEN_SECRET,
          { algorithm: "HS256", expiresIn: "6h" }
        );

        res.status(200).json({ authToken });
      } else {
        res.status(401).json({ message: errors.wrongPassword.errorMessage });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: errors.error500.errorMessage });
    });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload)
});

module.exports = router;