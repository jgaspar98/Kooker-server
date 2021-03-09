const { json } = require('body-parser');
const express = require('express');
const { all } = require('../app');
const router = express.Router();
const Recipe = require('../models/Recipe-model');
const mongoose = require('mongoose');
const fileUpload =require('../configs/cloudinary')

//Read
router.get('/recipes', (req, res) => {
  Recipe.find().then((allRecipesFromDB) => {
    // Sends a json file to somewhere who requested
    res.status(200).json(allRecipesFromDB);
  }).catch((err) => {
    res.status(500).json(`Error occured ${err}`);
  });
});

//Create
router.post('/recipes', (req, res) => {
  const { name, description, directions, imageUrl, ingredients, notes, preparation_time, cook_time } = req.body;

  if (!name || !ingredients|| !directions) {
    res.status(400).json('Missing Fields');
  }

  let ingredientsArray = ingredients.split(',');

  Recipe.create({
    name,
    directions,
    imageUrl,
    description,
    notes,
    ingredients: ingredientsArray,
    preparation_time,
    cook_time,
    userId: req.user._id
  }).then((response) => {
      res.status(200).json(response);
  }).catch((err) => {
    res.status(500).json(`Error occured ${err}`);
  });
});

//Delete
router.delete('/recipes/:id', (req, res) => {
  Recipe.findByIdAndRemove(req.params.id).then(() => {
    res.status(200).json(`Recipe with id ${req.params.id} was deleted`);
  }).catch((err) => {
    res.status(500).json(`Error occured ${err}`);
  });
});

//Reed by id
router.get('/recipes/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json('Sprecified id not valid');
    return;
  }
  Recipe.findById(req.params.id)
    .then((theRecipeFromDB) => {
    res.status(200).json(theRecipeFromDB);
  }).catch((err) => {
    res.status(500).json(`Error occured ${err}`);
  });
})

router.get('/user/recipes', (req, res) => {
 
  Recipe.find({ userId: req.user._id})
    .then((theRecipeFromDB) => {
    res.status(200).json(theRecipeFromDB);
  }).catch((err) => {
    res.status(500).json(`Error occured ${err}`);
  });
})


//Update
router.put('/recipes/:id', (req, res) => {
  const RecipeWithNewData = req.body;

  let ingredientsArray = '';

  if (typeof req.body.ingredients === 'string') {
    ingredientsArray = RecipeWithNewData.ingredients.split(',');
  } else {
    ingredientsArray = req.body.ingredients
  }

  Recipe.findByIdAndUpdate(req.params.id,
    {
      notes: RecipeWithNewData.notes,
      ingredients: ingredientsArray,
      name: RecipeWithNewData.name,
      directions: RecipeWithNewData.directions,
      imageUrl: RecipeWithNewData.imageUrl,
      preparation_time: RecipeWithNewData.preparation_time,
      cook_time: RecipeWithNewData.cook_time
    })
    .then(() => {
      res.status(200).json(`Recipe with id ${req.params.id} was updated`);
    }).catch((error) => {
      res.status(500).json(`Error occurred ${error}`);
    });
});

//route to add image

router.post('/upload', fileUpload.single('file'), (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path });
  }
  catch (error) {
    res.status(500).json(`Error occurred ${error}`);
  };
});

//Route to add image to cloudinary
router.post('/upload', fileUpload.single('file'), (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path});
  } 
  catch(error) {
    res.status(500).json(`Error occurred ${error}`);
  };
});
module.exports = router;