import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import { Register } from './pages/Register'; // ✅ COM CHAVES
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import NewProduct from './pages/NewProduct';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/produtos"
            element={
              <PrivateRoute>
                <Layout>
                  <ProductList />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/produtos/novo"
            element={
              <PrivateRoute>
                <Layout>
                  <NewProduct />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/produtos/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ProductDetails />
                </Layout>
              </PrivateRoute>
            }
          />

        
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;