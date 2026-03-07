import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { getStatusBadgeClass, statusLabels } from '../theme.config';
import { useFilters } from '../hooks/useFilters';
import FilterChips from '../components/FilterChips';
import FilterSelector from '../components/FilterSelector';

interface Product {
  id: string;
  internalCode: string;
  description: string;
  quantity: number;
  unit: string;
  status: string;
  supplier?: {
    name: string;
  };
  currentLocation?: string;
  createdAt: string;
}

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { activeFilters, addFilter, removeFilter, clearAllFilters, getFilter } = useFilters();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(getFilter('search'));
  const [statusFilter, setStatusFilter] = useState(getFilter('status'));
  const [filterLocation, setFilterLocation] = useState(getFilter('location'));
  const [filterDateFrom, setFilterDateFrom] = useState(getFilter('dateFrom'));
  const [filterDateTo, setFilterDateTo] = useState(getFilter('dateTo'));

  useEffect(() => {
    loadProducts();
  }, [activeFilters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      
      activeFilters.forEach(filter => {
        params.append(filter.key, filter.value);
      });
      
      const queryString = params.toString();
      const url = `/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produtos/${productId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      addFilter('search', value);
    } else {
      removeFilter('search');
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    if (value) {
      addFilter('status', value);
    } else {
      removeFilter('status');
    }
  };

  const handleLocationChange = (value: string) => {
    setFilterLocation(value);
    if (value) {
      addFilter('location', value);
    } else {
      removeFilter('location');
    }
  };

  const handleDateFromChange = (value: string) => {
    setFilterDateFrom(value);
    if (value) {
      addFilter('dateFrom', value);
    } else {
      removeFilter('dateFrom');
    }
  };

  const handleDateToChange = (value: string) => {
    setFilterDateTo(value);
    if (value) {
      addFilter('dateTo', value);
    } else {
      removeFilter('dateTo');
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-amber-300">A carregar produtos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen text-amber-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Lista de Produtos</h1>
        <button
          onClick={() => navigate('/produtos/novo')}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all border border-amber-500/30 shadow-lg font-medium"
        >
          Novo Produto
        </button>
      </div>

      {/* 🎯 NOVO: FilterChips Component */}
      <FilterChips
        filters={activeFilters}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />

      

      {/* Filtros Avançados */}
      <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 p-6 rounded-xl shadow-2xl border border-amber-500/30 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">🔍 Filtros Avançados</h3>
          {activeFilters.length > 0 && (
            <span className="text-sm text-amber-400 font-medium">
              {products.length} resultado{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Localização */}
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">
              Localização
            </label>
            <input
              type="text"
              placeholder="Ex: Corredor A..."
              value={filterLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50"
            />
          </div>

          {/* Data De */}
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">
              Data (De)
            </label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white"
            />
          </div>

          {/* Data Até */}
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">
              Data (Até)
            </label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white"
            />
          </div>
        </div>
      </div>

      {/* Pesquisa e Status */}
      <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 rounded-xl shadow-2xl border border-amber-500/30 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">Pesquisar</label>
            <input
              type="text"
              placeholder="Código, descrição..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">Filtrar por Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white"
            >
              <option value="" className="bg-[#1e293b]">Todos os Estados</option>
              {Object.entries(statusLabels.product).map(([key, value]) => (
                <option key={key} value={key} className="bg-[#1e293b]">{value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 shadow-2xl rounded-xl overflow-hidden border border-amber-500/30">
        {products.length === 0 ? (
          <div className="p-8 text-center text-amber-300/70">
            <svg className="w-12 h-12 text-amber-500/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-semibold">Nenhum produto encontrado</p>
            {activeFilters.length > 0 && (
              <p className="text-sm mt-2">Tente ajustar os filtros ou usar "Limpar Todos"</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-amber-900/30 to-amber-900/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Fornecedor</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Localização</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Data Receção</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10">
                {products.map((product) => (
                  <tr 
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="hover:bg-amber-900/10 cursor-pointer transition-all group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white group-hover:text-amber-300">{product.internalCode}</td>
                    <td className="px-6 py-4 text-sm text-amber-200 max-w-xs truncate group-hover:text-amber-300">{product.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-200 group-hover:text-amber-300">{product.quantity} {product.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-200 group-hover:text-amber-300">{product.supplier?.name || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass('product', product.status)}`}>
                        {statusLabels.product[product.status] || product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-200 group-hover:text-amber-300">{product.currentLocation || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-200 group-hover:text-amber-300">
                      {new Date(product.createdAt).toLocaleDateString('pt-PT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-amber-400">
        Mostrando {products.length} produto{products.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ProductList;