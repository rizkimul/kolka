import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, userApi } from '../services/api';

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
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const result = await authApi.getSession();
      
      if (result?.user) {
        setUser(result.user);
        // Fetch user profile with progress
        try {
          const profile = await userApi.getProfile();
          setProgress(profile.gameProgress);
        } catch (e) {
          // Initialize progress if doesn't exist
          await userApi.initProgress();
          const profile = await userApi.getProfile();
          setProgress(profile.gameProgress);
        }
      }
    } catch (e) {
      // No valid session, user needs to login
      setUser(null);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      // Don't set global loading to avoid unmounting the form component
      
      const result = await authApi.signIn(email, password);
      
      if (result?.user) {
        setUser(result.user);
        // Initialize or fetch progress
        try {
          const profile = await userApi.getProfile();
          setProgress(profile.gameProgress);
        } catch (e) {
          await userApi.initProgress();
          const profile = await userApi.getProfile();
          setProgress(profile.gameProgress);
        }
        return result.user;
      }
      
      throw new Error('Login gagal');
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const register = async (data) => {
    try {
      setError(null);
      // Don't set global loading to avoid unmounting the form component
      
      const { email, password, name, avatar } = data;
      
      const result = await authApi.signUp(email, password, name);
      
      if (result?.user) {
        // Update avatar if provided
        if (avatar) {
          await userApi.updateProfile({ image: avatar });
        }
        
        // Initialize progress
        await userApi.initProgress();
        
        // Fetch complete profile
        const profile = await userApi.getProfile();
        setUser({ ...result.user, image: avatar || result.user.image });
        setProgress(profile.gameProgress);
        
        return result.user;
      }
      
      throw new Error('Registrasi gagal');
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await authApi.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setProgress(null);
    }
  };

  const updateProfile = async (data) => {
    try {
      const updated = await userApi.updateProfile(data);
      setUser(prev => ({ ...prev, ...updated }));
      return updated;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const refreshProgress = async () => {
    try {
      const profile = await userApi.getProfile();
      setProgress(profile.gameProgress);
      return profile.gameProgress;
    } catch (e) {
      console.error('Failed to refresh progress:', e);
    }
  };

  const value = {
    user,
    progress,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshProgress,
    isAuthenticated: !!user,
    // Computed properties for compatibility with old code
    get level() {
      return progress?.currentLevel || 1;
    },
    get score() {
      return progress?.totalScore || 0;
    },
    get stars() {
      return progress?.totalStars || 0;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
