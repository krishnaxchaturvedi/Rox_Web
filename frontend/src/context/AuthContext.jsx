import { createContext, useEffect, useState } from 'react';
import { login as loginApi, getMe } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rox_token');
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((response) => {
        const currentUser = response.data.data.user;
        localStorage.setItem('rox_user', JSON.stringify(currentUser));
        setUser(currentUser);
      })
      .catch(() => {
        localStorage.removeItem('rox_token');
        localStorage.removeItem('rox_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await loginApi(credentials);
      const { user: loggedInUser, token } = response.data.data;
      localStorage.setItem('rox_token', token);
      localStorage.setItem('rox_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return { user: loggedInUser, token };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rox_token');
    localStorage.removeItem('rox_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
