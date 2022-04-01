'use strict';

// Importation des middlewares
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const fs = require('fs');
// Erreur
const HttpError = require('../models/http-error');
// MySQL DB
const db = require('../config/db');

// Décrypter l'UserID
const decodeUid = (authorization) => {
  const token = authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return {
    id: decodedToken.userId,
    clearance: decodedToken.account,
  };
};

// Création d'une publication
//==========================================================================================================
exports.createPost = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);
  const { title } = req.body;

  let imageUrl = '';
  if (req.file != undefined) {
    imageUrl = `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`;
  }

  // Vérifier s'il y a une image dans le body
  if (req.body.image === 'null') {
  }

  // Requête
  const string =
    'INSERT INTO posts (Users_id, title, image_url) VALUES (?, ?, ? )';
  const inserts = [user.id, title, imageUrl];
  const sql = mysql.format(string, inserts);

  const createPost = db.query(sql, (error, post) => {
    if (!error) {
      res.status(201).json({ message: 'Publication posté' });
    } else {
      return next(new HttpError("La publication n'a pas était posté", 500));
    }
  });
};

// Créer une réponse
//==========================================================================================================
exports.postComment = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);
  const { postId, message } = req.body;
  console.log(req.body);
  // Requête
  const string =
    'INSERT INTO comments (Users_id, Posts_id, message) VALUES (?, ?, ?)';
  const inserts = [user.id, postId, message];
  const sql = mysql.format(string, inserts);

  const createComment = db.query(sql, (error, commentId) => {
    if (!error) {
      const string = `SELECT 
                                users.firstName, 
                                users.lastName, 
                                users.photo_url, 
                                comments.Posts_id AS id, 
                                comments.Users_id AS user_id,  
                                comments.message, 
                                comments.comment_date 
                            FROM comments INNER JOIN posts ON comments.posts_id = posts.id  
                            INNER JOIN users ON comments.Users_id = users.id 
                            WHERE comments.id = ?`;

      const inserts = [commentId.insertId];
      const sql = mysql.format(string, inserts);

      // Requête
      const returnComment = db.query(sql, (error, response) => {
        if (!error) {
          res.status(201).json(response);
        } else {
          return next(new HttpError("La réponse n'a pas été créé", 500));
        }
      });
    } else {
      return next(new HttpError("La réponse n'a pas été créé", 500));
    }
  });
};

