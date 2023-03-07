const express = require('express');
const router = express.Router();
const axios = require('axios');

// Error handling
const errors = require('../utils/errors.utils');

// Models
const Formula = require('../models/Formula.model');

// Middleware
const { isAuthenticated } = require('../middleware/jwt.middleware');


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



// GET /api/formulas/:id - get formula with specific id that is associated to current user
router.get("/formulas/:id", isAuthenticated, (req, res, next) => {
  const formulaId = req.params['id'];
  console.log(formulaId);
  const userId = req.payload._id;
  
  Formula.findOne({ _id: formulaId, creator: userId })
  .then((formulaFromDB) => {

    // Convert Mongoose Document to JavaScript Object
    formulaFromDB = formulaFromDB.toObject();
    
    // Return formula if it has no ingredients
    if (!formulaFromDB.ingredients) return formulaFromDB;

    const promises = formulaFromDB.ingredients.map(ingredient => {

      // First, fetch the material for the current ingredient
      return axios.get(`http://localhost:3005/api/materials/${ingredient.materialId}`)
        .then((rawMaterialFromAPI) => {

          // Add the material to the ingredient object
          ingredient.material = rawMaterialFromAPI.data;

          // Check if the ingredient has a solvent defined and if the concentration is below 100%
          if (ingredient.dilution && ingredient.dilution.solventId) {
            // If so, fetch the solvent for the ingredient
            console.log("adding solvent")
            return axios.get(`http://localhost:3005/api/materials/${ingredient.dilution.solventId}`)
              .then((rawSolventFromAPI) => {

                // Add the solvent to the dilution object
                ingredient.dilution.solvent = rawSolventFromAPI.data;

                // Return the modified ingredient object
                return ingredient;
              });
          } else {

            // If the ingredient has no solvent defined, return it as is
            return ingredient;
          }
        });
    });

    return Promise.all(promises)
      .then((ingredients) => {
  
        // Replace the original ingredients array with the modified one
        formulaFromDB.ingredients = ingredients;
        return formulaFromDB;
      });
  })
  .then((formulaFromDB) => {
    res.json(formulaFromDB);
  })
  .catch((error) => {
    res.json(error);
  });
});


// GET /api/formulas - get all formulas associated to the current user
router.get("/formulas", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  
  Formula.find({ creator: userId })
    .then((formulasFromDB) => console.log("scurryyyy", formulasFromDB))
    .catch((error) => res.json(error));
})

// PUT  /api/formulas/:formulaId/ingredients/:ingredientsId - updates the ingredient of a formula
router.put('/formulas/:formulaId/ingredients/:ingredientId', (req, res) => {
  const { formulaId, ingredientId } = req.params;
  const { grams } = req.body;
  
  Formula.findById(formulaId)
    .then(formula => {
      const ingredient = formula.ingredients.id(ingredientId);
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }
        ingredient.amount.grams = grams;
      return formula.save();
    })
    .then(formula => {
      res.json(formula);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});


module.exports = router;