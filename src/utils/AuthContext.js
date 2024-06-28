import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    const accessTokenString = localStorage.getItem('access_token');
    return accessTokenString ? JSON.parse(accessTokenString) : null;
  });

  const [role, setRole] = useState(() => {
    const roleString = localStorage.getItem('role');
    return roleString ? JSON.parse(roleString) : null;
  });

  const updateToken = (newToken) => {
    setAccessToken(newToken);
    localStorage.setItem('access_token', JSON.stringify(newToken));
  };

  const updateRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('role', JSON.stringify(newRole));
  };

  const clearToken = () => {
    setAccessToken(null);
    localStorage.removeItem('access_token');
    setRole(null);
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ accessToken, role, updateToken, updateRole, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};