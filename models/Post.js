const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  cocktailName: {
    type: String,
    require: true,
  },
  ingredients: {
    type: Array,
    require: true,
  },
  method:{
    type: String,
    require: true,
  },
  garnish: {
    type: String,
    require: true,
  },
  note: {
    type: String,
    require: false,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  ibaCocktail: {
    type: Boolean,
    required: false,
  },
  public: {
    type: Boolean,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
