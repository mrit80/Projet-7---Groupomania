import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpRequest = () => {
  // useState pour définir l'état de chargement et les erreurs produits pendant la requête
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeRequest = useRef([]);

  // Fonction fetch avec callBack pour éviter des loops infinits
  const sendRequest = useCallback(
    async (url, method = '', body = null, headers = {}) => {
      setIsLoading(true);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        // Si res ok retourne les données et fini le chargement
        setIsLoading(false);
        return responseData;
      } catch (err) {
        // Si il y a une erreur la met dans le useState
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  // Annule la requête
  useEffect(() => {
    return () => {
      activeRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
