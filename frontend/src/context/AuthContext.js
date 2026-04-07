import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    toast.success('Login successful!');
    return data;
  };

  const register = async (userData) => {
    await authService.register(userData);
    toast.success('Registration successful! Please login.');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAdmin = () => user?.roles?.includes('ADMIN');

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      login,
      register,
      logout,
      isAdmin,
      isAuthenticated: !!user
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

