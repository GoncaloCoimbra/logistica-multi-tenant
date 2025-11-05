import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../api/api';

interface DashboardStats {
  totalProducts: number;
  productsByStatus: Array<{
    status: string;
    count: number;
  }>;
  recentMovements: number;
  summary: {
    received: number;
    inAnalysis: number;
    inStorage: number;
    delivered: number;
    rejected: number;
  };
  percentages: {
    received: string;
    inStorage: string;
    delivered: string;
    rejected: string;
  };
  topSuppliers: Array<{
    id: string;
    name: string;
    productCount: number;
  }>;
}

const STATUS_TRANSLATIONS: { [key: string]: string } = {
  'RECEIVED': 'Recebidos',
  'IN_ANALYSIS': 'Em Análise',
  'REJECTED': 'Rejeitado',
  'APPROVED': 'Aprovado',
  'IN_STORAGE': 'Em Armazenamento',
  'IN_PREPARATION': 'Em Preparação',
  'IN_SHIPPING': 'Em Expedição',
  'DELIVERED': 'Entregues',
  'IN_RETURN': 'Em Devolução',
  'ELIMINATED': 'Eliminado',
  'CANCELLED': 'Cancelado'
};

const STATUS_COLORS: { [key: string]: string } = {
  'RECEIVED': '#3B82F6',
  'IN_ANALYSIS': '#F59E0B',
  'REJECTED': '#EF4444',
  'APPROVED': '#10B981',
  'IN_STORAGE': '#8B5CF6',
  'IN_PREPARATION': '#F97316',
  'IN_SHIPPING': '#6366F1',
  'DELIVERED': '#10B981',
  'IN_RETURN': '#6B7280',
  'ELIMINATED': '#1F2937',
  'CANCELLED': '#DC2626'
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('Últimos 30 dias');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-semibold">Erro ao carregar estatísticas</p>
        </div>
      </div>
    );
  }


  const pieData = stats.productsByStatus.map(item => ({
    name: STATUS_TRANSLATIONS[item.status] || item.status,
    value: item.count,
    color: STATUS_COLORS[item.status] || '#6B7280'
  }));

  const barData = [
    { name: 'Recebidos', value: stats.summary.received, fill: '#3B82F6' },
    { name: 'Em Análise', value: stats.summary.inAnalysis, fill: '#F59E0B' },
    { name: 'Em Armazenamento', value: stats.summary.inStorage, fill: '#8B5CF6' },
    { name: 'Entregues', value: stats.summary.delivered, fill: '#10B981' },
    { name: 'Rejeitados', value: stats.summary.rejected, fill: '#EF4444' }
  ];


  const calculateChange = (value: string) => {
    const num = parseFloat(value);
    return num > 0 ? `+${value}%` : `${value}%`;
  };

  const isPositive = (value: string) => parseFloat(value) >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
     
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Performance Report</h1>
              <p className="text-sm text-gray-500 mt-1">Visão geral do sistema logístico</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{dateRange}</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm">
                + Exportar Relatório
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total de Produtos</p>
            <div className="flex items-center">
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-semibold">
                +3.5%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs mês anterior</span>
            </div>
          </div>

        
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stats.summary.inStorage}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Em Armazenamento</p>
            <div className="flex items-center">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                isPositive(stats.percentages.inStorage) 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-red-600 bg-red-50'
              }`}>
                {calculateChange(stats.percentages.inStorage)}
              </span>
              <span className="text-xs text-gray-500 ml-2">do total</span>
            </div>
          </div>

        
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stats.summary.delivered}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Entregues</p>
            <div className="flex items-center">
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-semibold">
                {stats.percentages.delivered}%
              </span>
              <span className="text-xs text-gray-500 ml-2">do total</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stats.recentMovements}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Movimentações (30d)</p>
            <div className="flex items-center">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-semibold">
                +2%
              </span>
              <span className="text-xs text-gray-500 ml-2">últimos 30 dias</span>
            </div>
          </div>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Distribuição por Estado</h3>
              <div className="flex space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Resumo por Categoria</h3>
              <div className="flex space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

       
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top 5 Fornecedores</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Ver todos →
            </button>
          </div>
          {stats.topSuppliers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 font-medium">Nenhum fornecedor registado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.topSuppliers.map((supplier, index) => {
                const percentage = stats.totalProducts > 0
                  ? ((supplier.productCount / stats.totalProducts) * 100).toFixed(1)
                  : '0';
                return (
                  <div key={supplier.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{supplier.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-gray-900">{supplier.productCount}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 mt-1">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

       
        {stats.summary.rejected > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-red-500 rounded-full p-2">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-900">Atenção Necessária</h3>
                <p className="text-sm text-red-700 mt-1">
                  Existem <strong>{stats.summary.rejected} produto(s) rejeitado(s)</strong> que requerem ação imediata.
                </p>
                <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  Ver Produtos Rejeitados
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;