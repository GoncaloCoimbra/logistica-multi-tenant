import React, { useState, useEffect } from 'react';

interface Supplier {
  id: string;
  name: string;
  productCount: number;
}

interface DashboardFiltersProps {
  availableSuppliers: Supplier[];
  onFilterChange: (filters: FilterState) => void;
  loading?: boolean;
}

export interface FilterState {
  period: string;
  supplierId: string | null;
  startDate: string | null;
  endDate: string | null;
  useCustomDate: boolean;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  availableSuppliers,
  onFilterChange,
  loading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    period: '30d',
    supplierId: null,
    startDate: null,
    endDate: null,
    useCustomDate: false
  });

  const periods = [
    { value: '7d', label: '7 dias', icon: '📅' },
    { value: '30d', label: '30 dias', icon: '📆' },
    { value: '90d', label: '90 dias', icon: '🗓️' },
    { value: '1y', label: '1 ano', icon: '📊' }
  ];

  // Contador de filtros ativos
  const activeFiltersCount = [
    filters.supplierId,
    filters.useCustomDate && filters.startDate && filters.endDate
  ].filter(Boolean).length;

  const handlePeriodChange = (period: string) => {
    const newFilters = { 
      ...filters, 
      period, 
      useCustomDate: false,
      startDate: null,
      endDate: null
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSupplierChange = (supplierId: string) => {
    const newFilters = { 
      ...filters, 
      supplierId: supplierId === 'all' ? null : supplierId 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCustomDateToggle = () => {
    const useCustomDate = !filters.useCustomDate;
    const newFilters = { ...filters, useCustomDate };
    
    if (!useCustomDate) {
      newFilters.startDate = null;
      newFilters.endDate = null;
    }
    
    setFilters(newFilters);
    if (!useCustomDate) {
      onFilterChange(newFilters);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Aplicar apenas se ambas as datas estiverem preenchidas
    if (newFilters.startDate && newFilters.endDate) {
      onFilterChange(newFilters);
    }
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterState = {
      period: '30d',
      supplierId: null,
      startDate: null,
      endDate: null,
      useCustomDate: false
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    setIsExpanded(false);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header do Filtro */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Filtros Avançados</h3>
            <p className="text-xs text-gray-500">
              {activeFiltersCount > 0 
                ? `${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} ativo${activeFiltersCount > 1 ? 's' : ''}`
                : 'Clique para expandir'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              {activeFiltersCount}
            </span>
          )}
          
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Corpo do Filtro (Expansível) */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200 space-y-6">
          
          {/* Filtro de Período */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📅 Período
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {periods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePeriodChange(p.value)}
                  disabled={filters.useCustomDate || loading}
                  className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    filters.period === p.value && !filters.useCustomDate
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  } ${(filters.useCustomDate || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  <span className="text-lg">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro de Data Customizada */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">
                🗓️ Data Customizada
              </label>
              <button
                onClick={handleCustomDateToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  filters.useCustomDate ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    filters.useCustomDate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {filters.useCustomDate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-gray-300">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    min={filters.startDate || undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filtro de Fornecedor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏢 Fornecedor
            </label>
            <select
              value={filters.supplierId || 'all'}
              onChange={(e) => handleSupplierChange(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium disabled:opacity-50"
            >
              <option value="all">🌐 Todos os Fornecedores</option>
              {availableSuppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.productCount} produto{supplier.productCount !== 1 ? 's' : ''})
                </option>
              ))}
            </select>
          </div>

          {/* Resumo de Filtros Ativos */}
          {activeFiltersCount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Filtros Aplicados:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.supplierId && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-medium text-blue-700 border border-blue-300">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {availableSuppliers.find(s => s.id === filters.supplierId)?.name}
                      </span>
                    )}
                    {filters.useCustomDate && filters.startDate && filters.endDate && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-medium text-blue-700 border border-blue-300">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(filters.startDate).toLocaleDateString('pt-PT')} - {new Date(filters.endDate).toLocaleDateString('pt-PT')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClearFilters}
              disabled={loading || activeFiltersCount === 0}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar Filtros
            </button>
            
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Carregando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Aplicar Filtros
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm font-medium text-gray-700">Aplicando filtros...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFilters;