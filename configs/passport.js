const passport = require('passport');
// Local auth using our database
const LocalStrategy = require('passport-local');
const User = require('../models/User-model');
const bcrypt = require('bcryptjs');

//Passport - Set the user in the session
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

//Passport - Get the user from session
//req.user
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

//Passport - Local Authentication 
passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }
    if (!foundUser) {
      next(null, false, { message: 'Invalid login' });
      return;
    }
    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Invalid login' });
      return;
    }
    next(null, foundUser);
  });
}));