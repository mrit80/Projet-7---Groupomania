'use strict';

// Importation des middleware
const express = require('express');
const path = require('path');
require('dotenv').config();

// Erreur
const HttpError = require('./models/http-error');

// App Routes
const signupRoutes = require('./routes/signup-route');
const loginRoutes = require('./routes/login-route');
const userRoutes = require('./routes/user-routes');
const postRoutes = require('./routes/posts-routes');

// Initialiser express App
const app = express();

// Contrôles Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Express Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Access Routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/profile', userRoutes);
app.use('/posts', postRoutes);

// Error Handling 404
app.use((req, res, next) => {
  const error = new HttpError('Route non trouvée', 404);
  throw error;
});

// Error Handling App
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || 'Un problème est survenu',
  });
});

module.exports = app;
