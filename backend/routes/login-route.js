'use strict';
// Importation des middlewares
const express = require('express');
const router = express.Router();

// Controller connexion
const userCtrl = require('../controllers/login');

//=================================================================

// Route de connexion
router.post('/', userCtrl.login);

// Execution
module.exports = router;
