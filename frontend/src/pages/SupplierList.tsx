import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { theme, getStatusBadgeClass } from '../theme.config';
import { useFilters } from '../hooks/useFilters';
import FilterChips from '../components/FilterChips';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  nif: string;
  address?: string;
  city?: string;
  state?: string;
  createdAt: string;
  companyId: string;
}

interface User {
  id: string;
  companyId: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
}

// 🔧 FUNÇÃO MELHORADA para extrair mensagens de error do backend
const getErrorMessage = (error: any, defaultMessage: string): string => {
  console.log('🔍 [ERROR DEBUG] Estrutura completa do error:', error);
  console.log('🔍 [ERROR DEBUG] error.response:', error?.response);
  console.log('🔍 [ERROR DEBUG] error.response.data:', error?.response?.data);
  
  if (!error) return defaultMessage;
  
  // 1️⃣ Tentar extrair de error.response.data
  if (error.response?.data) {
    const date = error.response.data;
    console.log('📦 [ERROR DEBUG] date type:', typeof date);
    console.log('📦 [ERROR DEBUG] date.message:', date.message);
    
    // Se date é string diretamente
    if (typeof date === 'string') {
      console.log(' [ERROR DEBUG] Retornando date como string');
      return date;
    }
    
    // Se date.message existe
    if (date.message) {
      // Se é array (validação do NestJS)
      if (Array.isArray(date.message)) {
        console.log(' [ERROR DEBUG] Retornando primeiro item do array');
        return date.message[0] || defaultMessage;
      }
      // Se é string
      if (typeof date.message === 'string') {
        console.log(' [ERROR DEBUG] Retornando date.message');
        return date.message;
      }
      // Se é objeto (pode ter nested message)
      if (typeof date.message === 'object' && date.message.message) {
        console.log(' [ERROR DEBUG] Retornando date.message.message');
        return date.message.message;
      }
    }
    
    // Se date.error existe e é string
    if (date.error && typeof date.error === 'string') {
      console.log(' [ERROR DEBUG] Retornando date.error');
      return date.error;
    }

    // Se date.error é objeto
    if (date.error && typeof date.error === 'object') {
      if (date.error.message) {
        console.log(' [ERROR DEBUG] Retornando date.error.message');
        return date.error.message;
      }
      // Tentar JSON.stringify como último recurso
      try {
        const errorStr = JSON.stringify(date.error);
        if (errorStr !== '{}') {
          console.log(' [ERROR DEBUG] Retornando JSON.stringify(date.error)');
          return errorStr;
        }
      } catch (e) {
        console.log('⚠️ [ERROR DEBUG] Failure ao stringify error.response.data.error');
      }
    }

    // 🆕 Tentar statusText do response
    if (error.response.statusText) {
      console.log(' [ERROR DEBUG] Retornando statusText');
      return error.response.statusText;
    }
  }
  
  // 2️⃣ Tentar error.message
  if (error.message && typeof error.message === 'string') {
    console.log(' [ERROR DEBUG] Retornando error.message');
    return error.message;
  }
  
  // 3️⃣ Se nada funcionar, retornar mensagem padrão
  console.log('⚠️ [ERROR DEBUG] Retornando mensagem padrão');
  return defaultMessage;
};

