const { json } = require('body-parser');
const express = require('express');
const { all } = require('../app');
const router = express.Router();
const Project = require('../models/Project-model');
const mongoose = require('mongoose');
const fileUpload =require('../configs/cloudinary')

//Read
router.get('/projects', (req, res) => {
  Project.find().then((allProjectsFromDB) => {
    // Sends a json file to somewhere who requested
    res.status(200).json(allProjectsFromDB);
  }).catch((err) => {
    res.status(500).json(`Error occured ${err}`);
  });
});

//Create
router.post('/projects', (req, res) => {
  const { title, description, imageUrl } = req.body;

  if (!title || !description || !imageUrl) {
    res.status(400).json('Missing Fields');
  }

  Project.create({
    title,
    description,
    imageUrl
  }).then((response) => {
      res.status(200).json(response);
  }).catch((err) => {
    res.status(500).json(`Error occured ${err}`);
  });
});

//Delete
router.delete('/projects/:id', (req, res) => {
  Project.findByIdAndRemove(req.params.id).then(() => {
    res.status(200).json(`Project with id ${req.params.id} was deleted`);
  }).catch((err) => {
    res.status(500).json(`Error occured ${err}`);
  });
});

//Reed by id
router.get('/projects/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json('Sprecified id not valid');
    return;
  }
  Project.findById(req.params.id)
    .then((theProjectFromDB) => {
    res.status(200).json(theProjectFromDB);
  }).catch((err) => {
    res.status(500).json(`Error occured ${err}`);
  });
})

//Update
router.put('/projects/:id', (req, res) => {
  const projectWithNewData = req.body;
  Project.findByIdAndUpdate(req.params.id, projectWithNewData)
    .then(() => {
      res.status(200).json(`Project with id ${req.params.id} was updated`);
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