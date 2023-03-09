const { Schema, model } = require('mongoose');

const collectionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: false,
    default: []
  },
  formulas: {
    type: [Schema.Types.ObjectId],
    ref: "Formula",
    default: []
  },
  likedBy: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: []
  }
}, { timestamps: true });

module.exports = model("Collection", collectionSchema);