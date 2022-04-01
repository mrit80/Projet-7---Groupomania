'use strict';

//Importation des middlewares
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Controller
const postCtrl = require('../controllers/posts');

//=================================================================

// Route création des Publications et des Réponses
router.post('/', auth, multer, postCtrl.createPost);
router.post('/comment', auth, postCtrl.postComment);

// Route récupérer des Publications
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);

// Route supprimer des Publications et des réponses
router.delete('/comment/:id', auth, postCtrl.deleteComment);
router.delete('/:id', auth, postCtrl.deletePost);

// Execution
module.exports = router;
