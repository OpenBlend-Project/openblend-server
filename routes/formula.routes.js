const express = require('express');
const router = express.Router();

// Error handling
const errors = require('../utils/errors.utils');

// Models
const Formula = require('../models/Formula.model');


// POST /api/formulas - Creates a new formula
router.post("/formulas", (req, res, next) => {
  const {
    name,
    version,
    isPrivate,
    type,
    creator,
    stage,
    tagline,
    description,
    olfactiveFamily,
    concentration,
    ingredients,
    likedBy
  } = req.body;

  Formula.create({
    name,
    version,
    isPrivate,
    type,
    creator,
    stage,
    tagline,
    description,
    olfactiveFamily,
    concentration,
    ingredients,
    likedBy
  })
  .then((response) => res.json(response))
  .catch((error) => res.json(error));
})

module.exports = router;