// Récupérer toutes les publications
//==========================================================================================================
exports.getAllPosts = (req, res, next) => {
  // Obtenir l'user ID
  const user = decodeUid(req.headers.authorization);

  // Fetch liste de posts
  const getPosts = () => {
    return new Promise((resolve, reject) => {
      try {
        const string = `SELECT
                                    u.id AS user_id,
                                    u.firstName,
                                    u.lastName,
                                    u.photo_url,
                                    p.title,
                                    p.post_date,
                                    p.image_url,
                                    p.id AS post_id
                                FROM posts AS p
                                JOIN users AS u ON p.Users_id = u.id
                                GROUP BY p.id ORDER BY post_date DESC`;
        const inserts = [user.id];
        const sql = mysql.format(string, inserts);

        // Requête
        const getPosts = db.query(sql, (error, posts) => {
          if (error) reject(error);
          resolve(posts);
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  // Fetch comments par post
  const getCommentCount = (post_id) => {
    return new Promise((resolve, reject) => {
      try {
        const string =
          'SELECT COUNT(*) as comments FROM comments WHERE Posts_id = ?';
        const inserts = [post_id];
        const sql = mysql.format(string, inserts);

        // Requête
        const commentCount = db.query(sql, (error, comments) => {
          if (error) reject(error);
          resolve(comments[0].comments);
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const composePost = async () => {
    try {
      // Résultat des posts
      let finalPost = await getPosts();
      // Pour chaque post, vérifier commentaires et ajoutez-les
      for (let i = 0; i < finalPost.length; i++) {
        // Résultat des commentaires
        const comments = await getCommentCount(finalPost[i].post_id);
        finalPost[i].comments = comments;
      }
      return finalPost;
    } catch (err) {
      return new Error(err);
    }
  };

  composePost()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      return next(
        new HttpError("Les publications n'ont pas étaient trouvées", 500)
      );
    });
};

// Récupérer une publication
//==========================================================================================================
exports.getOnePost = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);
  let postId = req.params.id;

  const postSql = `SELECT
                        u.id AS user_id,
                        u.firstName,
                        u.lastName,
                        u.photo_url,
                        p.title,
                        p.post_date,
                        p.image_url,
                        p.id AS post_id
                    FROM posts AS p
                    JOIN users AS u ON p.Users_id = u.id
                    WHERE p.id = ?
                    GROUP BY p.id `;

  const commentsSql = `SELECT 
                            users.id AS user_id, 
                            users.firstName, 
                            users.lastName, 
                            users.photo_url, 
                            comments.id, 
                            comments.comment_date, 
                            comments.message 
                        FROM comments 
                        INNER JOIN users ON comments.Users_id = users.id 
                        WHERE Posts_id = ?`;
  db.query(
    `${postSql}; ${commentsSql}`,
    [user.id, postId, postId],
    (error, result, fields) => {
      if (!error) {
        // "results" Table avec un élément de publication et un élément avec les réponses
        let results = [
          {
            // Prendre le résultat de la requête (publication)
            ...result[0][0],

            // Compte le nombre de réponses
            commentsCounter: result[1].length,
          },
          {
            // Ajoute les réponses de la deuxième requête (les commentaires)
            comments: [...result[1]],
          },
        ];
        res.status(200).json(results);
      } else {
        return next(
          new HttpError(
            "Erreur de requête, la publication n'a pas pu être récuperée",
            500
          )
        );
      }
    }
  );
};

// Supprimer une publication
//==========================================================================================================
exports.deletePost = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);
  console.log(req.body);
  let string = '';
  let inserts = [];

  let imagePath = '';
  if (req.body.image_url != '') {
    imagePath = `/images/${req.body.image_url.split('/')[4]}`;
  }

  // Vérifier si c'est l'admin ou l'utilisateur
  if (user.clearance === 'admin') {
    string = 'DELETE FROM posts WHERE id = ?';
    inserts = [req.params.id];
    console.log('admin');
  } else {
    string = 'DELETE FROM posts WHERE id = ? AND Users_id = ?';
    inserts = [req.params.id, user.id];
    console.log('user');
  }
  const sql = mysql.format(string, inserts);

  // Requête
  const deletePost = db.query(sql, (error, result) => {
    if (!error) {
      // Supprimer l'image dans le serveur
      if (imagePath != '') {
        fs.unlink(imagePath, (err) => {
          console.log(err);
        });
      }

      res.status(200).json({ message: 'Publication supprimé !' });
    } else {
      return next(new HttpError("La publication n'a pas était supprimée", 500));
    }
  });
};

// Supprimer une réponse
//==========================================================================================================
exports.deleteComment = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);

  let string = '';
  let inserts = [];

  // Vérifier si c'est l'admin ou l'utilisateur
  if (user.clearance === 'admin') {
    string = 'DELETE FROM comments WHERE id = ?';
    inserts = [req.params.id];
    console.log('admin');
  } else {
    string = 'DELETE FROM comments WHERE id = ? AND Users_id = ?';
    inserts = [req.params.id, user.id];
    console.log('user');
  }
  const sql = mysql.format(string, inserts);

  // Requête
  const deleteComment = db.query(sql, (error, result) => {
    if (!error) {
      res.status(200).json({ message: 'Réponse supprimé !' });
    } else {
      return next(new HttpError("Le réponse n'a pas était supprimée", 500));
    }
  });
};
