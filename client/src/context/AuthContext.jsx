import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, clearAuthState, redirectToLogin } from '../api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('campus_token');
      const userRaw = localStorage.getItem('campus_user');
      return raw && userRaw ? JSON.parse(userRaw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('campus_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('campus_token', token);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem('campus_token');
    }
  }, [token]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401 ) {
          clearAuthState();
          setUser(null);
          setToken('');
          if (window.location.pathname !== '/login') {
            redirectToLogin();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const payload = res.data;
      setToken(payload.token);
      localStorage.setItem('campus_user', JSON.stringify(payload.user));
      setUser(payload.user);
      return payload;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, payload);
      const data = res.data;
      setToken(data.token);
      localStorage.setItem('campus_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setLoading(false);
    setToken('');
    setUser(null);
    clearAuthState();
  }

  const value = useMemo(() => ({ user, token, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
