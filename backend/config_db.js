const mysql = require('mysql');
require('dotenv').config();

const connectParams = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWD,
});

const db = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWD,
  database: process.env.SQL_DB,
});

// Supprime la base de donnée si elle existe déjà
const dropDB = `DROP DATABASE IF EXISTS ${process.env.SQL_DB}`;

// Crée la base de données
//====================================================================
const schema = `CREATE DATABASE ${process.env.SQL_DB}`;

// user table
//====================================================================
const userTable =
  "CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `account` varchar(45) COLLATE utf8_bin NOT NULL DEFAULT 'user', `user_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `firstName` varchar(45) COLLATE utf8_bin NOT NULL, `lastName` varchar(45) COLLATE utf8_bin NOT NULL, `email` varchar(100) COLLATE utf8_bin NOT NULL, `password` varchar(60) COLLATE utf8_bin NOT NULL, `photo_url` varchar(255) COLLATE utf8_bin DEFAULT NULL, `role` varchar(65) COLLATE utf8_bin DEFAULT NULL, PRIMARY KEY (`id`), UNIQUE KEY `email_UNIQUE` (`email`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";

// posts table
//====================================================================
const postTable =
  'CREATE TABLE `posts` (`id` int NOT NULL AUTO_INCREMENT, `Users_id` int NOT NULL, `post_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `title` varchar(100) COLLATE utf8_bin NOT NULL, `image_url` text COLLATE utf8_bin NOT NULL, PRIMARY KEY (`id`,`Users_id`), KEY `fk_Posts_Users1_idx` (`Users_id`), CONSTRAINT `fk_Posts_Users1` FOREIGN KEY (`Users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;';

// comments table
//====================================================================

const commentsTable =
  'CREATE TABLE `comments` ( `id` int NOT NULL AUTO_INCREMENT, `Posts_id` int NOT NULL, `Users_id` int NOT NULL, `comment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `message` varchar(255) COLLATE utf8_bin NOT NULL, PRIMARY KEY (`id`,`Posts_id`,`Users_id`), KEY `fk_Comments_Users1_idx` (`Users_id`), KEY `fk_Comments_Posts1_idx` (`Posts_id`), CONSTRAINT `fk_Comments_Posts1` FOREIGN KEY (`Posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE, CONSTRAINT `fk_Comments_Users1` FOREIGN KEY (`Users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;';

// modalité qui permet de controler les queries avec l'aggregation GROUP BY
const globalSelect =
  "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));";

const runQuery = (query) => {
  return new Promise((resolve, reject) => {
    try {
      db.query(query, function (err, result) {
        if (err) throw err;
        resolve(true);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const runInstall = () => {
  const cycle = async () => {
    const createDB = () => {
      return new Promise((resolve, reject) => {
        try {
          connectParams.connect(function (err) {
            if (err) throw err;
            console.log('--- Configurateur de la base de données---');
            console.log('Connecté au serveur MySQL');
            connectParams.query(dropDB, function (err, result) {
              if (err) throw err;
              console.log(`Schema ${process.env.SQL_DB} Supprimé`);
              resolve(true);
            });
            connectParams.query(schema, function (err, result) {
              if (err) throw err;
              console.log(`Schema ${process.env.SQL_DB} Créé`);
              resolve(true);
            });
          });
        } catch (err) {
          reject(err);
        }
      });
    };
    await createDB();
    db.connect(async function (err) {
      if (err) throw err;
      try {
        const users = await runQuery(userTable);
        console.log('Tableau users créé');
        const post = await runQuery(postTable);
        console.log('Tableau posts créé');
        const comments = await runQuery(commentsTable);
        console.log('Tableau comments créé');
        const selectInfo = await runQuery(globalSelect);
        console.log('Votre base de données est prête');
        process.exit();
      } catch (err) {
        console.log('ERROR =>', err);
      }
    });
  };
  cycle();
};

runInstall();
