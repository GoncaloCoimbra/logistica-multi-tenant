import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../api/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR';
  companyId?: string;
  companyName?: string;
  avatarUrl?: string; 
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserData: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isOperator: boolean;
}

const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      console.log('🔄 AuthContext - Loading user...', { 
        hasToken: !!token, 
        hasStoredUser: !!storedUser 
      });

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('📦 AuthContext - Stored user:', {
            email: parsedUser.email,
            role: parsedUser.role,
            roleType: typeof parsedUser.role
          });
          
          setUser(parsedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          //  Revalidar com backend
          console.log('🔍 AuthContext - Revalidating with /auth/me...');
          const response = await api.get('/auth/me');
          const userData = response.data;
          
          console.log(' AuthContext - User from backend:', {
            email: userData.email,
            role: userData.role,
            roleType: typeof userData.role,
            isSuperAdmin: userData.role === 'SUPER_ADMIN'
          });
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
          console.error('❌ AuthContext - Error loading user:', {
            message: error.message,
            response: error.response?.data
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          delete api.defaults.headers.common['Authorization'];
        }
      } else {
        console.log('⚠️ AuthContext - No token or user found');
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext - Login attempt:', email);
      
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      console.log(' AuthContext - Login success:', {
        userId: userData.id,
        email: userData.email,
        role: userData.role,
        roleType: typeof userData.role,
        isSuperAdmin: userData.role === 'SUPER_ADMIN'
      });

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    } catch (error: any) {
      console.error('❌ AuthContext - Login error:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext - Logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      console.log('🔄 AuthContext - Updating user data:', {
        email: updatedUser.email,
        role: updatedUser.role
      });
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isOperator = user?.role === 'OPERATOR';

  //  Log detalhado sempre que user mudar
  useEffect(() => {
    if (user) {
      console.log('👤 AuthContext - Current user state:', { 
        userEmail: user.email,
        userRole: user.role,
        userRoleType: typeof user.role,
        isSuperAdmin, 
        isAdmin, 
        isOperator,
        companyId: user.companyId
      });
    }
  }, [user, isSuperAdmin, isAdmin, isOperator]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUserData,
        isAuthenticated: !!user,
        isSuperAdmin,
        isAdmin,
        isOperator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};