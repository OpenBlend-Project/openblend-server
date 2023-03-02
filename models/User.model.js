const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    avatar: {
      type: String
    },
    bio: {
      type: String
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  content: {
    collections: {
      type: [Schema.Types.ObjectId],
      ref: "Collection"
    }
  }
}, { timestamps: true })

module.exports = model("User", userSchema);