const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  userId:String,
  name: String,
  directions: String,
  imageUrl: String,
  ingredients: [String],
  notes: String,
  preparation_time: String,
  cook_time: String
});

const Project = mongoose.model('Recipe', recipeSchema);

module.exports = Project;