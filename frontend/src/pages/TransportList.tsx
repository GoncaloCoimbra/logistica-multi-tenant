import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { theme, getStatusBadgeClass, statusLabels, statusColors } from '../theme.config';
import { useFilters } from '../hooks/useFilters';
import FilterChips from '../components/FilterChips';
import FilterSelector from '../components/FilterSelector';
import ProductSelector from '../components/ProductSelector';
import { Package, Trash2, Play } from 'lucide-react';

interface Transport {
  id: string;
  vehicleId: string;
  vehicle?: {
    licensePlate: string;
    model: string;
  };
  origin: string;
  destination: string;
  departureDate: string;
  estimatedArrival: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  totalWeight: number;
  notes?: string;
  createdAt: string;
  companyId: string;
}

interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  brand: string;
  status: string;
}

interface User {
  id: string;
  companyId: string;
  role: string;
  email: string;
}

interface Company {
  id: string;
  name: string;
}

interface SelectedProduct {
  productId: string;
  quantity: number;
  product?: {
    id: string;
    internalCode: string;
    description: string;
    quantity: number;
    unit: string;
    status: string;
  };
}

const extractErrorMessage = (error: any, defaultMessage: string = 'Erro ao processar requisição'): string => {
  if (!error) return defaultMessage;
  
  if (error.response?.data) {
    const data = error.response.data;
    
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.message) {
      if (Array.isArray(data.message)) {
        return data.message[0] || defaultMessage;
      }
      if (typeof data.message === 'string') {
        return data.message;
      }
    }
    
    if (data.error && typeof data.error === 'string') {
      return data.error;
    }
  }
  
  if (error.message && typeof error.message === 'string') {
    return error.message;
  }
  
  return defaultMessage;
};

