import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationPanel from './NotificationPanel';
import { theme } from '../theme.config';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAvatarUrl = () => {
    if (user?.avatarUrl) {
      return `${process.env.REACT_APP_API_URL}${user.avatarUrl}`;
    }
    return null;
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'SUPER_ADMIN':
        return 'Super Administrador';
      case 'ADMIN':
        return 'Administrador';
      case 'OPERATOR':
        return 'Operador';
      default:
        return role;
    }
  };

  // Funções do calendário
  const getMesesPortugues = () => [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDiasCalendario = (mes: Date) => {
    const primeiroDia = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const ultimoDia = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay();
    
    const dias = [];
    
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }
    
    for (let dia = 1; dia <= diasNoMes; dia++) {
      dias.push(new Date(mes.getFullYear(), mes.getMonth(), dia));
    }
    
    return dias;
  };

  const mesmosDias = (data1: Date, data2: Date) => {
    return data1.getDate() === data2.getDate() &&
           data1.getMonth() === data2.getMonth() &&
           data1.getFullYear() === data2.getFullYear();
  };

  const mudarMes = (direcao: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direcao, 1));
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    console.log('Data selecionada:', date.toLocaleDateString('pt-PT'));
  };

  return (
    <header className={`${theme.backgrounds.header} sticky top-0 z-50`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/logo.png"
                alt="LogiSphere Logo" 
                className="h-20 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-1">
            <NotificationPanel />

            {/* Calendário */}
            <div className="relative">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className={`${theme.buttons.icon} relative`}
                title="Calendário"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              {showCalendar && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowCalendar(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-xl border-2 border-[#334155]/50 z-20 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white p-4">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            mudarMes(-1);
                          }}
                          className="p-1 hover:bg-[#2563eb] rounded transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h3 className="text-lg font-semibold">
                          {getMesesPortugues()[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            mudarMes(1);
                          }}
                          className="p-1 hover:bg-[#2563eb] rounded transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-blue-100">
                        Data selecionada: {selectedDate.toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                          <div key={dia} className="h-8 flex items-center justify-center text-xs font-semibold text-[#64748b]">
                            {dia}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {getDiasCalendario(currentMonth).map((dia, index) => {
                          if (!dia) {
                            return <div key={`empty-${index}`} className="h-10"></div>;
                          }
                          
                          const hoje = new Date();
                          const ehHoje = mesmosDias(dia, hoje);
                          const ehSelecionado = mesmosDias(dia, selectedDate);
                          const ehMesAtual = dia.getMonth() === currentMonth.getMonth();
                          
                          return (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectDate(dia);
                              }}
                              disabled={!ehMesAtual}
                              className={`h-10 flex items-center justify-center text-sm rounded-lg transition-all ${
                                ehSelecionado
                                  ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-bold shadow-lg scale-105'
                                  : ehHoje
                                  ? 'bg-[#3b82f6]/20 text-[#3b82f6] font-semibold border border-[#3b82f6]/30'
                                  : ehMesAtual
                                  ? 'text-[#cbd5e1] hover:bg-[#1e293b] hover:scale-105 hover:border hover:border-[#334155]'
                                  : 'text-[#334155] cursor-not-allowed'
                              }`}
                            >
                              {dia.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-[#0f172a] px-4 py-3 border-t border-[#334155] flex justify-between items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const hoje = new Date();
                          setCurrentMonth(hoje);
                          setSelectedDate(hoje);
                          setShowCalendar(false);
                        }}
                        className="text-xs text-[#3b82f6] hover:text-[#2563eb] font-medium"
                      >
                        Hoje
                      </button>
                      <p className="text-xs text-[#64748b]">
                        Sistema de Gestão Logística
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-1 pl-1 ml-0 border-l border-[#334155]">
                <div className="hidden md:block text-right min-w-[90px] mr-1">
                  <p className="text-sm font-semibold text-[#cbd5e1] truncate">{user.name}</p>
                  <p className="text-xs text-[#64748b] whitespace-nowrap">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-1">
                    <div className={`${theme.icons.avatar} ring-2 ring-[#334155] overflow-hidden`}>
                      {getAvatarUrl() ? (
                        <img 
                          src={getAvatarUrl()!} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-[#64748b] hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-xl border-2 border-[#334155]/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-[#334155]">
                      <p className="text-sm font-semibold text-[#cbd5e1]">{user.name}</p>
                      <p className="text-xs text-[#64748b]">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="w-full text-left px-4 py-2 text-sm text-[#cbd5e1] hover:bg-[#1e293b] flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Perfil</span>
                      </Link>
                      <Link
                        to="/configuracoes"
                        className="w-full text-left px-4 py-2 text-sm text-[#cbd5e1] hover:bg-[#1e293b] flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Configurações</span>
                      </Link>
                    </div>
                    <div className="border-t border-[#334155] py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;