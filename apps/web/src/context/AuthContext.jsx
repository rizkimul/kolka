import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session on mount
    const storedUser = localStorage.getItem('kolka_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data', e);
        localStorage.removeItem('kolka_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Mock login logic
    // In a real app, this would validate against a backend
    // For now, allow any login if they strictly match a "mock" db or just simulate success
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username.length < 3) {
          reject(new Error('Username terlalu pendek'));
          return;
        }
        
        // Simulating a successful login
        const userData = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          username,
          avatar: '🦁', // Default or fetched
          level: 1,
          score: 0
        };
        
        setUser(userData);
        localStorage.setItem('kolka_user', JSON.stringify(userData));
        resolve(userData);
      }, 1000);
    });
  };

  const register = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!data.username || !data.avatar) {
          reject(new Error('Data tidak lengkap'));
          return;
        }

        const newUser = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          username: data.username,
          avatar: data.avatar,
          level: 1,
          score: 0,
          stars: 0
        };

        setUser(newUser);
        localStorage.setItem('kolka_user', JSON.stringify(newUser));
        resolve(newUser);
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kolka_user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
