import React, { useEffect, useState } from 'react';

interface HistoryEntry {
  id: number;
  previousState: string;
  newState: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  comments?: string;
  location?: string;
}

interface ProductHistoryProps {
  productId: number;
}

export const ProductHistory: React.FC<ProductHistoryProps> = ({ productId }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [productId]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando histórico...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Histórico de Movimentações</h3>
      
      {history.length === 0 ? (
        <p className="text-gray-500">Nenhuma movimentação registrada</p>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {entry.previousState} → {entry.newState}
                  </p>
                  <p className="text-sm text-gray-600">
                    Por: {entry.user.name}
                  </p>
                  {entry.comments && (
                    <p className="text-sm text-gray-700 mt-1">
                      {entry.comments}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(entry.createdAt).toLocaleString('pt-PT')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};