const SupplierList: React.FC = () => {
  const { activeFilters, addFilter, removeFilter, clearAllFilters, getFilter } = useFilters();
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  
  const [searchTerm, setSearchTerm] = useState(getFilter('search'));
  
  const [formData, setFormData] = useState({
    name: '',
    nif: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      loadCompanies();
    }
  }, [user]);

  useEffect(() => {
    loadSuppliers();
  }, [activeFilters]);

  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error ao load usuário:', error);
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadSuppliers = async () => {
    try {
      setError('');
      
      const params = new URLSearchParams();
      activeFilters.forEach(filter => {
        params.append(filter.key, filter.value);
      });
      
      const queryString = params.toString();
      const url = `/suppliers${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      setSuppliers(response.data);
    } catch (error: any) {
      console.error('Error loading suppliers:', error);
      setError(getErrorMessage(error, 'Error loading suppliers'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      addFilter('search', value);
    } else {
      removeFilter('search');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.nif) {
        setError('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Por favor, insira um email válido');
        return;
      }

      const companyIdToUse = user?.role === 'SUPER_ADMIN' 
        ? (editingId ? user?.companyId : selectedCompanyId)
        : user?.companyId;

      if (user?.role === 'SUPER_ADMIN' && !editingId && !selectedCompanyId) {
        setError('Please select a company');
        return;
      }

      const dataToSend = {
        name: formData.name.trim(),
        nif: formData.nif.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address?.trim() || null,
        city: formData.city?.trim() || null,
        state: formData.state?.trim() || null,
        companyId: companyIdToUse
      };

      if (editingId) {
        await api.patch(`/suppliers/${editingId}`, dataToSend);
      } else {
        await api.post('/suppliers', dataToSend);
      }
      
      await loadSuppliers();
      resetForm();
    } catch (error: any) {
        console.error(' Error saving supplier:', error);
      setError(getErrorMessage(error, 'Error saving supplier'));
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setFormData({
      name: supplier.name,
      nif: supplier.nif,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      city: supplier.city || '',
      state: supplier.state || '',
    });
    setEditingId(supplier.id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Do you really want to delete this supplier?')) {
      try {
        setError('');
        console.log('🗑️ Trying to delete supplier:', id);
        await api.delete(`/suppliers/${id}`);
        console.log(' Supplier deleted successfully');
        await loadSuppliers();
      } catch (error: any) {
        console.error(' Error deleting supplier:', error);
        console.error(' Status do error:', error?.response?.status);
        console.error(' Date do error:', error?.response?.data);
        
        const errorMsg = getErrorMessage(error, 'Error deleting supplier');
        console.log('📝 Mensagem de error extraída:', errorMsg);
        setError(errorMsg);
        
        // 🔔 Scroll suave para o topo para mostrar o error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nif: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSelectedCompanyId('');
  };

  if (loading) {
    return (
      <div className={`${theme.backgrounds.page} flex items-center justify-center min-h-screen`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-[#cbd5e1] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.backgrounds.page} p-6 min-h-screen`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Suppliers</h1>
          <p className="text-sm text-[#cbd5e1] mt-1">Company supplier management</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className={`${
            showForm
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800'
          } text-white px-6 py-3 rounded-lg transition-all font-bold shadow-lg hover:shadow-xl flex items-center gap-2`}
        >
          {showForm ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Supplier
            </>
          )}
        </button>
      </div>

      {/* 🔔 ALERTA DE ERRO MELHORADO */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/40 to-red-900/30 border-2 border-red-500/80 text-red-300 px-6 py-4 rounded-lg mb-6 shadow-2xl backdrop-blur-sm animate-pulse">
          <div className="flex items-start">
            <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-bold text-lg text-red-200">⚠️ Error</p>
              <p className="text-base mt-2 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="ml-4 text-red-400 hover:text-red-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FilterChips */}
      <FilterChips
        filters={activeFilters}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />

      {/* Barra de Pesquisa */}
      <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 rounded-xl shadow-2xl border border-amber-500/30 p-6 mb-6">
        <label className="block text-sm font-medium text-amber-300 mb-2">Search Supplier</label>
        <input
          type="text"
          placeholder="Name ou NIF..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50"
        />
      </div>

      {showForm && (
        <div className={`${theme.cards.form} border-2 border-amber-500/50`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            {editingId ? (
              <>
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Supplier
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Supplier
              </>
            )}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {user?.role === 'SUPER_ADMIN' && !editingId && (
              <div className="col-span-2 bg-gradient-to-r from-[#3b82f6]/20 to-[#1d4ed8]/20 border-2 border-[#3b82f6] rounded-lg p-4 mb-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`${getStatusBadgeClass('user', 'SUPER_ADMIN')} text-xs`}>
                    SUPER ADMIN
                  </span>
                  <span className="text-sm text-[#cbd5e1] font-semibold">
                    Select the company to create the supplier
                  </span>
                </div>
                <label className="block text-sm font-bold mb-2 text-[#3b82f6]">
                  Company *
                </label>
                <select
                  required
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className={theme.inputs.base}
                >
                  <option value="">Select a company...</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-1 text-amber-200">Name Completo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={theme.inputs.base}
                placeholder="Ex: Supplier XYZ Ltd."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-amber-200">NIF/NIPC *</label>
              <input
                type="text"
                required
                value={formData.nif}
                onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                className={theme.inputs.base}
                placeholder="Ex: 123456789"
                maxLength={9}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-amber-200">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={theme.inputs.base}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-amber-200">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={theme.inputs.base}
                placeholder="+351 912 345 678"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-1 text-amber-200">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={theme.inputs.base}
                placeholder="Rua, número, andar"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-amber-200">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={theme.inputs.base}
                placeholder="Ex: Porto"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-amber-200">País</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className={theme.inputs.base}
                placeholder="Ex: Portugal"
              />
            </div>
            <div className="col-span-2 flex gap-2 justify-end pt-4 border-t-2 border-amber-500/30">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border-2 border-amber-500/50 text-amber-400 rounded-lg hover:bg-amber-900/20 transition-all font-bold hover:border-amber-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-bold shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={`${theme.backgrounds.table} border-2 border-amber-500/30 hover:border-amber-500/50 transition-all`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#0f172a] to-black">
              <tr>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">Name</th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">NIF</th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">Email</th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">Phone</th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">City</th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-right text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/20">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-amber-900/10 transition-colors border-b border-amber-500/10">
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-white font-medium border-b border-amber-500/10">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">
                          {supplier.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-bold text-white">{supplier.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-amber-300 border-l border-amber-500/20 border-b border-amber-500/10">{supplier.nif}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-amber-200 border-l border-amber-500/20 border-b border-amber-500/10">{supplier.email || '-'}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-amber-200 border-l border-amber-500/20 border-b border-amber-500/10">{supplier.phone || '-'}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-amber-200 border-l border-amber-500/20 border-b border-amber-500/10">{supplier.city || '-'}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium border-l border-amber-500/20 border-b border-amber-500/10">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-amber-400 hover:text-amber-300 font-bold mr-3 inline-flex items-center gap-1 transition-colors hover:bg-amber-900/30 p-2 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-400 hover:text-red-300 font-bold inline-flex items-center gap-1 transition-colors hover:bg-red-900/30 p-2 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {suppliers.length === 0 && (
          <div className="text-center py-12 text-amber-500/70">
            <svg className="w-16 h-16 mx-auto mb-4 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-lg font-bold text-amber-400">Nenhum supplier cadastrado</p>
            {activeFilters.length > 0 ? (
              <p className="text-sm mt-1">Nenhum supplier encontrado com os filtros aplicados</p>
            ) : (
              <p className="text-sm mt-1">Click "New Supplier" to get started</p>
            )}
          </div>
        )}
      </div>

      {suppliers.length > 0 && (
        <div className="mt-4 text-sm text-amber-400/80 font-medium">
          Total: <span className="font-bold text-amber-400">{suppliers.length}</span> supplier{suppliers.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default SupplierList;