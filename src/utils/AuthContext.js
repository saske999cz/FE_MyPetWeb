import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    const accessTokenString = localStorage.getItem('access_token');
    return accessTokenString ? JSON.parse(accessTokenString) : null;
  });

  const updateToken = (newToken) => {
    setAccessToken(newToken);
    localStorage.setItem('access_token', JSON.stringify(newToken));
  };

  const clearToken = () => {
    setAccessToken(null);
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ accessToken, updateToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};