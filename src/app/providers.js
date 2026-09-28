'use client';

import { ThemeProvider } from 'next-themes';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  
  // Try load from local storage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const savedUser = localStorage.getItem('user');
    if (savedRole && savedUser) {
      setRole(savedRole);
      setUser(savedUser);
    }
  }, []);

  const login = (roleId, username) => {
    setRole(roleId);
    setUser(username);
    localStorage.setItem('role', roleId);
    localStorage.setItem('user', username);
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
