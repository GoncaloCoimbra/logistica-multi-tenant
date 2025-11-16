import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import api from '../api/api';
import DashboardFilters, { FilterState } from '../components/DashboardFilters';

interface DashboardStats {
  period: string;
  customDateRange: { startDate: Date; endDate: Date } | null;
  appliedFilters: {
    supplierId: string | null;
    hasDateRange: boolean;
  };
  availableSuppliers: Array<{
    id: string;
    name: string;
    productCount: number;
  }>;
  totalProducts: number;
  productsByStatus: Array<{ status: string; count: number }>;
  recentMovements: number;
  movementsByDay: Array<{ date: string; count: number }>;
  productsCreatedByDay: Array<{ date: string; count: number }>;
  deliveredByDay: Array<{ date: string; count: number }>;
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
  transportStats: {
    total: number;
    active: number;
    completed: number;
  };
  vehicleStats: {
    total: number;
  };
  rejectionRateBySupplier: Array<{
    supplierId: string;
    supplierName: string;
    totalProducts: number;
    rejectedProducts: number;
    rejectionRate: number;
  }>;
  avgTimeInStatus: Array<{
    status: string;
    avgHours: number;
  }>;
  trends: {
    products: string;
    deliveries: string;
  };
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

const DashboardAdvanced: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  
  // Estado dos filtros
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    period: '30d',
    supplierId: null,
    startDate: null,
    endDate: null,
    useCustomDate: false
  });

  useEffect(() => {
    loadStats(currentFilters);
  }, []);

  const loadStats = async (filters: FilterState) => {
    try {
      setLoading(true);
      
      // Construir query params
      const params = new URLSearchParams();
      
      if (filters.useCustomDate && filters.startDate && filters.endDate) {
        params.append('startDate', filters.startDate);
        params.append('endDate', filters.endDate);
      } else {
        params.append('period', filters.period);
      }
      
      if (filters.supplierId) {
        params.append('supplierId', filters.supplierId);
      }
      
      const response = await api.get(`/dashboard/stats?${params.toString()}`);
      setStats(response.data);
      setCurrentFilters(filters);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    loadStats(filters);
  };

  const handleExportReport = () => {
    if (!stats) return;

    // Criar CSV com informações dos filtros aplicados
    const filterInfo = [];
    
    if (stats.appliedFilters.supplierId) {
      const supplier = stats.availableSuppliers.find(s => s.id === stats.appliedFilters.supplierId);
      filterInfo.push(['Fornecedor Filtrado', supplier?.name || 'N/A']);
    }
    
    if (stats.customDateRange) {
      filterInfo.push([
        'Período Customizado',
        `${new Date(stats.customDateRange.startDate).toLocaleDateString('pt-PT')} - ${new Date(stats.customDateRange.endDate).toLocaleDateString('pt-PT')}`
      ]);
    } else {
      filterInfo.push(['Período', stats.period]);
    }

    const csvContent = [
      ['Relatório de Performance Avançado - Sistema Logística'],
      ['Data de Exportação', new Date().toLocaleDateString('pt-BR')],
      [''],
      ['FILTROS APLICADOS'],
      ...filterInfo,
      [''],
      ['RESUMO GERAL'],
      ['Total de Produtos', stats.totalProducts],
      ['Recebidos', stats.summary.received],
      ['Em Análise', stats.summary.inAnalysis],
      ['Em Armazenamento', stats.summary.inStorage],
      ['Entregues', stats.summary.delivered],
      ['Rejeitados', stats.summary.rejected],
      [''],
      ['TENDÊNCIAS'],
      ['Produtos vs Período Anterior', `${stats.trends.products}%`],
      ['Entregas vs Período Anterior', `${stats.trends.deliveries}%`],
      [''],
      ['TOP FORNECEDORES'],
      ['Posição', 'Nome', 'Produtos', 'Percentagem'],
      ...stats.topSuppliers.map((s, i) => {
        const percentage = stats.totalProducts > 0
          ? ((s.productCount / stats.totalProducts) * 100).toFixed(1)
          : '0';
        return [`#${i + 1}`, s.name, s.productCount, `${percentage}%`];
      }),
      [''],
      ['TAXA DE REJEIÇÃO POR FORNECEDOR'],
      ['Fornecedor', 'Total Produtos', 'Rejeitados', 'Taxa (%)'],
      ...stats.rejectionRateBySupplier.map(r => [
        r.supplierName,
        r.totalProducts,
        r.rejectedProducts,
        r.rejectionRate
      ])
    ].map(row => row.join(',')).join('\n');

    // Download CSV
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_avancado_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !stats) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  };

  const timelineData = stats.movementsByDay.map(m => ({
    date: formatDate(m.date),
    movimentos: m.count,
    entradas: stats.productsCreatedByDay.find(p => p.date === m.date)?.count || 0,
    saídas: stats.deliveredByDay.find(d => d.date === m.date)?.count || 0
  }));

  const getTrendIcon = (value: string) => {
    const num = parseFloat(value);
    if (num > 0) {
      return (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else if (num < 0) {
      return (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  const getTrendColor = (value: string) => {
    const num = parseFloat(value);
    return num >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Determinar label do período atual
  const getPeriodLabel = () => {
    if (stats.customDateRange) {
      return `${new Date(stats.customDateRange.startDate).toLocaleDateString('pt-PT')} - ${new Date(stats.customDateRange.endDate).toLocaleDateString('pt-PT')}`;
    }
    
    const periodLabels: { [key: string]: string } = {
      '7d': 'Últimos 7 dias',
      '30d': 'Últimos 30 dias',
      '90d': 'Últimos 90 dias',
      '1y': 'Último ano'
    };
    
    return periodLabels[stats.period] || stats.period;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Avançado
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Análise detalhada e insights do sistema • {getPeriodLabel()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Botão Exportar */}
              <button 
                onClick={handleExportReport}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar
              </button>

              {/* Botão Atualizar */}
              <button 
                onClick={() => loadStats(currentFilters)}
                disabled={loading}
                className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group disabled:opacity-50"
                title="Atualizar"
              >
                <svg className={`w-5 h-5 text-blue-600 transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== FILTROS INTERATIVOS ===== */}
        <div className="mb-8">
          <DashboardFilters
            availableSuppliers={stats.availableSuppliers}
            onFilterChange={handleFilterChange}
            loading={loading}
          />
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Total de Produtos</p>
            <div className="flex items-center gap-1">
              {getTrendIcon(stats.trends.products)}
              <span className={`text-sm font-bold ${getTrendColor(stats.trends.products)}`}>
                {Math.abs(parseFloat(stats.trends.products))}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.summary.inStorage}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Em Armazenamento</p>
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percentages.inStorage}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-purple-600">
                {stats.percentages.inStorage}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.summary.delivered}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Entregues</p>
            <div className="flex items-center gap-1">
              {getTrendIcon(stats.trends.deliveries)}
              <span className={`text-sm font-bold ${getTrendColor(stats.trends.deliveries)}`}>
                {Math.abs(parseFloat(stats.trends.deliveries))}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.recentMovements}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Movimentações</p>
            <div className="flex items-center">
              <span className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded-full font-semibold">
                Período selecionado
              </span>
            </div>
          </div>
        </div>

        {/* Painel de Ações Rápidas */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">⚡ Ações Rápidas</h3>
              <p className="text-blue-100 text-sm mt-1">Acesso rápido às funcionalidades principais</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/produtos/novo')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Novo Produto</p>
                  <p className="text-xs text-blue-100">Adicionar produto</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/fornecedores')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Fornecedores</p>
                  <p className="text-xs text-blue-100">Gerir fornecedores</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/veiculos')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Veículos</p>
                  <p className="text-xs text-blue-100">Gerir frota</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/transportes')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Transportes</p>
                  <p className="text-xs text-blue-100">Gerir expedições</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Gráfico de Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">📈 Atividade ao Longo do Tempo</h3>
              <p className="text-sm text-gray-500 mt-1">Evolução de movimentos, entradas e saídas</p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 font-medium">Movimentos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 font-medium">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600 font-medium">Saídas</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorMovimentos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="movimentos" stroke="#3B82F6" fillOpacity={1} fill="url(#colorMovimentos)" strokeWidth={2} />
              <Area type="monotone" dataKey="entradas" stroke="#10B981" fillOpacity={1} fill="url(#colorEntradas)" strokeWidth={2} />
              <Area type="monotone" dataKey="saídas" stroke="#F97316" fillOpacity={1} fill="url(#colorSaidas)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico Pizza */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">📊 Distribuição por Estado</h3>
              <p className="text-sm text-gray-500 mt-1">Percentagem de produtos por status</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={50}
                  formatter={(value, entry: any) => (
                    <span className="text-sm font-medium text-gray-700">
                      {value} ({entry.payload.value})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tempo Médio por Estado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">⏱️ Tempo Médio por Estado</h3>
              <p className="text-sm text-gray-500 mt-1">Duração média em cada fase (horas)</p>
            </div>
            {stats.avgTimeInStatus.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>Sem dados disponíveis</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {stats.avgTimeInStatus.map((item) => (
                  <div key={item.status} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                        {STATUS_TRANSLATIONS[item.status] || item.status}
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {item.avgHours.toFixed(1)}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out group-hover:from-blue-600 group-hover:to-purple-600"
                        style={{ 
                          width: `${Math.min((item.avgHours / Math.max(...stats.avgTimeInStatus.map(a => a.avgHours))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Taxa de Rejeição por Fornecedor */}
        {stats.rejectionRateBySupplier.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">⚠️ Taxa de Rejeição por Fornecedor</h3>
              <p className="text-sm text-gray-500 mt-1">Fornecedores com maior taxa de produtos rejeitados</p>
            </div>
            <div className="space-y-4">
              {stats.rejectionRateBySupplier.map((supplier, index) => (
                <div key={supplier.supplierId} className="group flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 
                      index === 1 ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 
                      'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {supplier.supplierName}
                        </p>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                          supplier.rejectionRate > 10 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                            : supplier.rejectionRate > 5
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                            : 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                        }`}>
                          {supplier.rejectionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="font-medium">{supplier.totalProducts}</span> produtos
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="font-medium">{supplier.rejectedProducts}</span> rejeitados
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-700 ${
                            supplier.rejectionRate > 10 
                              ? 'bg-gradient-to-r from-red-500 to-red-600' 
                              : supplier.rejectionRate > 5
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                              : 'bg-gradient-to-r from-green-400 to-green-500'
                          }`}
                          style={{ width: `${Math.min(supplier.rejectionRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estatísticas de Transportes e Veículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Transportes</h3>
                <p className="text-blue-100 text-sm">Gestão de expedições</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/30 transition-colors">
                <p className="text-3xl font-bold">{stats.transportStats.total}</p>
                <p className="text-xs text-blue-100 mt-1">Total</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/30 transition-colors">
                <p className="text-3xl font-bold">{stats.transportStats.active}</p>
                <p className="text-xs text-blue-100 mt-1">Ativos</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/30 transition-colors">
                <p className="text-3xl font-bold">{stats.transportStats.completed}</p>
                <p className="text-xs text-blue-100 mt-1">Concluídos</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Veículos</h3>
                <p className="text-purple-100 text-sm">Frota disponível</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/30 transition-colors">
              <p className="text-5xl font-bold mb-2">{stats.vehicleStats.total}</p>
              <p className="text-sm text-purple-100">Veículos registados</p>
            </div>
          </div>
        </div>

        {/* Top 5 Fornecedores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">🏆 Top 5 Fornecedores</h3>
              <p className="text-sm text-gray-500 mt-1">Fornecedores com mais produtos fornecidos</p>
            </div>
            <button 
              onClick={() => navigate('/fornecedores')}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
            >
              Ver todos →
            </button>
          </div>
          <div className="space-y-3">
            {stats.topSuppliers.map((supplier, index) => (
              <div 
                key={supplier.id}
                className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent rounded-lg transition-all duration-300 group border border-transparent hover:border-blue-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-md ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                    'bg-gradient-to-br from-blue-400 to-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {supplier.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {supplier.productCount} produto{supplier.productCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {supplier.productCount}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo Final */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">{stats.summary.received}</div>
              <div className="text-sm text-gray-400 mt-2">Recebidos</div>
              <div className="text-xs text-blue-300 mt-1">{stats.percentages.received}%</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400">{stats.summary.inAnalysis}</div>
              <div className="text-sm text-gray-400 mt-2">Em Análise</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400">{stats.summary.inStorage}</div>
              <div className="text-sm text-gray-400 mt-2">Armazenados</div>
              <div className="text-xs text-purple-300 mt-1">{stats.percentages.inStorage}%</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">{stats.summary.delivered}</div>
              <div className="text-sm text-gray-400 mt-2">Entregues</div>
              <div className="text-xs text-green-300 mt-1">{stats.percentages.delivered}%</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400">{stats.summary.rejected}</div>
              <div className="text-sm text-gray-400 mt-2">Rejeitados</div>
              <div className="text-xs text-red-300 mt-1">{stats.percentages.rejected}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdvanced;