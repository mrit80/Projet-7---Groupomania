'use strict';

// Importation des middlewares
const express = require('express');
const router = express.Router();

// Controller s'inscrire
const userCtrl = require('../controllers/signup');

//=================================================================

// Route s'inscrire
router.post('/', userCtrl.signup);

// Execution
module.exports = router;
