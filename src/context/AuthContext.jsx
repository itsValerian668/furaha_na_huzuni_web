import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      const existingUser = JSON.parse(stored);
      // Prototype access is intentionally unrestricted so old sessions also get
      // the admin + member preview after the role model changes.
      const normalizedUser = { ...existingUser, role: 'admin', roles: ['member', 'admin'] };
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Prototype mode: accept any non-empty credentials without a backend.
      await new Promise((resolve) => setTimeout(resolve, 300));
      const name = email.split('@')[0] || 'Member';
      const demoUser = {
        id: 1,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        // Prototype access: admins are members too, so every user can preview both areas.
        role: 'admin',
        roles: ['member', 'admin'],
      };
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { mustChangePassword: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    return user;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
