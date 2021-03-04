require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
const session      = require('express-session');
const passport     = require('passport');

//Initialize passport configuration
require('./configs/passport');


mongoose
  .connect(process.env.MONGODB_URI , {useNewUrlParser: true , useUnifiedTopology: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave:false,
  cookie: {
    sameSite: true, // the requester is on the same domain
    secure: false, // not using https
    httpOnly: true, // site only on http
    MaxAge:60000 // time to live
  },
  rolling:true // session get refreshed
}))

// Initializes passport
app.use(passport.initialize());
// Initializes passport session
app.use(passport.session());

//allowing aur frontend to get resources
//from our backend API
app.use(
  cors({
    credentials: true,
    
    origin:[process.env.CLIENT_HOSTNAME]
  })
)

const index = require('./routes/index');
app.use('/', index);

const projectRoutes = require('./routes/project-routes');
app.use('/api', projectRoutes);

const authRoutes = require('./routes/auth-routs');
app.use('/api', authRoutes);

module.exports = app;
