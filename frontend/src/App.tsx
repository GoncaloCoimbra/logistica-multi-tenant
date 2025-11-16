import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import { Register } from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import NewProduct from './pages/NewProduct';
import SupplierList from './pages/SupplierList';
import VehicleList from './pages/VehicleList';
import TransportList from './pages/TransportList';
import Settings from './pages/Settings';
import AuditLog from './pages/AuditLog'; 
import CompanyManagement from './pages/CompanyManagement';
import GlobalUserManagement from './pages/GlobalUserManagement';
import Profile from './pages/Profile'; 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
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

          {/* ✅ NOVO - Perfil do Utilizador */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Produtos */}
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

          {/* Fornecedores */}
          <Route
            path="/fornecedores"
            element={
              <PrivateRoute>
                <Layout>
                  <SupplierList />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Veículos */}
          <Route
            path="/veiculos"
            element={
              <PrivateRoute>
                <Layout>
                  <VehicleList />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Transportes */}
          <Route
            path="/transportes"
            element={
              <PrivateRoute>
                <Layout>
                  <TransportList />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Configurações */}
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Histórico de Operações (apenas Admin) */}
          <Route
            path="/historico"
            element={
              <PrivateRoute>
                <Layout>
                  <AuditLog />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;