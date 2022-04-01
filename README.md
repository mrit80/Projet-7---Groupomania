# P7 - Créez un réseau social d’entreprise

# Installez l'application de Groupomania

# Backend

Le backend a été crée avec **Node.js**, **Express.js** et **MySQL** comme base de données.
<br />

### Installation

- Dans le terminal de VSCODE, situez-vous dans le dossier `/backend`.
  <br />
- Démarrer `npm install` pour installer toutes les dependencies du backend.
  <br />
- Créer un fichier `.env` dans le dossier `/backend`, veuillez rentrer le host, les identifiants de votre utilisateur admin et le nom de la base de données que vous souhaitez créer.
  <br />
  Esemple du ficher `.env`

  ```
  PORT=4200


  SQL_HOST=localhost
  SQL_USER=nom-utilisateur-admin
  SQL_PASSWD=mot-de-passe-admin
  SQL_DB=nom-de-la-base-de-données


  JWT_SECRET=votre_code_secret

  JWT_EXPIRES=24h
  ```

- Écrivez dans la ligne de commande `node config_db.js` pour configurer la base de données.

### Development server

Démarrer `nodemon server` pour avoir accès au serveur de développement. L'application va se recharger automatiquement si vous modifiez un fichier source.

# Frontend

Le frontend a été crée avec React.js

### Installation

Dans le dossier `/frontend` démarrez `npm install` pour installer toutes les dépendances du frontend.
<br />

- Créer un fichier `.env` dans le dossier `/frontend`, veuillez entrer l'URL du backend comme suit
  <br />
  ```
  REACT_APP_API_URL=http://localhost:4200
  ```

### Development server

Démarrer `npm start` pour avoir accès au serveur de développement. L'application va se recharger automatiquement si vous modifiez un fichier source.

## Droits Admin

Pour tester les droits d'admin, changez le valeur sur le champ account dans le tableau users, de user pour admin.

## NB

Si un problème d'affichage surgit après avoir lancer plusieurs fois le server frontend, nettoyer le cache du localstorage
