'use strict';

// Importation du middleware
const jwt = require('jsonwebtoken');

// Erreur
const HttpError = require('../models/http-error');

// Configuration du token
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw next(new HttpError("Vous n'avec pas l'autorisation", 401));
    } else {
      next();
    }
  } catch {
    return next(new HttpError("Vous n'êtes pas reconnu", 401));
  }
};
