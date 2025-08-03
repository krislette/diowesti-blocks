import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";
import type { User, RegisterData, LoginData } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const initAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const currentUser = await apiService.getUser();
          setUser(currentUser);
        } catch (error) {
          // Token might be expired, clear storage
          console.error("Auth initialization failed:", error);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (apiService.isAuthenticated()) {
      try {
        const currentUser = await apiService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to refresh user:", error);
        setUser(null);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
