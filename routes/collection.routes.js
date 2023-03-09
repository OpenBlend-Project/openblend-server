const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Error handling
const errors = require('../utils/errors.utils');

// Models
const Collection = require('../models/Collection.model');
const User = require('../models/User.model');

// Middleware
const { isAuthenticated } = require('../middleware/jwt.middleware');

// POST /api/collections/ - create a new collection
router.get("/collections", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  
  Collection.find({ creator: userId })
    .populate("creator")
    .then((collectionsFromDB) => res.status(200).json(collectionsFromDB))
    .catch((error) => res.json(error));
})


// GET /api/collections/:collectionId - get specific collection
router.get("/collections/:collectionId", isAuthenticated, (req, res, next) => {
  const collectionId = req.params['collectionId'];
  console.log(collectionId);
  const userId = req.payload._id;
  
  Collection.findOne({ _id: collectionId, creator: userId })
    .populate("formulas")
    .populate("likedBy")
    .then(collectionFromDB => res.status(200).json(collectionFromDB))
    .catch(error => res.json(error));
})

// GET /api/collections/ - get all collections associated with the current user
router.post("/collections", isAuthenticated, (req, res, next) => {
  const { name, user, isPrivate, description } = req.body;

  User.findById(user)
    .then(userFromDB => {
      const creator = userFromDB;

      Collection.create({ name, creator, isPrivate, description })
        .then(createdCollection => console.log(createdCollection))
        .catch(error => console.log(error));
    })
})


// PUT /api/collections/:collectionId - update collection
router.put("/collections/:collectionId", isAuthenticated, (req, res, next) => {
  console.log("PUT ROUTE CALLED");
  const { collectionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Collection.findByIdAndUpdate(collectionId, req.body, { new: true })
    .then((updatedFormula) => console.log(updatedFormula))
    .catch((error) => res.json(error));
});

// DELELTE /api/collections/:collectionId/formulas/:formulaId
router.delete('/collections/:collectionId/formulas/:formulaId', isAuthenticated, (req, res, next) => {
  const { collectionId, formulaId } = req.params;
  
  Collection.updateOne(
    { _id: collectionId },
    { $pull: { formulas: formulaId } }
  )
    .then((response) => {
      console.log(response);
      res.status(200).json({ message: 'Formula deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// DELETE /api/formulas/:formulaId
router.delete('/collections/:collectionId', isAuthenticated, (req, res, next) => {
  const { collectionId } = req.params;

  Collection.findOneAndDelete(collectionId)
    .then(() => {
      res.status(200).json({ message: "Collection deleted successfully" });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});


module.exports = router;