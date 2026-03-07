import React, { useState, useEffect } from 'react';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface CompanyUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
}

const CompanyUsersModal: React.FC<CompanyUsersModalProps> = ({
  isOpen,
  onClose,
  companyId,
  companyName,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompanyUsers();
    }
  }, [isOpen, companyId]);

  const fetchCompanyUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/companies/${companyId}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/companies/${companyId}/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do usuário');
      }

      // Atualizar lista local
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: !currentStatus } : user
      ));
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar usuário');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este usuário da empresa?')) {
      return;
    }

    try {
      const response = await fetch(`/api/companies/${companyId}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao remover usuário');
      }

      setUsers(users.filter(user => user.id !== userId));
    } catch (err: any) {
      setError(err.message || 'Erro ao remover usuário');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Usuários da Empresa</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="company-info">
            <strong>Empresa:</strong> {companyName}
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Papel</th>
                    <th>Status</th>
                    <th>Cadastrado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="no-data">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className={`btn-toggle ${user.isActive ? 'btn-deactivate' : 'btn-activate'}`}
                              onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                              title={user.isActive ? 'Desativar' : 'Ativar'}
                            >
                              {user.isActive ? '🔒' : '🔓'}
                            </button>
                            <button
                              className="btn-remove"
                              onClick={() => handleRemoveUser(user.id)}
                              title="Remover da empresa"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyUsersModal;