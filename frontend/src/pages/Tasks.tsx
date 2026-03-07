import React, { useState, useEffect } from 'react';
import api from '../api/api';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔧 FUNÇÃO PARA EXTRAIR MENSAGEM DE ERRO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  assignedTo?: string;
  createdAt: string;
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

const Tasks: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [tasksError, setTasksError] = useState<string>('');
  const [taskMessage, setTaskMessage] = useState<string>('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Task['priority'],
    dueDate: '',
    assignedTo: '',
  });

  const [savingTask, setSavingTask] = useState<boolean>(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadTasks();
      if (user.role === 'SUPER_ADMIN') {
        loadCompanies();
      }
    }
  }, [user, selectedCompanyId]);

  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      console.log('👤 Usuário carregado:', response.data);
    } catch (error: any) {
      console.error('Erro ao carregar usuário:', error);
      setTasksError(extractErrorMessage(error, 'Erro ao carregar dados do usuário'));
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      setTasksError('');
      setTaskMessage('');

      const params = new URLSearchParams();
      if (user?.role === 'SUPER_ADMIN' && selectedCompanyId) {
        params.set('companyId', selectedCompanyId);
      }

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
      console.log('✅ Tarefas carregadas:', response.data.length);
      
    } catch (err: any) {
      console.error('Erro ao carregar tarefas:', err);
      setTasksError(extractErrorMessage(err, 'Erro ao carregar tarefas'));
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleCreateTask = async () => {
    if (!formData.title || !formData.description || !formData.dueDate) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    if (user?.role === 'SUPER_ADMIN' && !selectedCompanyId) {
      alert('Por favor, selecione uma empresa primeiro.');
      return;
    }

    const dataToSend = {
      ...formData,
      companyId: user?.role === 'SUPER_ADMIN' ? selectedCompanyId : undefined,
    };

    try {
      setSavingTask(true);
      await api.post('/tasks', dataToSend);
      setTaskMessage('Tarefa criada com sucesso!');
      await loadTasks();
      setShowCreateModal(false);
      resetForm();
      setTimeout(() => setTaskMessage(''), 5000);
    } catch (err: any) {
      console.error('Erro ao criar tarefa:', err);
      setTasksError(extractErrorMessage(err, 'Erro ao criar tarefa'));
    } finally {
      setSavingTask(false);
    }
  };

  const handleEditTask = async () => {
    if (!formData.title || !formData.description || !formData.dueDate) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    if (selectedTask) {
      try {
        setSavingTask(true);
        await api.patch(`/tasks/${selectedTask.id}`, formData);
        setTaskMessage('Tarefa atualizada com sucesso!');
        await loadTasks();
        setShowEditModal(false);
        setSelectedTask(null);
        resetForm();
        setTimeout(() => setTaskMessage(''), 5000);
      } catch (err: any) {
        console.error('Erro ao atualizar tarefa:', err);
        setTasksError(extractErrorMessage(err, 'Erro ao atualizar tarefa'));
      } finally {
        setSavingTask(false);
      }
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTaskMessage('Status da tarefa atualizado!');
      await loadTasks();
      setTimeout(() => setTaskMessage(''), 3000);
    } catch (err: any) {
      console.error('Erro ao alterar status da tarefa:', err);
      setTasksError(extractErrorMessage(err, 'Erro ao atualizar status'));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setDeletingTaskId(taskId);
      await api.delete(`/tasks/${taskId}`);
      setTaskMessage('Tarefa excluída com sucesso!');
      await loadTasks();
      setTimeout(() => setTaskMessage(''), 4000);
    } catch (err: any) {
      console.error('Erro ao excluir tarefa:', err);
      setTasksError(extractErrorMessage(err, 'Erro ao excluir tarefa'));
    } finally {
      setDeletingTaskId(null);
      setShowViewModal(false);
      setShowDeleteConfirm(false);
      setSelectedTask(null);
      setTaskToDelete(null);
    }
  };

  const confirmDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirm(true);
    setShowViewModal(false);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
      assignedTo: task.assignedTo || '',
    });
    setShowEditModal(true);
  };

  const openViewModal = (task: Task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      assignedTo: '',
    });
  };

  const getTaskStatusBadgeClass = (status: Task['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-2 border-amber-500 text-amber-300';
      case 'IN_PROGRESS':
        return 'bg-gradient-to-r from-blue-900/30 to-blue-800/20 border-2 border-blue-500 text-blue-300';
      case 'COMPLETED':
        return 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border-2 border-emerald-500 text-emerald-300';
      case 'CANCELLED':
        return 'bg-gradient-to-r from-red-900/30 to-red-800/20 border-2 border-red-500 text-red-300';
      default:
        return 'bg-gray-800 border-gray-600 text-gray-300';
    }
  };

  const getPriorityBadgeClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-gradient-to-r from-red-900/30 to-red-800/20 border-2 border-red-500 text-red-300';
      case 'HIGH':
        return 'bg-gradient-to-r from-orange-900/30 to-orange-800/20 border-2 border-orange-500 text-orange-300';
      case 'MEDIUM':
        return 'bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-2 border-amber-500 text-amber-300';
      case 'LOW':
        return 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border-2 border-emerald-500 text-emerald-300';
      default:
        return 'bg-gray-800 border-gray-600 text-gray-300';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    const labels = {
      URGENT: 'Urgente',
      HIGH: 'Alta',
      MEDIUM: 'Média',
      LOW: 'Baixa'
    };
    return labels[priority];
  };

  const getStatusLabel = (status: Task['status']) => {
    const labels = {
      PENDING: 'Pendente',
      IN_PROGRESS: 'Em Progresso',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado'
    };
    return labels[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  if (loadingTasks) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    if (user?.role === 'SUPER_ADMIN') {
      return !selectedCompanyId || task.companyId === selectedCompanyId;
    } else {
      return task.companyId === user?.companyId;
    }
  });

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tarefas</h1>
          <p className="text-sm text-slate-300 mt-1">Gestão de tarefas e atividades</p>

          {user?.role === 'SUPER_ADMIN' && (
            <div className="mt-3 bg-gradient-to-r from-blue-900/20 to-blue-800/10 border-2 border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded">
                  SUPER ADMIN
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  Selecione a empresa para visualizar tarefas
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

          {tasksError && (
            <div className="mt-3 px-4 py-2 bg-red-900/20 border-l-4 border-red-500 text-red-200 rounded">
              {tasksError}
            </div>
          )}

          {taskMessage && (
            <div className="mt-3 px-4 py-2 bg-emerald-900/20 border-l-4 border-emerald-500 text-emerald-200 rounded">
              {taskMessage}
            </div>
          )}
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Tarefa
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Total de Tarefas</p>
              <p className="text-2xl font-bold text-white mt-1">{filteredTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Em Progresso</p>
              <p className="text-2xl font-bold text-white mt-1">
                {filteredTasks.filter(t => t.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Concluídas</p>
              <p className="text-2xl font-bold text-white mt-1">
                {filteredTasks.filter(t => t.status === 'COMPLETED').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Urgentes</p>
              <p className="text-2xl font-bold text-white mt-1">
                {filteredTasks.filter(t => t.priority === 'URGENT').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Tarefas */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg overflow-hidden border-2 border-amber-500/30 hover:border-amber-500/50 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-900 to-black">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Tarefa
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Prioridade
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Status
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Prazo
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Responsável
                </th>
                <th className="px-8 py-4 text-right text-xs font-black text-amber-400 uppercase tracking-widest border-b-2 border-amber-500/30">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/20">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-amber-900/10 transition-colors border-b border-amber-500/10">
                  <td className="px-8 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md mt-1">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold text-white">{task.title}</div>
                        </div>
                        <div className="text-xs text-amber-300 mt-1">{task.description}</div>
                        <div className="text-xs text-gray-400 mt-1">Criada: {formatDate(task.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadgeClass(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTaskStatusBadgeClass(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="text-sm font-bold text-white">{formatDate(task.dueDate)}</div>
                    <div className={`text-xs ${new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' ? 'text-red-400' : 'text-gray-400'}`}>
                      {new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' ? 'Atrasada' : 'No prazo'}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs font-bold text-white">
                          {task.assignedTo?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-bold text-white">{task.assignedTo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openViewModal(task)}
                        className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                        title="Visualizar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => openEditModal(task)}
                        className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleCompleteTask(task.id)}
                        className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md"
                        title={task.status === 'COMPLETED' ? 'Reabrir' : 'Concluir'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-amber-500/70">
            <svg className="w-16 h-16 mx-auto mb-4 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-bold text-amber-400">Nenhuma tarefa encontrada</p>
            <p className="text-sm mt-1">Clique em "Nova Tarefa" para começar</p>
          </div>
        )}
      </div>

      {/* Modal de Criar Tarefa */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/30 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Nova Tarefa</h2>
            {user?.role === 'SUPER_ADMIN' && (
              <div className="mb-4 bg-gradient-to-r from-blue-900/20 to-blue-800/10 border-2 border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded">
                    SUPER ADMIN
                  </span>
                  <span className="text-sm text-slate-300 font-medium">
                    Selecione a empresa para criar a tarefa
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  placeholder="Digite o título da tarefa"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Descrição *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  rows={3}
                  placeholder="Digite a descrição da tarefa"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Prioridade *</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as Task['priority']})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Prazo *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Responsável</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateTask}
                disabled={savingTask}
                className={`flex-1 px-4 py-2 ${savingTask ? 'bg-amber-400/60 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'} text-white rounded-lg transition-all font-bold`}
              >
                {savingTask ? 'Criando...' : 'Criar Tarefa'}
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

      {/* Modal de Editar Tarefa */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/30 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Editar Tarefa</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Descrição *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Prioridade *</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as Task['priority']})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Prazo *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Responsável</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleEditTask}
                disabled={savingTask}
                className={`flex-1 px-4 py-2 ${savingTask ? 'bg-amber-400/60 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'} text-white rounded-lg transition-all font-bold`}
              >
                {savingTask ? 'Atualizando...' : 'Salvar Alterações'}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTask(null);
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

      {/* Modal de Visualizar Tarefa */}
      {showViewModal && selectedTask && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/30 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-amber-400">Detalhes da Tarefa</h2>
              <button
                onClick={() => confirmDelete(selectedTask.id)}
                className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
                title="Excluir tarefa"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Título</label>
                <p className="text-white">{selectedTask.title}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Descrição</label>
                <p className="text-white">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getTaskStatusBadgeClass(selectedTask.status)}`}>
                    {getStatusLabel(selectedTask.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Prioridade</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadgeClass(selectedTask.priority)}`}>
                    {getPriorityLabel(selectedTask.priority)}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Prazo</label>
                <p className="text-white">{formatDate(selectedTask.dueDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Responsável</label>
                <p className="text-white">{selectedTask.assignedTo || 'Não atribuído'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Criada em</label>
                <p className="text-white">{formatDate(selectedTask.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedTask);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-bold"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedTask(null);
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
              Tem certeza que deseja excluir esta tarefa?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => taskToDelete && handleDeleteTask(taskToDelete)}
                disabled={!!deletingTaskId}
                className={`flex-1 px-4 py-2 ${deletingTaskId ? 'bg-red-400/60 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'} text-white rounded-lg transition-all font-bold`}
              >
                {deletingTaskId ? 'Excluindo...' : 'Excluir'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setTaskToDelete(null);
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

export default Tasks;