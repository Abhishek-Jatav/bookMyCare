"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  getAuthHeaders: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  getAuthHeaders: () => ({}),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token_bookMyCare");
    const userData = localStorage.getItem("user_bookMyCare");

    if (token && userData) {
      setUser(JSON.parse(userData));
      // Optionally: check token expiry here and logout if expired
    }
    setLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token_bookMyCare", token);
    localStorage.setItem("user_bookMyCare", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token_bookMyCare");
    localStorage.removeItem("user_bookMyCare");
    setUser(null);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token_bookMyCare");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
