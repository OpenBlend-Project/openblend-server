const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');

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
    .then((newFormula) => res.json(newFormula))
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
      return axios.get(`https://scentcrate.cyclic.app/api/materials/${ingredient.materialId}`)
        .then((rawMaterialFromAPI) => {

          // Add the material to the ingredient object
          ingredient.material = rawMaterialFromAPI.data;

          // Check if the ingredient has a solvent defined and if the concentration is below 100%
          if (ingredient.dilution && ingredient.dilution.solventId) {
            // If so, fetch the solvent for the ingredient
            console.log("adding solvent")
            return axios.get(`https://scentcrate.cyclic.app/api/materials/${ingredient.dilution.solventId}`)
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
    .then((formulasFromDB) => res.json(formulasFromDB))
    .catch((error) => res.json(error));
})

// PUT  /api/formulas/:formulaId/ingredients/:ingredientsId - updates the ingredient of a formula
router.put('/formulas/:formulaId/ingredients/:ingredientId', isAuthenticated, (req, res) => {
  const { formulaId, ingredientId } = req.params;
  const { grams, percent } = req.body;
  
  Formula.findById(formulaId)
    .then(formula => {
      const ingredient = formula.ingredients.id(ingredientId);
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }
        ingredient.amount.grams = grams;
        ingredient.amount.percent = percent;
      return formula.save();
    })
    .then(formula => {
      res.json(formula);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

// PUT - /api/formulas/:formulaId update formula
router.put("/formulas/:formulaId", isAuthenticated, (req, res, next) => {
  console.log("PUT ROUTE CALLED");
  const { formulaId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(formulaId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Formula.findByIdAndUpdate(formulaId, req.body, { new: true })
    .then((updatedFormula) => res.json(updatedFormula))
    .catch((error) => res.json(error));
});

// DELETE - Remove 
router.delete('/formulas/:formulaId/ingredients/:ingredientId', isAuthenticated, (req, res) => {
  const { formulaId, ingredientId } = req.params;
  
  Formula.updateOne(
    { _id: formulaId },
    { $pull: { ingredients: { _id: ingredientId } } }
  )
    .then(() => {
      res.status(200).json({ message: 'Ingredient deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});


// DELETE /api/formulas/:formulaId
router.delete('/formulas/:formulaId', isAuthenticated, (req, res, next) => {
  const { formulaId } = req.params;

  Formula.findOneAndDelete(formulaId)
    .then(() => {
      res.status(200).json({ message: "Formula deleted successfully" });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});


module.exports = router;