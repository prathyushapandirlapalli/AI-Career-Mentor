import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('is_demo_mode') === 'true' || localStorage.getItem('access_token') === 'demo_token');
  const [loading, setLoading] = useState(true);

  // Authenticated ONLY if real token exists and not in demo token mode
  const isAuthenticated = !!token && token !== 'demo_token' && !isDemoMode;

  useEffect(() => {
    const fetchProfile = async () => {
      const startTime = Date.now();
      if (token && token !== 'demo_token') {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
          setIsDemoMode(false);
        } catch (err) {
          console.error("Auth check failed:", err);
          logout();
        }
      } else if (isDemoMode) {
        setUser(null);
      }

      const elapsedTime = Date.now() - startTime;
      const minDuration = 1000;
      const remainingTime = Math.max(0, minDuration - elapsedTime);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    };

    fetchProfile();
  }, [token, isDemoMode]);

  const login = (accessToken, userData) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.removeItem('is_demo_mode');
    setIsDemoMode(false);
    setLoading(true);
    setToken(accessToken);
    setUser(userData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const enterDemoMode = () => {
    localStorage.setItem('is_demo_mode', 'true');
    localStorage.setItem('access_token', 'demo_token');
    setIsDemoMode(true);
    setLoading(true);
    setToken('demo_token');
    setUser(null);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('is_demo_mode');
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        enterDemoMode,
        isAuthenticated,
        isDemoMode,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
