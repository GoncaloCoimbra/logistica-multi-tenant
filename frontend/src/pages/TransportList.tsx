import React, { useState, useEffect } from 'react';
import api from '../api/api';

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
}

interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  brand: string;
  status: string;
}

const TransportList: React.FC = () => {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    vehicleId: '',
    origin: '',
    destination: '',
    departureDate: '',
    estimatedArrival: '',
    totalWeight: 0,
    notes: '',
    status: 'PENDING' as 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED',
  });

  useEffect(() => {
    loadTransports();
    loadVehicles();
  }, []);

  const loadTransports = async () => {
    try {
      setError('');
      const response = await api.get('/transports');
      setTransports(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar transportes:', error);
      setError(error.response?.data?.error || 'Erro ao carregar transportes');
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      // Filtrar apenas veículos disponíveis
      const availableVehicles = response.data.filter((v: Vehicle) => v.status === 'available');
      setVehicles(availableVehicles);
    } catch (error: any) {
      console.error('Erro ao carregar veículos:', error);
      setError(error.response?.data?.error || 'Erro ao carregar veículos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validação básica
      if (!formData.origin || !formData.destination || !formData.departureDate) {
        setError('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Preparar dados para enviar
      const dataToSend = {
        ...formData,
        totalWeight: parseFloat(formData.totalWeight.toString()) || 0,
      };

      console.log('Enviando dados:', dataToSend);

      if (editingId) {
        await api.put(`/transports/${editingId}`, dataToSend);
      } else {
        await api.post('/transports', dataToSend);
      }
      
      await loadTransports();
      await loadVehicles();
      resetForm();
    } catch (error: any) {
      console.error('Erro ao guardar transporte:', error);
      setError(error.response?.data?.error || 'Erro ao guardar transporte');
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
      status: transport.status,
    });
    setEditingId(transport.id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este transporte?')) {
      try {
        setError('');
        await api.delete(`/transports/${id}`);
        await loadTransports();
        await loadVehicles();
      } catch (error: any) {
        console.error('Erro ao excluir transporte:', error);
        setError(error.response?.data?.error || 'Erro ao excluir transporte');
      }
    }
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
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'Pendente',
      'IN_TRANSIT': 'Em Trânsito',
      'DELIVERED': 'Entregue',
      'CANCELLED': 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_TRANSIT': 'bg-blue-100 text-blue-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transportes</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Novo Transporte'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Editar Transporte' : 'Novo Transporte'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Veículo *</label>
              <select
                required
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
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
              <label className="block text-sm font-medium mb-1">Peso Total (kg) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.totalWeight}
                onChange={(e) => setFormData({ ...formData, totalWeight: parseFloat(e.target.value) || 0 })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Origem *</label>
              <input
                type="text"
                required
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Cidade/Local de origem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Destino *</label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Cidade/Local de destino"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Partida *</label>
              <input
                type="date"
                required
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chegada Estimada *</label>
              <input
                type="date"
                required
                value={formData.estimatedArrival}
                onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="PENDING">Pendente</option>
                <option value="IN_TRANSIT">Em Trânsito</option>
                <option value="DELIVERED">Entregue</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Observações</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                placeholder="Informações adicionais sobre o transporte..."
              />
            </div>
            <div className="col-span-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veículo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chegada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transports.map((transport) => (
              <tr key={transport.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{transport.vehicle?.licensePlate || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{transport.vehicle?.model || ''}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div>{transport.origin}</div>
                    <div className="text-gray-500">→ {transport.destination}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatDate(transport.departureDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatDate(transport.estimatedArrival)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {transport.totalWeight} kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(transport.status)}`}>
                    {getStatusLabel(transport.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleEdit(transport)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(transport.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum transporte cadastrado
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportList;