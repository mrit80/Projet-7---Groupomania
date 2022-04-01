# Projet 7 - Groupomania

#### Installation de l'application Groupomania

### Backend

**Node.js**, **Express.js** et **MySQL**
<br />

## Configuation du Backend

- Écrire dans le terminal `cd /backend`.
  <br />
- Tapez `npm install` pour installer toutes les dépendances du backend.
  <br />
- Créer un fichier `.env` dans le dossier `/backend`, entrer le host, les identifiants de votre utilisateur admin et le nom de la base de données que vous souhaitez créer.
  <br />
  Exemple type du ficher `.env` :

  PORT=4200

  SQL_HOST=localhost
  SQL_USER=nom-utilisateur-admin
  SQL_PASSWD=mot-de-passe-admin
  SQL_DB=nom-de-la-base-de-données

  JWT_SECRET=votre_code_secret

  JWT_EXPIRES=24h

## Configuration de la Base de données MySQL

- Écrire dans le terminal `node config_db.js` pour lancer le fichier et configurer la base de données.

## Lancer le serveur nodemon

- Écrire dans le terminal `nodemon server` pour lancer le serveur.

### Frontend

**React.js**

## Configuation du Frontend

- Écrire dans le terminal `cd /frontend`.
  <br />
- Tapez `npm install` pour installer toutes les dépendances du frontend.
  <br />
- Créer un fichier `.env` dans le dossier `/frontend`, entrer l'URL du backend comme ceci : REACT_APP_API_URL=http://localhost:4200

## Lancer le serveur npm start

- Écrire dans le terminal `npm start` pour lancer le serveur

### Droits Admin

Pour tester les droits d'admin, changez la valeur en 'admin' dans le champ account qui se trouve dans la table users de votre base de données.

### NB

Si un problème d'affichage surgit après avoir lancer plusieurs fois le server frontend, nettoyer le cache du localstorage
