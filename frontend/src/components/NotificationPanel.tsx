import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  entityType: 'product' | 'transport' | 'vehicle';
  entityId: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read?: boolean;
}

interface NotificationResponse {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  notifications: Notification[];
}

const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    
    const interval = setInterval(() => {
      loadNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MARCAR NOTIFICAÇÃO COMO LIDA
  const markAsRead = async (notificationId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      
      // Atualizar estado local
      if (notifications) {
        const updatedNotifications = notifications.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        setNotifications({
          ...notifications,
          notifications: updatedNotifications,
          total: updatedNotifications.filter(n => !n.read).length
        });
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  // ✅ LIMPAR TODAS AS NOTIFICAÇÕES
  const clearAllNotifications = async () => {
    if (!window.confirm('Deseja limpar todas as notificações?')) {
      return;
    }

    try {
      await api.delete('/notifications/all');
      setNotifications({
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        notifications: []
      });
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  };

  // ✅ MARCAR TODAS COMO LIDAS
  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      
      if (notifications) {
        const updatedNotifications = notifications.notifications.map(n => ({ ...n, read: true }));
        setNotifications({
          ...notifications,
          notifications: updatedNotifications,
          total: 0
        });
      }
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.entityType === 'product') {
      navigate(`/produtos/${notification.entityId}`);
    } else if (notification.entityType === 'transport') {
      navigate(`/transportes`);
    } else if (notification.entityType === 'vehicle') {
      navigate(`/veiculos`);
    }
    setIsOpen(false);
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <div className="bg-red-100 rounded-lg p-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="bg-yellow-100 rounded-lg p-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="bg-blue-100 rounded-lg p-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-green-100 rounded-lg p-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getPriorityColor = (priority: string, read: boolean) => {
    const opacity = read ? 'opacity-50' : '';
    switch (priority) {
      case 'critical':
        return `border-l-4 border-red-500 ${read ? 'bg-red-25' : 'bg-red-50'} ${opacity}`;
      case 'high':
        return `border-l-4 border-orange-500 ${read ? 'bg-orange-25' : 'bg-orange-50'} ${opacity}`;
      case 'medium':
        return `border-l-4 border-yellow-500 ${read ? 'bg-yellow-25' : 'bg-yellow-50'} ${opacity}`;
      default:
        return `border-l-4 border-blue-500 ${read ? 'bg-blue-25' : 'bg-blue-50'} ${opacity}`;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `há ${diffHours}h`;
    } else if (diffMins > 0) {
      return `há ${diffMins}min`;
    } else {
      return 'agora';
    }
  };

  const unreadCount = notifications?.notifications.filter(n => !n.read).length || 0;
  const criticalCount = notifications?.critical || 0;

  return (
    <div className="relative">
      {/* Botão sino */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full ${
            criticalCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
          }`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">Notificações</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {notifications && (
                <div className="flex gap-2 text-xs flex-wrap">
                  {criticalCount > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                      {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
                    </span>
                  )}
                  {notifications.high > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                      {notifications.high} importante{notifications.high > 1 ? 's' : ''}
                    </span>
                  )}
                  {notifications.medium > 0 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                      {notifications.medium} média{notifications.medium > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}

              {/* Botões de ação */}
              {notifications && notifications.notifications.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={markAllAsRead}
                    className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    Marcar todas como lidas
                  </button>
                  <button
                    onClick={clearAllNotifications}
                    className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                  >
                    Limpar todas
                  </button>
                </div>
              )}
            </div>

            {/* Lista de notificações */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : !notifications || notifications.notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 font-medium">Sem notificações!</p>
                  <p className="text-sm text-gray-400 mt-1">Tudo está a correr bem</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${getPriorityColor(notification.priority, notification.read || false)}`}
                    >
                      <div className="flex gap-3" onClick={() => handleNotificationClick(notification)}>
                        <div className="flex-shrink-0">
                          {getIconByType(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`text-sm font-semibold line-clamp-1 ${notification.read ? 'text-gray-500' : 'text-gray-900'}`}>
                              {notification.title}
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                              )}
                            </p>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {getTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <p className={`text-sm line-clamp-2 ${notification.read ? 'text-gray-400' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          
                          {notification.priority === 'critical' && !notification.read && (
                            <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              CRÍTICO
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Botão marcar como lida individual */}
                      {!notification.read && (
                        <button
                          onClick={(e) => markAsRead(notification.id, e)}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Marcar como lida"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications && notifications.notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    navigate('/produtos');
                    setIsOpen(false);
                  }}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium text-center"
                >
                  Ver todos os produtos →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;