import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  // Initialisation de l'état des variables token, user ID, account, tokenExpiration
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [account, setAccount] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  // useCallback recherche et stocke les variables globales dont il a besoins
  const login = useCallback((userId, token, account, expirationDate) => {
    setUserId(userId);
    setToken(token);
    setAccount(account);

    // Crée une date de 24h (temps de la validité de la session) une fois qu'il a un token
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    setTokenExpirationDate(tokenExpirationDate);

    // Stocker les paramètres dans le localStorage
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: userId,
        token: token,
        account: account,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  // Se déconnecter remet tout à zéro et supprime l'objet du localStorage
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setAccount(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

  // Gére le temps de la session et déconnecte l'utilisateur à la fin
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // Auto-login à l'application en utilisant le localStorage pour s'identifier
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (
      storedData &&
      storedData.userId &&
      storedData.token &&
      storedData.account &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.account,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { userId, token, account, login, logout };
};
