'use strict';

// Importation des middlewares
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const validator = require('validator');
const passValid = require('secure-password-validator');

// Erreur
const HttpError = require('../models/http-error');

// MySQL DB
const db = require('../config/db');

// Validation de mot de passe
const options = {
  // Minimum 8 caractères
  minLength: 8,
  // Maximum 50 caractères
  maxLength: 50,
  // Un chiffre au moins
  digits: true,
  // Une lettre au moins
  letters: true,
  // Une majuscule au moins
  uppercase: true,
  // Une miniscule au moins
  lowercase: true,
  // Pas de symbole
  symbols: false,
};

// Créer un utilisateur
exports.signup = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // RegEx
  const regExText = /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ \'\- ]+$/i;

  // Validation des données de l'utilisateur
  let isFirstName = validator.matches(String(firstName), regExText);
  let isLastName = validator.matches(String(lastName), regExText);
  let isEmail = validator.isEmail(String(email));
  let isPassword = passValid.validate(String(password), options).valid;

  if (isFirstName && isLastName && isEmail && isPassword) {
    // Hash du mot de pass de l'utilisateur avec bcrypt
    bcrypt.hash(password, 10, (error, hash) => {
      console.log(password);
      console.log(error);
      // Sauvegarder les données de l'utilisateur dans la DB MySQL
      const string =
        'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
      const inserts = [firstName, lastName, email, hash];
      const sql = mysql.format(string, inserts);

      const signupUser = db.query(sql, (error, user) => {
        if (!error) {
          //  // Signe l' id de l'utilisateur et retourne JWT
          res.status(201).json({
            message: 'Utilisateur créé correctement',
            userId: user.insertId,
            account: 'user',
            token: jwt.sign(
              {
                userId: user.insertId,
                account: 'user',
              },
              process.env.JWT_SECRET,
              {
                expiresIn: process.env.JWT_EXPIRES,
              }
            ),
          });
        } else {
          return next(new HttpError("L'utilisateur existe déjà", 400));
        }
      });
    });
  } else if (!isFirstName || !isLastName || !isEmail || !isPassword) {
    // Erreur
    let errorMessages = [];

    let anws = !isFirstName ? errorMessages.push(' Prénom') : '';
    anws = !isLastName ? errorMessages.push(' Nom') : '';
    anws = !isEmail ? errorMessages.push(' E-mail') : '';
    anws = !isPassword ? errorMessages.push(' Mot de passe') : '';
    errorMessages = errorMessages.join();

    return next(
      new HttpError(
        'Veuillez corriger les champs suivants :' + errorMessages,
        400
      )
    );
  }
};
