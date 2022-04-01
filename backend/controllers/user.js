'use strict';

// Importation des middlewares
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const fs = require('fs');
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

// RegEX
const regExText = /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ '\-]+$/i;

// Décrypter l'UserID
const decodeUid = (authorization) => {
  const token = authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return {
    id: decodedToken.userId,
    clearance: decodedToken.account,
  };
};

// Récupérer le profil de l'utilisateur
//==========================================================================================================
exports.getUserProfile = (req, res, next) => {
  const { id } = req.params;

  const string = `SELECT 
            firstName, 
            lastName, 
            email, 
            photo_url, 
            role, 
            (SELECT COUNT(Users_id) FROM posts WHERE Users_id = ? ) AS postsCount
            FROM users WHERE id = ?`;
  const inserts = [id, id, id];
  const sql = mysql.format(string, inserts);

  const query = db.query(sql, (error, profile) => {
    if (!error) {
      res.status(200).json(profile[0]);
    } else {
      return next(new HttpError('Utilisateur non trouvé', 404));
    }
  });
};

// Modifier le profil
//==========================================================================================================
exports.updateUserProfile = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);
  const { firstName, lastName, email, role } = req.body;

  let imageUrl;

  if (req.body.image === 'null') {
    imageUrl;
    // Mise à jour des données
  } else if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`;
    // Mise à jour de l'image et des données
  } else {
    imageUrl = req.body.image;
    // Mise à jour des données uniquement (image déjà présente)
  }

  // Validation des données
  let isFirstName = validator.matches(firstName, regExText);
  let isLastName = validator.matches(lastName, regExText);
  let isEmail = validator.isEmail(email);

  let isRole = true;

  if (req.body.role) {
    isRole = validator.matches(String(role), regExText);
  }

  if (isFirstName && isLastName && isEmail && isRole) {
    const string =
      'UPDATE users SET firstName = ?, lastName = ?, email = ?, photo_url = ?, role = ? WHERE id = ?';
    const inserts = [firstName, lastName, email, imageUrl, role, user.id];
    const sql = mysql.format(string, inserts);

    // Requête
    const query = db.query(sql, (error, profile) => {
      if (!error) {
        res.status(200).json({ message: 'Mise à jour du profil effectuée' });
      } else {
        return next(new HttpError('La modification du profil a échoué', 500));
      }
    });
  } else if (!isFirstName || !isLastName || !isEmail || !isRole) {
    // Erreur

    let errorMessages = [];
    let answ;
    answ = !isFirstName ? errorMessages.push(' Prénom') : '';
    answ = !isLastName ? errorMessages.push(' Nom') : '';
    answ = !isEmail ? errorMessages.push(' E-mail') : '';
    answ = !isRole ? errorMessages.push(' Poste') : '';

    errorMessages = errorMessages.join();

    return next(
      new HttpError(
        'Veuillez corriger les champs suivants :' + errorMessages,
        400
      )
    );
  }
};

// Modifier son mot de passe
//==========================================================================================================
exports.updatePassword = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);
  const { password } = req.body;

  // Vérification du mot de passe
  if (passValid.validate(password, options).valid) {
    // Hash du nouveau mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const string = 'UPDATE users SET password = ? WHERE id = ? ';
      const inserts = [hash, user.id];
      const sql = mysql.format(string, inserts);

      // Requête
      const query = db.query(sql, (error, password) => {
        if (!error) {
          res.status(201).json({ message: 'Mot de passe modifié' });
        } else {
          return next(
            new HttpError('La modification du mot de passe a échoué', 500)
          );
        }
      });
    });
  } else {
    return next(new HttpError('Mot de passe invalide', 401));
  }
};

// Supprimer un utilisateur
//==========================================================================================================
exports.deleteProfile = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);

  // Vérifier avec UserID si c'est bien l'utilisateur qui fait la demande
  if (user.id === Number(req.params.id)) {
    const string = 'DELETE FROM users WHERE id = ? ';
    const inserts = [user.id];
    const sql = mysql.format(string, inserts);

    // Requête
    const query = db.query(sql, (error, result) => {
      if (!error) {
        res.status(200).json({ message: 'Utilisateur supprimé' });
      } else {
        return next(new HttpError('Erreur', 500));
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "Vous n'avez pas les droits pour faire cela" });
  }
};
