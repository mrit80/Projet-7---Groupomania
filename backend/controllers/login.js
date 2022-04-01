'use strict';

// Importation des middlewares
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
// Erreur
const HttpError = require('../models/http-error');
// MySQL DB
const db = require('../config/db');

// Login utilisateur
exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // Vérifie si les champs sont vides
  if (!email && !password) {
    return next(new HttpError('Veuillez rentrer vos identifiants', 400));
  }

  if (!email) {
    return next(new HttpError('Veuillez rentrer votre email', 400));
  }

  if (!password) {
    return next(new HttpError('Veuillez rentrer votre mot de passe', 400));
  }

  // Requête de l'utilisateur à la DB
  const string =
    'SELECT id, email, password, account FROM users WHERE email = ?';
  const inserts = [email];
  const sql = mysql.format(string, inserts);

  const query = db.query(sql, (error, user) => {
    // Vérifier si l'utilisateur existe
    if (user.length === 0) {
      return next(new HttpError("Votre adresse e-mail n'est pas valide", 401));
    }

    // Comparer le hash et le mot de passe
    bcrypt.compare(password, user[0].password).then((valid) => {
      if (!valid) {
        return next(new HttpError("Votre mot de passe n'est pas valide", 401));
      }
      // Signe l' id de l'utilisateur et retourne JWT
      res.status(200).json({
        userId: user[0].id,
        account: user[0].account,
        token: jwt.sign(
          {
            userId: user[0].id,
            account: user[0].account,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES,
          }
        ),
      });
    });
  });
};
