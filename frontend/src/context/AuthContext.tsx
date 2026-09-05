import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAsDemo: (email: string) => Promise<User>;
  loginWithMicrosoft: (code: string, state?: string) => Promise<User>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permissionCode: string) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('placement_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('placement_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Validate session on app launch
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('placement_token');
      if (savedToken) {
        try {
          const profile = await authService.getCurrentUser();
          setUser(profile);
          localStorage.setItem('placement_user', JSON.stringify(profile));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loginAsDemo = async (email: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.demoLogin(email);
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('placement_token', res.access_token);
      localStorage.setItem('placement_user', JSON.stringify(res.user));
      return res.user;
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Authentication failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMicrosoft = async (code: string, state?: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.loginWithMicrosoftCallback(code, state);
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('placement_token', res.access_token);
      localStorage.setItem('placement_user', JSON.stringify(res.user));
      return res.user;
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Microsoft authentication failed.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('placement_token');
      localStorage.removeItem('placement_user');
      setIsLoading(false);
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(user.role);
  };

  const hasPermission = (permissionCode: string): boolean => {
    if (!user) return false;
    return (user.permissions || []).includes(permissionCode);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        loginAsDemo,
        loginWithMicrosoft,
        logout,
        hasRole,
        hasPermission,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
