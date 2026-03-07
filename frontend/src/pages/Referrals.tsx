import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

interface Referral {
  id: string;
  clientName: string;
  contactInfo: string;
  referralSource: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  projectType: 'freight' | 'logistics' | 'storage' | 'customs' | 'other';
  estimatedValue: number;
  referralDate: string;
  notes?: string;
  referredBy: string;
  commission?: number;
  companyId: string;
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

const Referrals: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);

  const [loadingReferrals, setLoadingReferrals] = useState<boolean>(false);
  const [referralsError, setReferralsError] = useState<string>('');
  const [creatingSamples, setCreatingSamples] = useState<boolean>(false);
  const [sampleMessage, setSampleMessage] = useState<string>('');

  // Estados para modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [referralToDelete, setReferralToDelete] = useState<string | null>(null);

  // Flags de carregamento para operações
  const [creatingReferral, setCreatingReferral] = useState<boolean>(false);
  const [editingReferral, setEditingReferral] = useState<boolean>(false);
  const [deletingReferralLoading, setDeletingReferralLoading] = useState<boolean>(false);

  // Estado para o formulário
  const [formData, setFormData] = useState({
    clientName: '',
    contactInfo: '',
    referralSource: '',
    status: 'new' as Referral['status'],
    projectType: 'freight' as Referral['projectType'],
    estimatedValue: 0,
    referralDate: new Date().toISOString().split('T')[0],
    notes: '',
    referredBy: '',
    commission: 0,
  });

  // Carregar dados reais do backend, com fallback
  const loadReferrals = async () => {
    try {
      setLoadingReferrals(true);
      setReferralsError('');
      setSampleMessage('');

      // carregar empresas (para SUPER_ADMIN)
      try {
        const cRes = await api.get('/companies/public');
        setCompanies(Array.isArray(cRes.data) ? cRes.data : []);
        if (cRes.data && cRes.data.length > 0 && !selectedCompanyId) setSelectedCompanyId(cRes.data[0].id);
      } catch (e) {
        console.warn('Não foi possível carregar companies/public:', e);
      }

      // buscar referências de acordo com o user
      const params = new URLSearchParams();
      if (user?.role === 'SUPER_ADMIN') {
        if (selectedCompanyId) params.set('companyId', selectedCompanyId);
      } else if (user?.companyId) {
        params.set('companyId', user.companyId);
      }

      const rRes = await api.get(`/referrals?${params.toString()}`);
      setReferrals(Array.isArray(rRes.data) ? rRes.data : []);
    } catch (err) {
      console.error('Erro ao carregar referências do backend:', err);
      setReferralsError('Dados reais não disponíveis. Ative o backend ou use amostras.');
    } finally {
      setLoadingReferrals(false);
    }
  };

  // Alternar modo SUPER_ADMIN para teste
  const toggleAdminMode = () => {
    if (!user || !updateUserData) return;
    const newRole = user.role === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN';
    updateUserData({ role: newRole });
  };

  // Carregar dados iniciais e quando user/selectedCompanyId mudarem
  useEffect(() => {
    loadReferrals();
  }, [user, selectedCompanyId]);

  // Filtrar referências por empresa selecionada
  const filteredReferrals = referrals.filter(referral => {
    if (user?.role === 'SUPER_ADMIN') {
      return !selectedCompanyId || referral.companyId === selectedCompanyId;
    } else {
      return referral.companyId === user?.companyId;
    }
  });

  // Permite criar alguns registos de exemplo (tenta enviar ao backend; fallback local)
  const createSampleReferrals = async () => {
    if (!window.confirm('Criar 3 referências de exemplo?')) return;

    let targetCompanyId = '';
    if (user?.role === 'SUPER_ADMIN') {
      if (!selectedCompanyId) { alert('Por favor, selecione uma empresa primeiro.'); return; }
      targetCompanyId = selectedCompanyId;
    } else {
      targetCompanyId = user?.companyId || '';
    }

    try {
      setCreatingSamples(true);
      setReferralsError('');

      const newSamples: Referral[] = [
        {
          id: `ref-${Date.now()}-1`,
          clientName: 'Nova Empresa X',
          contactInfo: 'empresax@example.com | +351 911 111 111',
          referralSource: 'Recomendação',
          status: 'new',
          projectType: 'freight',
          estimatedValue: 1500,
          referralDate: new Date().toISOString().split('T')[0],
          notes: 'Nova referência de amostra',
          referredBy: 'Pedro Alves',
          commission: calculateCommission(1500),
          companyId: targetCompanyId
        },
        {
          id: `ref-${Date.now()}-2`,
          clientName: 'Nova Empresa Y',
          contactInfo: 'empresay@example.com | +351 922 222 222',
          referralSource: 'Parceiro',
          status: 'contacted',
          projectType: 'logistics',
          estimatedValue: 4200,
          referralDate: new Date().toISOString().split('T')[0],
          notes: 'Referência de amostra para logística',
          referredBy: 'Sofia Martins',
          commission: calculateCommission(4200),
          companyId: targetCompanyId
        },
        {
          id: `ref-${Date.now()}-3`,
          clientName: 'Nova Empresa Z',
          contactInfo: 'empresaz@example.com | +351 933 333 333',
          referralSource: 'Cliente',
          status: 'new',
          projectType: 'storage',
          estimatedValue: 900,
          referralDate: new Date().toISOString().split('T')[0],
          notes: 'Amostra para armazenamento',
          referredBy: 'Rui Fernandes',
          commission: calculateCommission(900),
          companyId: targetCompanyId
        }
      ];

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Adicionar às referências existentes
      setReferrals(prev => [...prev, ...newSamples]);
      setSampleMessage('3 referências de exemplo criadas com sucesso!');

    } catch (err) {
      console.error('Erro ao criar exemplos:', err);
      setReferralsError('Falha ao criar referências de exemplo.');
    } finally {
      setCreatingSamples(false);
      setTimeout(() => setSampleMessage(''), 6000);
    }
  };

  // Função para criar referência
  const handleCreateReferral = async () => {
    if (!formData.clientName || !formData.contactInfo || !formData.referredBy) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Determinar companyId a ser usado
    let targetCompanyId = '';
    if (user?.role === 'SUPER_ADMIN') {
      if (!selectedCompanyId) {
        alert('Por favor, selecione uma empresa primeiro.');
        return;
      }
      targetCompanyId = selectedCompanyId;
    } else {
      targetCompanyId = user?.companyId || 'company-1';
    }

    const newReferral: Referral = {
      id: `ref-${Date.now()}`,
      clientName: formData.clientName,
      contactInfo: formData.contactInfo,
      referralSource: formData.referralSource,
      status: formData.status,
      projectType: formData.projectType,
      estimatedValue: formData.estimatedValue,
      referralDate: formData.referralDate,
      notes: formData.notes,
      referredBy: formData.referredBy,
      commission: formData.commission || calculateCommission(formData.estimatedValue),
      companyId: targetCompanyId
    };

    try {
      setCreatingReferral(true);
      setReferralsError('');

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setReferrals(prev => [...prev, newReferral]);
      setSampleMessage('Referência criada com sucesso!');

    } catch (err) {
      console.error('Erro ao criar referência:', err);
      setReferralsError('Falha ao criar referência.');
    } finally {
      setCreatingReferral(false);
      setShowCreateModal(false);
      resetForm();
      setTimeout(() => setSampleMessage(''), 5000);
    }
  }; 

  // Função para editar referência
  const handleEditReferral = async () => {
    if (!formData.clientName || !formData.contactInfo || !formData.referredBy) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    if (selectedReferral) {
      const updatedReferral: Referral = {
        ...selectedReferral,
        ...formData,
        commission: formData.commission || calculateCommission(formData.estimatedValue)
      };

      try {
        setEditingReferral(true);
        setReferralsError('');
        
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setReferrals(prev => 
          prev.map(r => r.id === selectedReferral.id ? updatedReferral : r)
        );
        setSampleMessage('Referência atualizada com sucesso!');
        
      } catch (err) {
        console.error('Erro ao atualizar referência:', err);
        setReferralsError('Falha ao atualizar referência.');
      } finally {
        setEditingReferral(false);
        setShowEditModal(false);
        setSelectedReferral(null);
        resetForm();
        setTimeout(() => setSampleMessage(''), 5000);
      }
    }
  }; 

  const calculateCommission = (value: number): number => {
    // 5% de comissão
    return value * 0.05;
  };

  const updateReferralStatus = async (referralId: string, newStatus: Referral['status']) => {
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 300));

      setReferrals(prev => 
        prev.map(referral => 
          referral.id === referralId 
            ? { 
                ...referral, 
                status: newStatus,
                commission: newStatus === 'converted' ? (referral.commission || calculateCommission(referral.estimatedValue)) : referral.commission
              }
            : referral
        )
      );
      
      setSampleMessage(`Status atualizado para ${getStatusLabel(newStatus)}`);
      setTimeout(() => setSampleMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setReferralsError('Falha ao atualizar status.');
    }
  }; 

  const handleDeleteReferral = async (referralId: string) => {
    try {
      setDeletingReferralLoading(true);
      setReferralsError('');
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setReferrals(prev => prev.filter(referral => referral.id !== referralId));
      setSampleMessage('Referência excluída com sucesso!');
      
    } catch (err) {
      console.error('Erro ao excluir referência:', err);
      setReferralsError('Falha ao excluir referência.');
    } finally {
      setDeletingReferralLoading(false);
      setShowViewModal(false);
      setShowDeleteConfirm(false);
      setSelectedReferral(null);
      setReferralToDelete(null);
      setTimeout(() => setSampleMessage(''), 5000);
    }
  }; 

  const confirmDelete = (referralId: string) => {
    setReferralToDelete(referralId);
    setShowDeleteConfirm(true);
    setShowViewModal(false);
  };

  const openEditModal = (referral: Referral) => {
    setSelectedReferral(referral);
    setFormData({
      clientName: referral.clientName,
      contactInfo: referral.contactInfo,
      referralSource: referral.referralSource,
      status: referral.status,
      projectType: referral.projectType,
      estimatedValue: referral.estimatedValue,
      referralDate: referral.referralDate,
      notes: referral.notes || '',
      referredBy: referral.referredBy,
      commission: referral.commission || 0,
    });
    setShowEditModal(true);
  };

  const openViewModal = (referral: Referral) => {
    setSelectedReferral(referral);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      contactInfo: '',
      referralSource: '',
      status: 'new',
      projectType: 'freight',
      estimatedValue: 0,
      referralDate: new Date().toISOString().split('T')[0],
      notes: '',
      referredBy: '',
      commission: 0,
    });
  };

  // Função para obter classe de badge para status
  const getStatusBadgeClass = (status: Referral['status']) => {
    switch (status) {
      case 'new':
        return 'bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-2 border-amber-500 text-amber-300';
      case 'contacted':
        return 'bg-gradient-to-r from-blue-900/30 to-blue-800/20 border-2 border-blue-500 text-blue-300';
      case 'converted':
        return 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border-2 border-emerald-500 text-emerald-300';
      case 'lost':
        return 'bg-gradient-to-r from-red-900/30 to-red-800/20 border-2 border-red-500 text-red-300';
      default:
        return 'bg-gray-800 border-gray-600 text-gray-300';
    }
  };

  const getProjectTypeBadgeClass = (type: Referral['projectType']) => {
    switch (type) {
      case 'freight':
        return 'bg-gradient-to-r from-orange-900/30 to-orange-800/20 border-2 border-orange-500 text-orange-300';
      case 'logistics':
        return 'bg-gradient-to-r from-purple-900/30 to-purple-800/20 border-2 border-purple-500 text-purple-300';
      case 'storage':
        return 'bg-gradient-to-r from-cyan-900/30 to-cyan-800/20 border-2 border-cyan-500 text-cyan-300';
      case 'customs':
        return 'bg-gradient-to-r from-indigo-900/30 to-indigo-800/20 border-2 border-indigo-500 text-indigo-300';
      case 'other':
        return 'bg-gradient-to-r from-gray-900/30 to-gray-800/20 border-2 border-gray-500 text-gray-300';
      default:
        return 'bg-gray-800 border-gray-600 text-gray-300';
    }
  };

  const getStatusLabel = (status: Referral['status']) => {
    const labels = {
      new: 'Novo',
      contacted: 'Contactado',
      converted: 'Convertido',
      lost: 'Perdido'
    };
    return labels[status];
  };

  const getProjectTypeLabel = (type: Referral['projectType']) => {
    const labels = {
      freight: 'Transporte',
      logistics: 'Logística',
      storage: 'Armazenamento',
      customs: 'Alfândega',
      other: 'Outro'
    };
    return labels[type];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  // Calcular estatísticas
  const totalValue = filteredReferrals.reduce((sum, ref) => sum + ref.estimatedValue, 0);
  const totalCommission = filteredReferrals.reduce((sum, ref) => sum + (ref.commission || 0), 0);
  const convertedReferrals = filteredReferrals.filter(ref => ref.status === 'converted').length;
  const conversionRate = filteredReferrals.length > 0 ? (convertedReferrals / filteredReferrals.length * 100).toFixed(1) : '0';

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Referências</h1>
          <p className="text-sm text-slate-300 mt-1">Gestão de referências e indicações (Modo Local)</p>

          {/* Seletor de Modo de Usuário */}
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={toggleAdminMode}
              className={`px-3 py-1 rounded text-sm font-bold ${user?.role === 'SUPER_ADMIN' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              {user?.role === 'SUPER_ADMIN' ? '🔒 SUPER ADMIN' : '👤 USUÁRIO NORMAL'}
            </button>
            <span className="text-xs text-slate-400">
              {user?.role === 'SUPER_ADMIN' ? 'Modo de administração (vê todas empresas)' : 'Modo normal (vê apenas sua empresa)'}
            </span>
          </div>

          {user?.role === 'SUPER_ADMIN' && (
            <div className="mt-3 bg-gradient-to-r from-blue-900/20 to-blue-800/10 border-2 border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded">
                  SUPER ADMIN
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  Selecione a empresa para visualizar referências
                </span>
              </div>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full md:w-auto px-4 py-2 bg-slate-900 border-2 border-blue-500/30 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Todas as empresas</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {referralsError && (
            <div className="mt-3 px-4 py-2 bg-amber-900/20 border-l-4 border-amber-500 text-amber-200 rounded">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm">{referralsError}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadReferrals}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm"
                  >
                    Recarregar
                  </button>
                  <button
                    onClick={createSampleReferrals}
                    disabled={creatingSamples}
                    className={`px-3 py-1 ${creatingSamples ? 'bg-purple-400/60 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded text-sm flex items-center gap-2`}
                  >
                    {creatingSamples ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        Criando...
                      </>
                    ) : (
                      'Criar dados de exemplo'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {sampleMessage && (
            <div className="mt-3 px-4 py-2 bg-emerald-900/20 border-l-4 border-emerald-500 text-emerald-200 rounded">
              {sampleMessage}
            </div>
          )}

          <div className="mt-3 px-4 py-2 bg-slate-900/50 border-2 border-slate-700 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-slate-300">Modo local: Dados mock em memória</span>
              <span className="text-xs text-slate-500 ml-2">({filteredReferrals.length} referências)</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Referência
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Total de Referrals</p>
              <p className="text-2xl font-bold text-white mt-1">{filteredReferrals.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Valor Total Estimado</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalValue)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-white mt-1">{conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Comissões a Pagar</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalCommission)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Referrals */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/50 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-900 to-black">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-purple-400 uppercase tracking-widest border-b-2 border-purple-500/30">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-purple-400 uppercase tracking-widest border-b-2 border-purple-500/30">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-purple-400 uppercase tracking-widest border-b-2 border-purple-500/30">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-purple-400 uppercase tracking-widest border-b-2 border-purple-500/30">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-purple-400 uppercase tracking-widest border-b-2 border-purple-500/30">
                  Referenciador
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-purple-400 uppercase tracking-widest border-b-2 border-purple-500/30">
                  Data
                </th>
                <th className="px-6 py-4 text-right text-xs font-black text-purple-400 uppercase tracking-widest border-b-2 border-purple-500/30">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/20">
              {filteredReferrals.map((referral) => (
                <tr key={referral.id} className="hover:bg-purple-900/10 transition-colors border-b border-purple-500/10">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md mt-1">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold text-white">{referral.clientName}</div>
                        </div>
                        <div className="text-xs text-purple-300 mt-1">{referral.contactInfo}</div>
                        <div className="text-xs text-gray-400 mt-1">Fonte: {referral.referralSource}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getProjectTypeBadgeClass(referral.projectType)}`}>
                      {getProjectTypeLabel(referral.projectType)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(referral.status)}`}>
                      {getStatusLabel(referral.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">{formatCurrency(referral.estimatedValue)}</div>
                    {(referral.commission || 0) > 0 && (
                      <div className="text-xs text-orange-400 mt-1">
                        Comissão: {formatCurrency(referral.commission || 0)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs font-bold text-white">
                          {referral.referredBy.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-bold text-white">{referral.referredBy}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">{formatDate(referral.referralDate)}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.floor((new Date().getTime() - new Date(referral.referralDate).getTime()) / (1000 * 3600 * 24))} dias
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openViewModal(referral)}
                        className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                        title="Visualizar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => openEditModal(referral)}
                        className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {referral.status !== 'converted' && referral.status !== 'lost' && (
                        <button 
                          onClick={() => updateReferralStatus(referral.id, 'converted')}
                          className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md"
                          title="Marcar como Convertido"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReferrals.length === 0 && (
          <div className="text-center py-12 text-purple-500/70">
            <svg className="w-16 h-16 mx-auto mb-4 text-purple-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-bold text-purple-400">Nenhuma referência encontrada</p>
            <p className="text-sm mt-1">Clique em "Nova Referência" para começar</p>
          </div>
        )}
      </div>

      {/* Resumo */}
      {filteredReferrals.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-xl p-4">
            <h3 className="text-lg font-bold text-purple-400 mb-3">Distribuição por Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Novo</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {filteredReferrals.filter(r => r.status === 'new').length} referrals
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Contactado</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {filteredReferrals.filter(r => r.status === 'contacted').length} referrals
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Convertido</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {filteredReferrals.filter(r => r.status === 'converted').length} referrals
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Perdido</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {filteredReferrals.filter(r => r.status === 'lost').length} referrals
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 rounded-xl p-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">Distribuição por Tipo</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Transporte</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {filteredReferrals.filter(r => r.projectType === 'freight').length} referrals
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Logística</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {filteredReferrals.filter(r => r.projectType === 'logistics').length} referrals
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Armazenamento</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {filteredReferrals.filter(r => r.projectType === 'storage').length} referrals
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Alfândega</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {filteredReferrals.filter(r => r.projectType === 'customs').length} referrals
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criar Referral (mantido igual, mas sem chamadas API) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Nova Referência</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.role === 'SUPER_ADMIN' && (
                <div className="md:col-span-2 bg-gradient-to-r from-blue-900/20 to-blue-800/10 border-2 border-blue-500/30 rounded-lg p-4 mb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded">
                      SUPER ADMIN
                    </span>
                    <span className="text-sm text-slate-300 font-medium">
                      Selecione a empresa para criar a referência
                    </span>
                  </div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Empresa *
                  </label>
                  <select
                    required
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border-2 border-blue-500/30 rounded-lg text-white focus:border-blue-500 focus:outline-none"
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
                <label className="block text-sm font-bold text-slate-300 mb-2">Nome do Cliente *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Nome da empresa/contacto"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Contacto *</label>
                <input
                  type="text"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Email | Telefone"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Fonte da Referência</label>
                <input
                  type="text"
                  value={formData.referralSource}
                  onChange={(e) => setFormData({...formData, referralSource: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Cliente, Parceiro, Website"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Referral['status']})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="new">Novo</option>
                  <option value="contacted">Contactado</option>
                  <option value="converted">Convertido</option>
                  <option value="lost">Perdido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Tipo de Projeto</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value as Referral['projectType']})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="freight">Transporte</option>
                  <option value="logistics">Logística</option>
                  <option value="storage">Armazenamento</option>
                  <option value="customs">Alfândega</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Valor Estimado (€)</label>
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({...formData, estimatedValue: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Referenciador *</label>
                <input
                  type="text"
                  value={formData.referredBy}
                  onChange={(e) => setFormData({...formData, referredBy: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Nome da pessoa que referenciou"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Data da Referência</label>
                <input
                  type="date"
                  value={formData.referralDate}
                  onChange={(e) => setFormData({...formData, referralDate: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-300 mb-2">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  rows={3}
                  placeholder="Informações adicionais sobre a referência..."
                />
              </div>
              {formData.estimatedValue > 0 && (
                <div className="md:col-span-2 bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-2 border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Comissão Calculada</p>
                      <p className="text-xl font-bold text-orange-400">
                        {formatCurrency(calculateCommission(formData.estimatedValue))}
                      </p>
                    </div>
                    <div className="text-xs text-slate-400">(5% do valor estimado)</div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateReferral}
                disabled={creatingReferral}
                className={`flex-1 px-4 py-2 ${creatingReferral ? "bg-purple-400/60 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"} text-white rounded-lg transition-all font-bold`}
              >
                {creatingReferral ? (
                  <>
                    <svg className="w-4 h-4 animate-spin inline-block mr-2" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Criando...
                  </>
                ) : (
                  'Criar Referência'
                )}
              </button> 
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Referral */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Editar Referência</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Nome do Cliente *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Contacto *</label>
                <input
                  type="text"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Fonte da Referência</label>
                <input
                  type="text"
                  value={formData.referralSource}
                  onChange={(e) => setFormData({...formData, referralSource: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Referral['status']})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="new">Novo</option>
                  <option value="contacted">Contactado</option>
                  <option value="converted">Convertido</option>
                  <option value="lost">Perdido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Tipo de Projeto</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value as Referral['projectType']})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="freight">Transporte</option>
                  <option value="logistics">Logística</option>
                  <option value="storage">Armazenamento</option>
                  <option value="customs">Alfândega</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Valor Estimado (€)</label>
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({...formData, estimatedValue: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Referenciador *</label>
                <input
                  type="text"
                  value={formData.referredBy}
                  onChange={(e) => setFormData({...formData, referredBy: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Data da Referência</label>
                <input
                  type="date"
                  value={formData.referralDate}
                  onChange={(e) => setFormData({...formData, referralDate: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-300 mb-2">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  rows={3}
                />
              </div>
              {formData.estimatedValue > 0 && (
                <div className="md:col-span-2 bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-2 border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Comissão</p>
                      <input
                        type="number"
                        value={formData.commission}
                        onChange={(e) => setFormData({...formData, commission: parseFloat(e.target.value) || 0})}
                        className="w-48 px-4 py-2 bg-slate-900 border-2 border-orange-500/30 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                        placeholder="Valor da comissão"
                      />
                    </div>
                    <div className="text-xs text-slate-400">
                      Valor sugerido: {formatCurrency(calculateCommission(formData.estimatedValue))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleEditReferral}
                disabled={editingReferral}
                className={`flex-1 px-4 py-2 ${editingReferral ? "bg-purple-400/60 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"} text-white rounded-lg transition-all font-bold`}
              >
                {editingReferral ? (
                  <>
                    <svg className="w-4 h-4 animate-spin inline-block mr-2" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button> 
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedReferral(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualizar Referral */}
      {showViewModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-purple-400">Detalhes da Referência</h2>
              <button
                onClick={() => confirmDelete(selectedReferral.id)}
                className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
                title="Excluir referência"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Cliente</label>
                  <p className="text-white text-lg font-bold">{selectedReferral.clientName}</p>
                  <p className="text-purple-300 text-sm">{selectedReferral.contactInfo}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Referenciador</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">
                        {selectedReferral.referredBy.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-bold">{selectedReferral.referredBy}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Fonte</label>
                  <p className="text-white">{selectedReferral.referralSource}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Data da Referência</label>
                  <p className="text-white">{formatDate(selectedReferral.referralDate)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(selectedReferral.status)}`}>
                      {getStatusLabel(selectedReferral.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">Tipo</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getProjectTypeBadgeClass(selectedReferral.projectType)}`}>
                      {getProjectTypeLabel(selectedReferral.projectType)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Valor Estimado</label>
                  <p className="text-white text-xl font-bold">{formatCurrency(selectedReferral.estimatedValue)}</p>
                </div>
                {selectedReferral.commission && selectedReferral.commission > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">Comissão</label>
                    <p className="text-orange-400 text-xl font-bold">{formatCurrency(selectedReferral.commission)}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Dias desde a referência</label>
                  <p className="text-white">
                    {Math.floor((new Date().getTime() - new Date(selectedReferral.referralDate).getTime()) / (1000 * 3600 * 24))} dias
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-300 mb-1">Notas</label>
                <div className="bg-slate-900/50 border-2 border-purple-500/20 rounded-lg p-4">
                  <p className="text-white">{selectedReferral.notes || 'Sem notas adicionais'}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedReferral);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-bold"
              >
                Editar
              </button>
              {selectedReferral.status !== 'converted' && (
                <button
                  onClick={() => {
                    updateReferralStatus(selectedReferral.id, 'converted');
                    setShowViewModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-bold"
                >
                  Marcar como Convertido
                </button>
              )}
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedReferral(null);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-red-500/30 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-400">Confirmar Exclusão</h2>
                <p className="text-sm text-slate-300">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6">
              Tem certeza que deseja excluir esta referência? Todos os dados serão permanentemente removidos.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => referralToDelete && handleDeleteReferral(referralToDelete)}
                disabled={deletingReferralLoading}
                className={`flex-1 px-4 py-2 ${deletingReferralLoading ? "bg-red-400/60 cursor-not-allowed" : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"} text-white rounded-lg transition-all font-bold`}
              >
                {deletingReferralLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin inline-block mr-2" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </button> 
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setReferralToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;