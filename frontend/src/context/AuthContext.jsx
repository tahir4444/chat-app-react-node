import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getToken,
  saveToken as saveTokenUtil,
  logout as logoutUtil,
} from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUsername(decoded.username);
      } catch (err) {
        setUsername('');
        setToken(null);
      }
    }
  }, [token]);

  const login = (token) => {
    saveTokenUtil(token);
    setToken(token);
    navigate('/');
  };

  const logout = () => {
    logoutUtil();
    setToken(null);
    setUsername('');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ token, username, login, logout, isLoggedIn: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