const TransportList: React.FC = () => {
  const {
    activeFilters,
    hasFilters,
    addFilter,
    removeFilter,
    clearAllFilters,
    getFilter,
  } = useFilters();

  const [transports, setTransports] = useState<Transport[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState<'vehicle' | 'status' | null>(null);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    origin: '',
    destination: '',
    departureDate: '',
    estimatedArrival: '',
    totalWeight: 0,
    notes: '',
    status: 'PENDING' as 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED',
    products: [] as SelectedProduct[],
  });

  // Flags e mensagens para UX (salvamento/exclusão)
  const [savingTransport, setSavingTransport] = useState<boolean>(false);
  const [deletingTransportId, setDeletingTransportId] = useState<string | null>(null);
  const [transportMessage, setTransportMessage] = useState<string>('');

  useEffect(() => {
    loadUser();
    loadTransports();
    loadVehicles();
  }, []);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      loadCompanies();
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      console.log('👤 Usuário carregado:', response.data);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  const loadTransports = async () => {
    try {
      setError('');
      
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (getFilter('vehicle')) params.set('vehicleId', getFilter('vehicle')!);
      if (getFilter('status')) params.set('status', getFilter('status')!);
      if (getFilter('dateFrom')) params.set('dateFrom', getFilter('dateFrom')!);
      if (getFilter('dateTo')) params.set('dateTo', getFilter('dateTo')!);
      
      const response = await api.get(`/transports?${params.toString()}`);
      setTransports(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar transportes:', error);
      setError(extractErrorMessage(error, 'Erro ao carregar transportes'));
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar veículos:', error);
      setError(extractErrorMessage(error, 'Erro ao carregar veículos'));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTransports();
  };

  const navigate = useNavigate();

  const handleSimulate = (transport: Transport) => {
    // navigate to rastreamento page and pass transport id and vehicle
    const qs = new URLSearchParams();
    qs.set('vehicle', transport.vehicleId || '');
    qs.set('transport', transport.id);
    navigate(`/rastreamento?${qs.toString()}`);
  };

  const openFilterModal = (type: 'vehicle' | 'status') => {
    setCurrentFilterType(type);
    setIsModalOpen(true);
  };

  const handleFilterSelect = (id: string, label: string) => {
    if (currentFilterType) {
      addFilter(currentFilterType, id);
    }
  };

  const getNextFilter = () => {
    if (!getFilter('vehicle')) return { type: 'vehicle' as const, label: 'Veículo' };
    if (!getFilter('status')) return { type: 'status' as const, label: 'Estado' };
    return null;
  };

  const nextFilter = getNextFilter();

  //  MÉTODO handleSubmit CORRIGIDO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!formData.vehicleId || !formData.origin || !formData.destination || !formData.departureDate) {
        setError('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      if (!formData.estimatedArrival) {
        setError('Data de chegada estimada é obrigatória');
        return;
      }

      // ⚠️ Validação de produtos APENAS na criação
      if (!editingId && formData.products.length === 0) {
        const confirm = window.confirm(
          'Nenhum produto foi adicionado ao transporte. Deseja continuar mesmo assim?'
        );
        if (!confirm) return;
      }

      const companyIdToUse = editingId 
        ? undefined
        : (user?.role === 'SUPER_ADMIN' ? selectedCompanyId : user?.companyId);

      if (user?.role === 'SUPER_ADMIN' && !editingId && !selectedCompanyId) {
        setError('Por favor, selecione uma empresa');
        return;
      }

      const weight = parseFloat(formData.totalWeight.toString());
      if (isNaN(weight) || weight <= 0) {
        setError('Peso total inválido. Digite um número maior que zero.');
        return;
      }

      //  PREPARAR PAYLOAD BASEADO NO MODO (CRIAÇÃO vs EDIÇÃO)
      let dataToSend: any;

      if (editingId) {
        // ⚠️ MODO EDIÇÃO: NÃO ENVIA PRODUTOS
        dataToSend = {
          vehicleId: formData.vehicleId,
          origin: formData.origin.trim(),
          destination: formData.destination.trim(),
          departureDate: formData.departureDate,
          estimatedArrival: formData.estimatedArrival,
          totalWeight: weight,
          notes: formData.notes?.trim() || null,
          status: formData.status,
          //  SEM campo 'products'
        };

        console.log('⚠️ MODO EDIÇÃO: Produtos NÃO serão enviados');
        
      } else {
        //  MODO CRIAÇÃO: ENVIA PRODUTOS
        dataToSend = {
          vehicleId: formData.vehicleId,
          origin: formData.origin.trim(),
          destination: formData.destination.trim(),
          departureDate: formData.departureDate,
          estimatedArrival: formData.estimatedArrival,
          totalWeight: weight,
          notes: formData.notes?.trim() || null,
          status: formData.status,
          products: formData.products.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
          })),
        };

        // Adicionar companyId se necessário
        if (companyIdToUse) {
          dataToSend.companyId = companyIdToUse;
        }

        console.log(' MODO CRIAÇÃO: Produtos serão enviados');
      }

      // Ensure backend enum compatibility: frontend uses 'CANCELLED' label, backend expects 'CANCELED'
      if (dataToSend.status === 'CANCELLED') {
        dataToSend.status = 'CANCELED';
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 Enviando dados do transporte');
      console.log('🔄 Modo:', editingId ? 'EDIÇÃO' : 'CRIAÇÃO');
      console.log('📦 Produtos:', editingId ? 'NÃO ENVIADOS' : formData.products.length);
      console.log('📊 Dados:', JSON.stringify(dataToSend, null, 2));
      console.log('👤 User Role:', user?.role);
      console.log('🏢 CompanyId:', companyIdToUse || 'não enviado');

      try {
        setSavingTransport(true);
        if (editingId) {
          console.log(`🔧 PATCH /transports/${editingId}`);
          await api.patch(`/transports/${editingId}`, dataToSend);
          setTransportMessage('Transporte atualizado com sucesso');
        } else {
          console.log('🆕 POST /transports');
          await api.post('/transports', dataToSend);
          setTransportMessage('Transporte criado com sucesso');
        }

        // Recarregar dados e limpar formulário
        await loadTransports();
        await loadVehicles();
        resetForm();

        // Remover mensagem após breve período
        setTimeout(() => setTransportMessage(''), 5000);
      } finally {
        setSavingTransport(false);
      }
    } catch (error: any) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error(' Erro ao guardar transporte');
      console.error('📋 Mensagem:', error.message);
      console.error('📊 Response data:', error.response?.data);
      console.error('🔢 Response status:', error.response?.status);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      setError(extractErrorMessage(error, 'Erro ao guardar transporte'));
    }
  };

  const handleEdit = (transport: Transport) => {
    setFormData({
      vehicleId: transport.vehicleId,
      origin: transport.origin,
      destination: transport.destination,
      departureDate: transport.departureDate.split('T')[0],
      estimatedArrival: transport.estimatedArrival.split('T')[0],
      totalWeight: transport.totalWeight,
      notes: transport.notes || '',
      // Normalizar status do backend (podendo ser 'CANCELED') para o rótulo usado na UI ('CANCELLED')
      status: (transport.status as string) === 'CANCELED' ? 'CANCELLED' : transport.status,
      products: [], // ⚠️ Limpar produtos na edição
    });
    setEditingId(transport.id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este transporte?')) {
      try {
        setError('');
        setDeletingTransportId(id);
        await api.delete(`/transports/${id}`);
        await loadTransports();
        await loadVehicles();
        setTransportMessage('Transporte excluído');
        setTimeout(() => setTransportMessage(''), 4000);
      } catch (error: any) {
        console.error('Erro ao excluir transporte:', error);
        setError(extractErrorMessage(error, 'Erro ao excluir transporte'));
      } finally {
        setDeletingTransportId(null);
      }
    }
  };

  const handleProductsSelect = (products: SelectedProduct[]) => {
    setFormData({ ...formData, products });
  };

  const handleRemoveProduct = (productId: string) => {
    setFormData({
      ...formData,
      products: formData.products.filter(p => p.productId !== productId),
    });
  };

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      origin: '',
      destination: '',
      departureDate: '',
      estimatedArrival: '',
      totalWeight: 0,
      notes: '',
      status: 'PENDING',
      products: [],
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSelectedCompanyId('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  if (loading) {
    return (
      <div className={`${theme.backgrounds.page} flex items-center justify-center min-h-screen`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-[#cbd5e1]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.backgrounds.page} p-6 min-h-screen`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Transportes</h1>
          <p className="text-sm text-[#cbd5e1] mt-1">Gestão de transportes e entregas</p>
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
              Cancelar
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Transporte
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-900/30 to-red-900/20 border-l-4 border-red-500/70 text-red-400 px-4 py-3 rounded-lg mb-6 shadow-lg backdrop-blur-sm font-semibold">
          <div className="flex">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Erro</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Pesquisar transportes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg bg-[#1e293b] text-white"
          />
        </div>
        <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          Pesquisar
        </button>
      </form>

      <FilterChips
        filters={activeFilters}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />

      {!loading && nextFilter && (
        <button
          onClick={() => openFilterModal(nextFilter.type)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e293b]/50 border-2 border-dashed border-slate-600 text-slate-300 rounded-lg hover:border-amber-500 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {nextFilter.label}
        </button>
      )}

      {showForm && (
        <div className={`${theme.cards.form} border-2 border-amber-500/50 mb-6`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            {editingId ? (
              <>
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Transporte
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Transporte
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
                  <span className="text-sm text-[#cbd5e1] font-medium">
                    Selecione a empresa para criar o transporte
                  </span>
                </div>
                <label className="block text-sm font-medium mb-2 text-amber-200">
                  Empresa *
                </label>
                <select
                  required
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className={theme.inputs.base}
                >
                  <option value="">Selecione uma empresa...</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-amber-200">Veículo *</label>
              <select
                required
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className={theme.inputs.base}
              >
                <option value="">Selecione um veículo</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.licensePlate} - {vehicle.model} ({vehicle.brand})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-amber-200">Peso Total (kg) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.totalWeight || ''}
                onChange={(e) => setFormData({ ...formData, totalWeight: parseFloat(e.target.value) || 0 })}
                className={theme.inputs.base}
                placeholder="Ex: 1500.50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-amber-200">Origem *</label>
              <input
                type="text"
                required
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className={theme.inputs.base}
                placeholder="Cidade/Local de origem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-amber-200">Destino *</label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className={theme.inputs.base}
                placeholder="Cidade/Local de destino"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-amber-200">Data de Partida *</label>
              <input
                type="date"
                required
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className={theme.inputs.base}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-amber-200">Chegada Estimada *</label>
              <input
                type="date"
                required
                value={formData.estimatedArrival}
                onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })}
                className={theme.inputs.base}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-amber-200">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className={theme.inputs.base}
              >
                <option value="PENDING">Pendente</option>
                <option value="IN_TRANSIT">Em Trânsito</option>
                <option value="DELIVERED">Entregue</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-amber-200">Observações</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className={theme.inputs.base}
                rows={3}
                placeholder="Informações adicionais sobre o transporte..."
              />
            </div>

            {/*  SEÇÃO DE PRODUTOS COM LÓGICA CORRIGIDA */}
            <div className="col-span-2 border-t border-amber-500/30 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Produtos ({formData.products.length})
                  </h3>
                  {editingId && (
                    <span className="px-2 py-1 bg-orange-900/30 text-orange-400 text-xs font-bold rounded border border-orange-500/30">
                      ⚠️ Não editáveis
                    </span>
                  )}
                </div>
                
                {/*  Botão só aparece na CRIAÇÃO */}
                {!editingId && (
                  <button
                    type="button"
                    onClick={() => setIsProductSelectorOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-bold shadow-lg flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Adicionar Produtos
                  </button>
                )}
              </div>

              {/* ⚠️ AVISO na EDIÇÃO */}
              {editingId && (
                <div className="mb-4 p-4 bg-gradient-to-r from-amber-900/20 to-amber-800/10 border-2 border-amber-500/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-amber-300 font-semibold text-sm">
                        ℹ️ Produtos não podem ser editados após a criação do transporte
                      </p>
                      <p className="text-amber-400/70 text-xs mt-1">
                        Para alterar produtos: cancele este transporte e crie um novo
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {formData.products.length === 0 && !editingId ? (
                <div className="p-6 bg-slate-800/50 border-2 border-dashed border-amber-500/30 rounded-lg text-center">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">Nenhum produto adicionado</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Clique em "Adicionar Produtos" para selecionar
                  </p>
                </div>
              ) : formData.products.length > 0 ? (
                <div className="space-y-3">
                  {formData.products.map((item) => (
                    <div
                      key={item.productId}
                      className={`p-4 border rounded-lg flex items-center justify-between transition-all ${
                        editingId
                          ? 'bg-slate-800/30 border-slate-700/50 opacity-75'
                          : 'bg-gradient-to-r from-slate-800/80 to-slate-700/50 border-amber-500/30 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded">
                            {item.product?.internalCode || item.productId}
                          </span>
                          <h4 className="text-white font-semibold">
                            {item.product?.description || 'Produto'}
                          </h4>
                          {editingId && (
                            <span className="text-xs text-slate-500 italic">
                              (somente leitura)
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">
                          Quantidade: <span className="text-amber-300 font-semibold">
                            {item.quantity} {item.product?.unit || 'un'}
                          </span>
                        </p>
                      </div>
                      
                      {/*  Botão remover só aparece na CRIAÇÃO */}
                      {!editingId && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(item.productId)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all"
                          title="Remover produto"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="p-4 bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Total de produtos:</span>
                      <span className="text-amber-300 font-bold text-lg">
                        {formData.products.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-slate-400">Total de unidades:</span>
                      <span className="text-amber-300 font-bold text-lg">
                        {formData.products.reduce((sum, p) => sum + p.quantity, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="col-span-2 flex gap-2 justify-end pt-4 border-t border-amber-500/30">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border-2 border-amber-500/50 text-amber-400 rounded-lg hover:bg-amber-900/20 transition-all font-bold hover:border-amber-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={savingTransport}
                className={`px-6 py-2 ${savingTransport ? 'bg-amber-400/60 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'} text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl flex items-center gap-2`}
              >
                {savingTransport ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    {editingId ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingId ? 'Atualizar' : 'Criar'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-lg overflow-hidden border-2 border-amber-500/30 hover:border-amber-500/50 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#0f172a] to-black">
              <tr>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Veículo
                </th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Rota
                </th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Partida
                </th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Chegada
                </th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Peso
                </th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Status
                </th>
                <th className="bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-right text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/20">
              {transports.map((transport) => (
                <tr key={transport.id} className="hover:bg-amber-900/10 transition-colors border-b border-amber-500/10">
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="font-bold text-white">{transport.vehicle?.licensePlate || 'N/A'}</div>
                    <div className="text-sm text-amber-300">{transport.vehicle?.model || ''}</div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="text-sm">
                      <div className="font-bold text-white">{transport.origin}</div>
                      <div className="text-amber-300">→ {transport.destination}</div>
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-amber-300">
                    {formatDate(transport.departureDate)}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-amber-300">
                    {formatDate(transport.estimatedArrival)}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-white">
                    {transport.totalWeight} kg
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeClass('transport', transport.status)}>
                      {statusLabels.transport[transport.status]}
                    </span>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(transport)}
                      className="text-amber-400 hover:text-amber-300 font-bold mr-3 inline-flex items-center gap-1 transition-colors hover:bg-amber-900/30 p-2 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(transport.id)}
                      disabled={deletingTransportId === transport.id}
                      className={`text-red-400 ${deletingTransportId === transport.id ? 'bg-red-900/30 cursor-not-allowed' : 'hover:text-red-300'} font-bold inline-flex items-center gap-1 transition-colors p-2 rounded-lg`}
                    >
                      {deletingTransportId === transport.id ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                          Excluindo...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Excluir
                        </>
                      )}
                    </button>
                    {transport.status === 'PENDING' && (
                      <button
                        onClick={() => handleSimulate(transport)}
                        className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 transition-colors hover:bg-blue-900/30 p-2 rounded-lg ml-3"
                      >
                        <Play className="w-4 h-4" /> Simular
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transports.length === 0 && (
          <div className="text-center py-12 text-amber-500/70">
            <svg className="w-16 h-16 mx-auto mb-4 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-bold text-amber-400">Nenhum transporte cadastrado</p>
            <p className="text-sm mt-1">Clique em "Novo Transporte" para começar</p>
          </div>
        )}
      </div>

      {transportMessage && (
        <div className="mb-4 px-4 py-2 bg-emerald-900/20 border-l-4 border-emerald-500 text-emerald-200 rounded">
          {transportMessage}
        </div>
      )}

      {transports.length > 0 && (
        <div className="mt-4 text-sm text-amber-400/80 font-medium">
          Total: <span className="font-bold text-amber-400">{transports.length}</span> transporte{transports.length !== 1 ? 's' : ''}
        </div>
      )}

      {isModalOpen && currentFilterType && (
        <FilterSelector
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentFilterType(null);
          }}
          type={currentFilterType}
          onSelect={handleFilterSelect}
          currentFilters={{
            vehicleId: getFilter('vehicle') || '',
            status: getFilter('status') || '',
          }}
          placeholder={`Pesquisar ${currentFilterType === 'vehicle' ? 'veículos' : 'estados'}...`}
        />
      )}

      <ProductSelector
        open={isProductSelectorOpen}
        onClose={() => setIsProductSelectorOpen(false)}
        onSelect={handleProductsSelect}
        alreadySelected={formData.products}
      />
    </div>
  );
};

export default TransportList;