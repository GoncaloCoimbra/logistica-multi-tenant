import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { queryClient } from './lib/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/leaflet.css';

// Layout
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import DashboardAdvanced from './pages/DashboardAdvanced';

// Product Pages
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import NewProduct from './pages/NewProduct';

// Management Pages
import CompanyManagement from './pages/CompanyManagement';
import GlobalUserManagement from './pages/GlobalUserManagement';
import SupplierList from './pages/SupplierList';

// Vehicle & Transport Pages
import VehicleList from './pages/VehicleList';
import TransportList from './pages/TransportList';

// SuperAdmin (SEM MainLayout)
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminHome from './pages/SuperAdminHome';
import SuperAdminProfile from './pages/SuperAdminProfile';

// New role‑specific homepage components
import AdminHome from './pages/AdminHome';
import OperatorHome from './pages/OperatorHome';
import RoleRedirect from './components/RoleRedirect';

// Profile & Settings
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Tasks
import Tasks from './pages/Tasks';

// Referrals
import Referrals from './pages/Referrals';

// AUDIT LOG - Histórico de Auditoria
import AuditLog from './pages/AuditLog';

// Live Tracking & Route Optimization
import LiveTrackingRouteOptimization from './pages/LiveTrackingAndRouteOptimization';

// Informational pages
import ApiDocumentation from './pages/ApiDocumentation';
import HelpCenter from './pages/HelpCenter';
import Tutorials from './pages/Tutorials';
import TutorialDetail from './pages/TutorialDetail';
import Updates from './pages/Updates';
import SystemStatus from './pages/SystemStatus';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
          <BrowserRouter>
          <Routes>

            {/* ===================
                PUBLIC ROUTES
            =================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ===================
                SUPER ADMIN ROUTES (SEM MainLayout)
                Página inicial: /superadmin-home
            =================== */}
            <Route 
              path="/superadmin-home" 
              element={
                <PrivateRoute requireSuperAdmin>
                  <SuperAdminHome />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/superadmin/profile" 
              element={
                <PrivateRoute requireSuperAdmin>
                  <SuperAdminProfile />
                </PrivateRoute>
              } 
            />

            {/* ===================
                PRIVATE ROUTES (COM MainLayout)
            =================== */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >

              {/* Redirect root para a página adequada de acordo com o papel do usuário */}
              <Route index element={<RoleRedirect />} />
              
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/advanced" element={<DashboardAdvanced />} />

              {/* Produtos */}
              <Route path="produtos" element={<ProductList />} />
              <Route path="produtos/novo" element={<NewProduct />} />
              <Route path="produtos/:id" element={<ProductDetails />} />

              {/* Fornecedores */}
              <Route path="fornecedores" element={<SupplierList />} />

              {/* Empresas (SuperAdmin dentro do MainLayout) */}
              <Route 
                path="empresas" 
                element={
                  <PrivateRoute requireSuperAdmin>
                    <CompanyManagement />
                  </PrivateRoute>
                } 
              />

              {/* Veículos */}
              <Route path="veiculos" element={<VehicleList />} />

              {/* Transportes */}
              <Route path="transportes" element={<TransportList />} />

              {/* Páginas de documentação/ajuda */}
              <Route path="api-docs" element={<ApiDocumentation />} />
              <Route path="help" element={<HelpCenter />} />
              <Route path="tutorials" element={<Tutorials />} />
              <Route path="tutorials/:id" element={<TutorialDetail />} />
              <Route path="updates" element={<Updates />} />
              <Route path="status" element={<SystemStatus />} />

              {/* Rastreamento GPS e Otimização de Rotas */}
              <Route path="rastreamento" element={<LiveTrackingRouteOptimization />} />

              {/* Tarefas - apenas Operador e Admin */}
              <Route
                path="tarefas"
                element={
                  <PrivateRoute requireOperator>
                    <Tasks />
                  </PrivateRoute>
                }
              />

              {/* Referrals - Referências/Indicações */}
              <Route
                path="referrals"
                element={
                  <PrivateRoute requireOperator>
                    <Referrals />
                  </PrivateRoute>
                }
              />

              {/* Histórico - Acessível para todos os usuários autenticados */}
              <Route path="historico" element={<AuditLog />} />

              {/* Perfil */}
              <Route path="profile" element={<Profile />} />

              {/* Configurações */}
              <Route path="configuracoes" element={<Settings />} />

              {/* SuperAdmin Dashboard (dentro do MainLayout) */}
              <Route 
                path="superadmin" 
                element={
                  <PrivateRoute requireSuperAdmin>
                    <SuperAdminDashboard />
                  </PrivateRoute>
                } 
              />

              {/* rotas de home específicas por papel (podem ser ampliadas no futuro) */}
              <Route
                path="admin-home"
                element={
                  <PrivateRoute requireAdmin>
                    <AdminHome />
                  </PrivateRoute>
                }
              />
              <Route
                path="operator-home"
                element={
                  <PrivateRoute requireOperator>
                    <OperatorHome />
                  </PrivateRoute>
                }
              />

              {/* Users (Admin) */}
              <Route 
                path="users" 
                element={
                  <PrivateRoute requireAdmin>
                    <GlobalUserManagement />
                  </PrivateRoute>
                } 
              />

              {/* Redirect rotas antigas (inglês) para português */}
              <Route path="products" element={<Navigate to="/produtos" replace />} />
              <Route path="products/new" element={<Navigate to="/produtos/novo" replace />} />
              <Route path="products/:id" element={<Navigate to="/produtos/:id" replace />} />
              <Route path="suppliers" element={<Navigate to="/fornecedores" replace />} />
              <Route path="companies" element={<Navigate to="/empresas" replace />} />
              <Route path="vehicles" element={<Navigate to="/veiculos" replace />} />
              <Route path="transports" element={<Navigate to="/transportes" replace />} />
              <Route path="tasks" element={<Navigate to="/tarefas" replace />} />
            </Route>

            {/* ===================
                404 - Redirect para dashboard
            =================== */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Routes>
        </BrowserRouter>

        <ReactQueryDevtools initialIsOpen={false} />
        </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;