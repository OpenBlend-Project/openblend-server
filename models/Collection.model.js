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
    type: String
  },
  formulas: {
    type: [Schema.Types.ObjectId],
    ref: "Formula"
  },
  likedBy: {
    type: [Schema.Types.ObjectId],
    ref: "User"
  }
}, { timestamps: true });

module.exports = model("Collection", collectionSchema);