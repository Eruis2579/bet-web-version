import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '../services/authService';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  connected: boolean;
  balance: number;
  totalBets: number;
  totalProfit:number;
  totalStake:number;
  winRate:number;
  isAdmin:number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: {
    page: boolean;
    auth: boolean;
  };
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({
    page: true,
    auth: false,
  });

  const isAuthenticated = !!user && !!token;

  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        // Verify token and get user profile
        const userProfile = await authService.getProfile();
        setUser(userProfile.user);
      }
    } catch (error) {
      window.SM.error(error as string);
      // Clear invalid token
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(prev=>({
        ...prev,
        page: false
      }));
    }
  };
  // Initialize auth state from localStorage
  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<void> => {
    try {
      setIsLoading(prev=>({
        ...prev,
        auth: true
      }));
      const response: AuthResponse = await authService.login(credentials);

      setToken(response.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      window.SM.error(error as string);
      throw error;
    } finally {
      setIsLoading(prev=>({
        ...prev,
        auth: false
      }));
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<void> => {
    try {
      setIsLoading(prev=>({
        ...prev,
        auth: true
      }));
      const response: AuthResponse = await authService.register(userData);

      setToken(response.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      window.SM.error(error as string);
      throw error;
    } finally {
      setIsLoading(prev=>({
        ...prev,
        auth: false
      }));
    }
  };

  const logout = async (): Promise<void> => {
    setToken(null);
    setUser(null);
    axios.defaults.headers.common['Authorization'] = '';
    localStorage.removeItem('authToken');
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        // Verify token and get user profile
        const userProfile = await authService.getProfile();
        setUser(userProfile.user);
      }
    } catch (error) {
      window.SM.error(error as string);
      // Clear invalid token
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(prev=>({
        ...prev,
        page: false
      }));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};