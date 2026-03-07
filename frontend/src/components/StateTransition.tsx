import React, { useState } from 'react';
import { theme } from '../theme.config';

interface StateTransitionProps {
  currentState: string;
  productId: number;
  onStateChanged: () => void;
}

const stateTransitions: { [key: string]: string[] } = {
  'Recebido': ['Em análise'],
  'Em análise': ['Aprovado', 'Rejeitado'],
  'Rejeitado': ['Em devolução'],
  'Aprovado': ['Em armazenamento'],
  'Em armazenamento': ['Em preparação', 'Em expedição'],
  'Em preparação': ['Em expedição', 'Cancelado'],
  'Em expedição': ['Entregue'],
  'Entregue': [],
  'Em devolução': ['Recebido', 'Eliminado'],
  'Eliminado': [],
  'Cancelado': ['Em armazenamento']
};

export const StateTransition: React.FC<StateTransitionProps> = ({
  currentState,
  productId,
  onStateChanged
}) => {
  const [newState, setNewState] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const availableStates = stateTransitions[currentState] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}/change-state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          newState,
          comments
        })
      });

      if (response.ok) {
        alert('Estado alterado com sucesso!');
        setComments('');
        setNewState('');
        onStateChanged();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (error) {
      alert('Erro ao alterar estado');
    } finally {
      setLoading(false);
    }
  };

  if (availableStates.length === 0) {
    return (
      <div className="bg-[#1e293b]/80 p-4 rounded">
        <p className="text-slate-300">Estado final - sem transições disponíveis</p>
      </div>
    );
  }

  return (
    <div className={`${theme.cards.form} p-6 rounded-lg shadow`}> 
      <h3 className="text-lg font-semibold mb-4 text-white">Alterar Estado</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Novo Estado
          </label>
          <select
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            className={theme.inputs.base}
            required
          >
            <option value="">Selecione...</option>
            {availableStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Comentários/Motivo
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className={theme.inputs.base}
            rows={3}
            placeholder="Descreva o motivo da mudança..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !newState}
          className={theme.buttons.primary + " disabled:opacity-50"}
        >
          {loading ? 'Alterando...' : 'Confirmar Mudança'}
        </button>
      </form>
    </div>
  );
};