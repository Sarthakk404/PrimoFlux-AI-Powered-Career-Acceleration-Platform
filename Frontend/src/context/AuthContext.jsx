import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (token && cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        authAPI.getMe()
          .then((res) => {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          })
          .catch(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          })
          .finally(() => setLoading(false));
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const res = await authAPI.login(formData);
    localStorage.setItem('token', res.data.access_token);
    const userRes = await authAPI.getMe();
    localStorage.setItem('user', JSON.stringify(userRes.data));
    setUser(userRes.data);
    return res.data;
  };

  const register = async (email, username, password) => {
    const res = await authAPI.register({ email, username, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};