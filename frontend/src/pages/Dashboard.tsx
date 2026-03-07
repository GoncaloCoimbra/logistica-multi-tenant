import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../api/api';
import { statusLabels, statusColors, theme } from '../theme.config';

// ─── Font Injection ────────────────────────────────────────────────────────────
const injectFonts = () => {
  if (document.getElementById('ls-fonts')) return;
  const link = document.createElement('link');
  link.id = 'ls-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap';
  document.head.appendChild(link);
};

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const ds = {
  bg:            '#07090f',
  bgCard:        '#0d1117',
  bgInput:       '#0a0e17',
  border:        '#1a2234',
  accent:        '#8b5cf6',
  accentHover:   '#6d28d9',
  textPrimary:   '#f0f4ff',
  textSecondary: '#7a8fa8',
  textMuted:     '#3a4d63',
  success:       '#34d399',
  warning:       '#f59e0b',
  danger:        '#f87171',
  purple:        '#a78bfa',
  orange:        '#fb923c',
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface DashboardStats {
  totalProducts: number;
  productsByStatus: Array<{ status: string; count: number }>;
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
  topSuppliers: Array<{ id: string; name: string; productCount: number }>;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div
    className={`rounded-2xl ${className}`}
    style={{ background: ds.bgCard, border: `1px solid ${ds.border}`, ...style }}
  >
    {children}
  </div>
);

const DarkTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl"
      style={{ background: '#111822', border: `1px solid ${ds.border}`, minWidth: 130 }}>
      {label && <p className="font-semibold mb-2" style={{ color: ds.textPrimary }}>{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="flex items-center justify-between gap-3" style={{ color: ds.textSecondary }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color || entry.fill }} />
            {entry.name}
          </span>
          <span className="font-bold" style={{ color: ds.textPrimary, fontFamily: "'DM Mono', monospace" }}>
            {entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    productsByStatus: [],
    recentMovements: 0,
    summary: { received: 0, inAnalysis: 0, inStorage: 0, delivered: 0, rejected: 0 },
    percentages: { received: '0', inStorage: '0', delivered: '0', rejected: '0' },
    topSuppliers: [],
  });
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState<string | null>(null);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [allSuppliers, setAllSuppliers]         = useState<any[]>([]);
  const [expandedChart, setExpandedChart]       = useState<string | null>(null);

  useEffect(() => {
    injectFonts();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError(null);
      const response = await api.get('/dashboard/stats');
      const data = response.data;
      setStats({
        totalProducts:    data.totalProducts    || 0,
        productsByStatus: Array.isArray(data.productsByStatus) ? data.productsByStatus : [],
        recentMovements:  data.recentMovements  || 0,
        summary:          data.summary          || { received: 0, inAnalysis: 0, inStorage: 0, delivered: 0, rejected: 0 },
        percentages:      data.percentages      || { received: '0', inStorage: '0', delivered: '0', rejected: '0' },
        topSuppliers:     Array.isArray(data.topSuppliers) ? data.topSuppliers : [],
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (stats.totalProducts === 0) { alert('Não há dados para exportar'); return; }
    const csv = [
      ['Relatório de Performance – LogiSphere'],
      ['Data', new Date().toLocaleDateString('pt-PT')],
      [''],
      ['RESUMO GERAL'],
      ['Total de Produtos', stats.totalProducts],
      ['Recebidos',         stats.summary.received],
      ['Em Análise',        stats.summary.inAnalysis],
      ['Em Armazenamento',  stats.summary.inStorage],
      ['Entregues',         stats.summary.delivered],
      ['Rejeitados',        stats.summary.rejected],
      [''],
      ['TOP 5 FORNECEDORES'],
      ['Posição', 'Nome', 'Produtos', '%'],
      ...stats.topSuppliers.map((s, i) => {
        const pct = stats.totalProducts > 0 ? ((s.productCount / stats.totalProducts) * 100).toFixed(1) : '0';
        return [`#${i + 1}`, s.name, s.productCount, `${pct}%`];
      }),
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadAllSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setAllSuppliers(Array.isArray(response.data) ? response.data : []);
      setShowSuppliersModal(true);
    } catch {
      alert('Erro ao carregar fornecedores');
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: ds.bg, fontFamily: "'Outfit', sans-serif" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: `${ds.accent} transparent transparent transparent` }} />
          <p className="text-sm" style={{ color: ds.textMuted }}>A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: ds.bg, fontFamily: "'Outfit', sans-serif" }}>
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: `${ds.danger}15`, border: `1px solid ${ds.danger}30` }}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: ds.danger }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: ds.textPrimary }}>Erro ao carregar dados</h2>
          <p className="text-sm mb-6" style={{ color: ds.textSecondary }}>{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setLoading(true); loadStats(); }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: ds.accent, color: '#fff' }}>
              Tentar novamente
            </button>
            <button onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: ds.bgCard, border: `1px solid ${ds.border}`, color: ds.textSecondary }}>
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Chart data ──
  const pieData = stats.productsByStatus.map(item => ({
    name:  statusLabels.product[item.status] || item.status,
    value: item.count,
    color: statusColors.product[item.status] || '#6B7280',
  }));

  const barData = [
    { name: 'Recebidos',        value: stats.summary.received,   fill: ds.accent   },
    { name: 'Em Análise',       value: stats.summary.inAnalysis, fill: ds.warning  },
    { name: 'Armazenamento',    value: stats.summary.inStorage,  fill: ds.purple   },
    { name: 'Entregues',        value: stats.summary.delivered,  fill: ds.success  },
    { name: 'Rejeitados',       value: stats.summary.rejected,   fill: ds.danger   },
  ];

  // ── Metric cards config ──
  const metricCards = [
    {
      label:   'Total de Produtos',
      value:   stats.totalProducts,
      color:   ds.accent,
      badge:   stats.percentages.received !== '0' ? `${stats.percentages.received}% recebidos` : null,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      ),
    },
    {
      label:   'Em Armazenamento',
      value:   stats.summary.inStorage,
      color:   ds.purple,
      badge:   stats.percentages.inStorage !== '0' ? `${stats.percentages.inStorage}% do total` : null,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
        </svg>
      ),
    },
    {
      label:   'Entregues',
      value:   stats.summary.delivered,
      color:   ds.success,
      badge:   stats.percentages.delivered !== '0' ? `${stats.percentages.delivered}% do total` : null,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
    },
    {
      label:   'Movimentações (30d)',
      value:   stats.recentMovements,
      color:   ds.orange,
      badge:   'últimos 30 dias',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
        </svg>
      ),
    },
  ];

  const ExpandIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
    </svg>
  );

  return (
    <div style={{ fontFamily: "'Outfit', -apple-system, sans-serif", background: ds.bg, minHeight: '100vh' }}>

      {/* ── Page Header ── */}
      <div style={{ background: ds.bgCard, borderBottom: `1px solid ${ds.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: ds.textPrimary }}>
              Performance Report
            </h1>
            <p className="text-sm mt-0.5" style={{ color: ds.textMuted }}>
              Visão geral do sistema logístico
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Period badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ background: ds.bg, border: `1px solid ${ds.border}`, color: ds.textSecondary }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: ds.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Últimos 30 dias
            </div>
            {/* Refresh */}
            <button
              onClick={() => { setLoading(true); loadStats(); }}
              className="p-2 rounded-xl transition-all duration-200"
              style={{ background: ds.bg, border: `1px solid ${ds.border}` }}
              title="Atualizar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: ds.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            {/* Export */}
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: ds.accent, color: '#fff' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Exportar Relatório
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((m, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}>
                  <span style={{ color: m.color }} className="w-5 h-5 block">{m.icon}</span>
                </div>
                {m.badge && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${m.color}15`, color: m.color }}>
                    {m.badge}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold mb-1"
                style={{ color: ds.textPrimary, fontFamily: "'DM Mono', monospace" }}>
                {m.value.toLocaleString('pt-PT')}
              </p>
              <p className="text-xs" style={{ color: ds.textMuted }}>{m.label}</p>
            </Card>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pie chart */}
          <Card className={`p-6 transition-all duration-300 ${expandedChart === 'pie' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-sm" style={{ color: ds.textPrimary }}>
                  Distribuição por Estado
                </h3>
                <p className="text-xs mt-0.5" style={{ color: ds.textMuted }}>
                  Produtos por status actual
                </p>
              </div>
              <button
                onClick={() => setExpandedChart(expandedChart === 'pie' ? null : 'pie')}
                className="p-1.5 rounded-lg transition-all"
                style={{ color: ds.textMuted }}
                onMouseEnter={e => (e.currentTarget.style.color = ds.textPrimary)}
                onMouseLeave={e => (e.currentTarget.style.color = ds.textMuted)}
              >
                <ExpandIcon />
              </button>
            </div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={expandedChart === 'pie' ? 480 : 280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={expandedChart === 'pie' ? 100 : 60}
                    outerRadius={expandedChart === 'pie' ? 180 : 95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={40}
                    formatter={(v, e: any) => (
                      <span style={{ color: ds.textSecondary, fontSize: 11 }}>
                        {v}{' '}
                        <span style={{ color: ds.textPrimary, fontFamily: "'DM Mono', monospace" }}>
                          ({e.payload.value})
                        </span>
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64"
                style={{ color: ds.textMuted }}>
                <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                </svg>
                <p className="text-sm">Sem dados para exibir</p>
                <p className="text-xs mt-1" style={{ color: ds.textMuted }}>
                  Adicione produtos para ver estatísticas
                </p>
              </div>
            )}
          </Card>

          {/* Bar chart */}
          {expandedChart !== 'pie' && (
            <Card className={`p-6 transition-all duration-300 ${expandedChart === 'bar' ? 'lg:col-span-2' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: ds.textPrimary }}>
                    Resumo por Categoria
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: ds.textMuted }}>
                    Contagem por estado do produto
                  </p>
                </div>
                <button
                  onClick={() => setExpandedChart(expandedChart === 'bar' ? null : 'bar')}
                  className="p-1.5 rounded-lg transition-all"
                  style={{ color: ds.textMuted }}
                  onMouseEnter={e => (e.currentTarget.style.color = ds.textPrimary)}
                  onMouseLeave={e => (e.currentTarget.style.color = ds.textMuted)}
                >
                  <ExpandIcon />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={expandedChart === 'bar' ? 480 : 280}>
                <BarChart data={barData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke={ds.border} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: ds.textMuted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: ds.textMuted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: `${ds.accent}08` }} />
                  <Bar dataKey="value" name="Produtos" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* ── Top 5 Fornecedores ── */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: ds.textPrimary }}>
                Top 5 Fornecedores
              </h3>
              <p className="text-xs mt-0.5" style={{ color: ds.textMuted }}>
                Por volume de produtos fornecidos
              </p>
            </div>
            <button
              onClick={loadAllSuppliers}
              className="text-xs font-semibold transition-colors"
              style={{ color: ds.accent }}
            >
              Ver todos →
            </button>
          </div>

          {stats.topSuppliers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: ds.textMuted }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <p className="text-sm mb-3" style={{ color: ds.textMuted }}>
                Nenhum fornecedor registado
              </p>
              <button onClick={() => navigate('/fornecedores')}
                className="text-xs font-semibold" style={{ color: ds.accent }}>
                Adicionar fornecedor →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.topSuppliers.map((supplier, i) => {
                const pct = stats.totalProducts > 0
                  ? (supplier.productCount / stats.totalProducts) * 100
                  : 0;
                const rankColors = [ds.warning, ds.textSecondary, '#cd7f32', ds.textMuted, ds.textMuted];
                return (
                  <div
                    key={supplier.id}
                    className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = ds.bg;
                      (e.currentTarget as HTMLElement).style.borderColor = ds.border;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                    }}
                  >
                    <span
                      className="text-sm font-bold w-5 text-right flex-shrink-0"
                      style={{ color: rankColors[i], fontFamily: "'DM Mono', monospace" }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold truncate" style={{ color: ds.textPrimary }}>
                          {supplier.name}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: `${ds.accent}15`, color: ds.accent, fontFamily: "'DM Mono', monospace" }}>
                            {pct.toFixed(1)}%
                          </span>
                          <span className="text-sm font-bold"
                            style={{ color: ds.textPrimary, fontFamily: "'DM Mono', monospace" }}>
                            {supplier.productCount}
                          </span>
                        </div>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: ds.border }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${ds.accent}80, ${ds.accent})`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* ── Rejected Alert ── */}
        {stats.summary.rejected > 0 && (
          <div
            className="rounded-2xl p-5 flex items-start gap-4"
            style={{ background: `${ds.danger}0a`, border: `1px solid ${ds.danger}30` }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${ds.danger}18` }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                style={{ color: ds.danger }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1" style={{ color: ds.danger }}>
                Atenção necessária
              </p>
              <p className="text-sm" style={{ color: ds.textSecondary }}>
                Existem <strong style={{ color: ds.danger }}>{stats.summary.rejected} produto(s) rejeitado(s)</strong> que requerem acção imediata.
              </p>
            </div>
            <button
              onClick={() => navigate('/produtos?status=REJECTED')}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: `${ds.danger}20`, color: ds.danger, border: `1px solid ${ds.danger}40` }}
            >
              Ver produtos →
            </button>
          </div>
        )}

        {/* ── Summary ── */}
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: ds.textMuted }}>
            Resumo do Período
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Recebidos',     value: stats.summary.received,   pct: stats.percentages.received,  color: ds.accent  },
              { label: 'Em Análise',    value: stats.summary.inAnalysis,                                   color: ds.warning },
              { label: 'Armazenados',   value: stats.summary.inStorage,  pct: stats.percentages.inStorage, color: ds.purple  },
              { label: 'Entregues',     value: stats.summary.delivered,  pct: stats.percentages.delivered, color: ds.success },
              { label: 'Rejeitados',    value: stats.summary.rejected,   pct: stats.percentages.rejected,  color: ds.danger  },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold mb-1"
                  style={{ color: s.color, fontFamily: "'DM Mono', monospace" }}>
                  {s.value}
                </p>
                <p className="text-xs mb-1" style={{ color: ds.textMuted }}>{s.label}</p>
                {s.pct && s.pct !== '0' && (
                  <p className="text-xs font-semibold" style={{ color: s.color }}>{s.pct}%</p>
                )}
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* ── Suppliers Modal ── */}
      {showSuppliersModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowSuppliersModal(false); }}
        >
          <div
            className="w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col"
            style={{ background: ds.bgCard, border: `1px solid ${ds.border}`, maxHeight: '80vh' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${ds.border}` }}>
              <h2 className="font-bold text-lg" style={{ color: ds.textPrimary }}>
                Todos os Fornecedores
              </h2>
              <button
                onClick={() => setShowSuppliersModal(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: ds.textMuted }}
                onMouseEnter={e => (e.currentTarget.style.color = ds.textPrimary)}
                onMouseLeave={e => (e.currentTarget.style.color = ds.textMuted)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto p-6 flex-1">
              {allSuppliers.length === 0 ? (
                <p className="text-center py-12 text-sm" style={{ color: ds.textMuted }}>
                  Nenhum fornecedor encontrado
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allSuppliers.map(s => (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl transition-all duration-200"
                      style={{ background: ds.bg, border: `1px solid ${ds.border}` }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = `${ds.accent}50`)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = ds.border)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm" style={{ color: ds.textPrimary }}>{s.name}</p>
                          <p className="text-xs mt-1" style={{ color: ds.textMuted }}>NIF: {s.nif}</p>
                          {s.email && <p className="text-xs" style={{ color: ds.textMuted }}>{s.email}</p>}
                          {s.phone && <p className="text-xs" style={{ color: ds.textMuted }}>{s.phone}</p>}
                        </div>
                        <button
                          onClick={() => { navigate('/fornecedores'); setShowSuppliersModal(false); }}
                          className="text-xs font-semibold flex-shrink-0 ml-3"
                          style={{ color: ds.accent }}
                        >
                          Ver →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4" style={{ borderTop: `1px solid ${ds.border}` }}>
              <button
                onClick={() => { navigate('/fornecedores'); setShowSuppliersModal(false); }}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: ds.accent, color: '#fff' }}
              >
                Ir para Gestão de Fornecedores
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;