'use strict';

// Importation des middlewares

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Controller utilisateur
const userCtrl = require('../controllers/user');

//=================================================================

// Route récupérer un profil utilisateur
router.get('/:id', auth, userCtrl.getUserProfile);

// Route modifier son profil ou son mot de passe
router.patch('/update', auth, multer, userCtrl.updateUserProfile);
router.put('/update', auth, userCtrl.updatePassword);

// Route supprimé un utilisateur
router.delete('/:id', auth, userCtrl.deleteProfile);

// Execution
module.exports = router;
