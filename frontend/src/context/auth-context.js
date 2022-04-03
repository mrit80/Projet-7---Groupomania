import { createContext } from 'react';
// Dans createContext les variables et fonctions globales sont initialisées
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  account: null,
  login: () => {},
  logout: () => {},
});
