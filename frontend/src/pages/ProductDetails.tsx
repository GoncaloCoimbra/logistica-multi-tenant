import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

interface Product {
  id: string;
  internalCode: string;
  description: string;
  quantity: number;
  unit: string;
  status: string;
  totalWeight?: number;
  totalVolume?: number;
  supplier?: {
    id: string;
    name: string;
    nif: string;
  };
  currentLocation?: string;
  observations?: string;
  receivedAt: string;
  lastMovedAt: string;
  movements?: Movement[];
}

interface Movement {
  id: string;
  previousStatus: string | null;
  newStatus: string;
  quantity: number;
  location?: string;
  reason?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface NextState {
  currentStatus: string;
  nextPossibleStates: string[];
  isFinalState: boolean;
}

const STATUS_TRANSLATIONS: { [key: string]: string } = {
  'RECEIVED': 'Recebido',
  'IN_ANALYSIS': 'Em Análise',
  'REJECTED': 'Rejeitado',
  'APPROVED': 'Aprovado',
  'IN_STORAGE': 'Em Armazenamento',
  'IN_PREPARATION': 'Em Preparação',
  'IN_SHIPPING': 'Em Expedição',
  'DELIVERED': 'Entregue',
  'IN_RETURN': 'Em Devolução',
  'ELIMINATED': 'Eliminado',
  'CANCELLED': 'Cancelado'
};

const STATUS_COLORS: { [key: string]: string } = {
  'RECEIVED': 'bg-blue-100 text-blue-800',
  'IN_ANALYSIS': 'bg-yellow-100 text-yellow-800',
  'REJECTED': 'bg-red-100 text-red-800',
  'APPROVED': 'bg-green-100 text-green-800',
  'IN_STORAGE': 'bg-purple-100 text-purple-800',
  'IN_PREPARATION': 'bg-orange-100 text-orange-800',
  'IN_SHIPPING': 'bg-indigo-100 text-indigo-800',
  'DELIVERED': 'bg-green-200 text-green-900',
  'IN_RETURN': 'bg-gray-100 text-gray-800',
  'ELIMINATED': 'bg-black text-white',
  'CANCELLED': 'bg-red-200 text-red-900'
};

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [nextStates, setNextStates] = useState<NextState | null>(null);
  const [loading, setLoading] = useState(true);

  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState('');
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [changingStatus, setChangingStatus] = useState(false);

  useEffect(() => {
    loadProduct();
    loadNextStates();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLocation(response.data.currentLocation || '');
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNextStates = async () => {
    try {
      const response = await api.get(`/products/${id}/next-states`);
      setNextStates(response.data);
    } catch (error) {
      console.error('Erro ao carregar próximos estados:', error);
    }
  };

  const handleChangeStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNewStatus) {
      alert('Selecione um novo estado');
      return;
    }

    setChangingStatus(true);

    try {
      await api.post(`/products/${id}/change-status`, {
        newStatus: selectedNewStatus,
        reason: reason.trim() || undefined,
        location: location.trim() || undefined
      });

      alert('Estado alterado com sucesso!');
      setShowChangeStatus(false);
      setSelectedNewStatus('');
      setReason('');
      
      
      await loadProduct();
      await loadNextStates();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Erro ao alterar estado';
      alert(errorMsg);
    } finally {
      setChangingStatus(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-600">A carregar detalhes...</div>;
  }

  if (!product) {
    return <div className="p-8 text-red-600">Produto não encontrado.</div>;
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
      >
        ← Voltar
      </button>

      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.description}</h2>
            <p className="text-gray-600">Código: {product.internalCode}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold ${STATUS_COLORS[product.status]}`}>
            {STATUS_TRANSLATIONS[product.status] || product.status}
          </span>
        </div>
      </div>

      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Informações do Produto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Quantidade</p>
            <p className="font-medium">{product.quantity} {product.unit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fornecedor</p>
            <p className="font-medium">{product.supplier?.name || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Localização Atual</p>
            <p className="font-medium">{product.currentLocation || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Peso Total</p>
            <p className="font-medium">{product.totalWeight ? `${product.totalWeight} kg` : '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Volume Total</p>
            <p className="font-medium">{product.totalVolume ? `${product.totalVolume} m³` : '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Data de Receção</p>
            <p className="font-medium">{new Date(product.receivedAt).toLocaleDateString('pt-PT')}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Observações</p>
            <p className="font-medium">{product.observations || '—'}</p>
          </div>
        </div>
      </div>

      
      {nextStates && !nextStates.isFinalState && nextStates.nextPossibleStates.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Alterar Estado</h3>
          
          {!showChangeStatus ? (
            <button
              onClick={() => setShowChangeStatus(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Mudar Estado do Produto
            </button>
          ) : (
            <form onSubmit={handleChangeStatus}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Novo Estado <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedNewStatus}
                  onChange={(e) => setSelectedNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Selecione...</option>
                  {nextStates.nextPossibleStates.map(state => (
                    <option key={state} value={state}>
                      {STATUS_TRANSLATIONS[state] || state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Ex: Corredor A, Prateleira 3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Motivo/Comentário
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                  placeholder="Descreva o motivo da mudança (obrigatório para rejeições)..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={changingStatus || !selectedNewStatus}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {changingStatus ? 'Alterando...' : 'Confirmar Mudança'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangeStatus(false);
                    setSelectedNewStatus('');
                    setReason('');
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Histórico de Movimentações</h3>
        
        {!product.movements || product.movements.length === 0 ? (
          <p className="text-gray-500">Nenhuma movimentação registrada</p>
        ) : (
          <div className="space-y-4">
            {product.movements.map((movement) => (
              <div key={movement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {movement.previousStatus 
                        ? `${STATUS_TRANSLATIONS[movement.previousStatus]} → ` 
                        : ''}
                      <span className="text-blue-600">
                        {STATUS_TRANSLATIONS[movement.newStatus]}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Por: {movement.user.name} ({movement.user.email})
                    </p>
                    {movement.location && (
                      <p className="text-sm text-gray-600">
                        Localização: {movement.location}
                      </p>
                    )}
                    {movement.reason && (
                      <p className="text-sm text-gray-700 mt-1 italic">
                        "{movement.reason}"
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(movement.createdAt).toLocaleString('pt-PT')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;