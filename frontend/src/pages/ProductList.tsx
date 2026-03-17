import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { getStatusBadgeClass, statusLabels } from '../theme.config';
import { useFilters } from '../hooks/useFilters';
import FilterChips from '../components/FilterChips';
import FilterSelector from '../components/FilterSelector';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { activeFilters, addFilter, removeFilter, clearAllFilters, getFilter } = useFilters();
  
  const [searchTerm, setSearchTerm] = useState(getFilter('search'));
  const [statusFilter, setStatusFilter] = useState(getFilter('status'));
  const [filterLocation, setFilterLocation] = useState(getFilter('location'));
  const [filterDateFrom, setFilterDateFrom] = useState(getFilter('dateFrom'));
  const [filterDateTo, setFilterDateTo] = useState(getFilter('dateTo'));

  const filters = {
    search: searchTerm,
    status: statusFilter,
    location: filterLocation,
    dateFrom: filterDateFrom,
    dateTo: filterDateTo,
  };

  const { data: products = [], isLoading: loading, error } = useProducts(filters);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
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
          <span className="ml-3 text-amber-300">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen text-amber-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Products List</h1>
        <button
          onClick={() => navigate('/products/ new')}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all border border-amber-500/30 shadow-lg font-medium"
        >
          New Product
        </button>
      </div>

      {/* 🎯  new: FilterChips Component */}
      <FilterChips
        filters={activeFilters}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />

      

      {/* Advanced Filters */}
      <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 p-6 rounded-xl shadow-2xl border border-amber-500/30 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
          {activeFilters.length > 0 && (
            <span className="text-sm text-amber-400 font-medium">
              {products.length} result{products.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="E.g.: Corridor A..."
              value={filterLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50"
            />
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">
              Date (From)
            </label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">
              Date (To)
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
            <label className="block text-sm font-medium text-amber-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Code, description..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white"
            >
              <option value="" className="bg-[#1e293b]">All Statuses</option>
              {Object.entries(statusLabels.product).map(([key, value]) => (
                <option key={key} value={key} className="bg-[#1e293b]">{value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 shadow-2xl rounded-xl overflow-hidden border border-amber-500/30">
        {products.length === 0 ? (
          <div className="p-8 text-center text-amber-300/70">
            <svg className="w-12 h-12 text-amber-500/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-semibold">No products found</p>
            {activeFilters.length > 0 && (
              <p className="text-sm mt-2">Try adjusting the filters or use "Clear All"</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-amber-900/30 to-amber-900/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Reception Date</th>
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
                      {new Date(product.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-amber-400">
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ProductList;