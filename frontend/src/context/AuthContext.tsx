'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = Cookies.get('token');
    const storedUser = Cookies.get('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const response: AuthResponse = await authService.login(data);
    
    // Store token and user in cookies
    Cookies.set('token', response.token, { expires: 1 }); // 1 day
    const userData: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
    };
    Cookies.set('user', JSON.stringify(userData), { expires: 1 });
    setUser(userData);
  };

  const register = async (data: RegisterRequest) => {
    const response: AuthResponse = await authService.register(data);
    
    // Store token and user in cookies
    Cookies.set('token', response.token, { expires: 1 });
    const userData: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
    };
    Cookies.set('user', JSON.stringify(userData), { expires: 1 });
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
