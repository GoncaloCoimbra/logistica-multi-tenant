export const theme = {
  colors: {
    // Cor primária (tons de azul navy)
    primary: {
      50: 'bg-[#e8eef5]',
      100: 'bg-[#c5d4e6]',
      500: 'bg-[#3b82f6]',
      600: 'bg-[#2563eb]',
      700: 'bg-[#1d4ed8]',
      text: 'text-[#3b82f6]',
      textDark: 'text-[#1d4ed8]',
      border: 'border-[#3b82f6]',
      ring: 'ring-[#3b82f6]',
    },
    
    // Cor secundária (tons escuros navy)
    secondary: {
      50: 'bg-[#f1f5f9]',
      100: 'bg-[#cbd5e1]',
      500: 'bg-[#1e293b]',
      600: 'bg-[#0f172a]',
      700: 'bg-[#020617]',
      text: 'text-[#cbd5e1]',
      border: 'border-[#1e293b]',
    },
    
    // Cores de estado
    success: {
      bg: 'bg-emerald-900/30',
      text: 'text-emerald-400',
      border: 'border-emerald-500/50',
    },
    
    warning: {
      bg: 'bg-amber-900/30',
      text: 'text-amber-400',
      border: 'border-amber-500/50',
    },
    
    error: {
      bg: 'bg-red-900/30',
      text: 'text-red-400',
      border: 'border-red-500/50',
    },
    
    info: {
      bg: 'bg-[#1e293b]/50',
      text: 'text-[#cbd5e1]',
    },
  },

  
  //  BOTÕES
  
  buttons: {
    primary: 'px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-lg hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all font-bold shadow-lg hover:shadow-xl',
    secondary: 'px-6 py-3 bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white rounded-lg hover:from-[#0f172a] hover:to-[#020617] transition-all font-bold shadow-lg hover:shadow-xl border border-[#1e293b]',
    success: 'px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all font-bold shadow-lg',
    danger: 'px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-bold shadow-lg',
    outline: 'px-6 py-3 border-2 border-[#3b82f6]/50 text-[#3b82f6] rounded-lg hover:bg-[#3b82f6]/10 transition-all font-bold hover:border-[#3b82f6]',
    icon: 'p-2 hover:bg-[#3b82f6]/20 rounded-lg transition-colors text-[#3b82f6] hover:text-[#2563eb]',
  },

  
  //  INPUTS E FORMS
  
  inputs: {
    base: 'w-full px-4 py-3 bg-[#0f172a] border-2 border-[#1e293b] text-white rounded-lg focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all placeholder-[#475569] font-medium',
    error: 'w-full px-4 py-3 bg-[#0f172a] border-2 border-red-500/70 text-white rounded-lg focus:ring-2 focus:ring-red-500/50 focus:border-red-400 transition-all placeholder-[#475569]',
    disabled: 'w-full px-4 py-3 border-2 border-[#1e293b] rounded-lg bg-[#1e293b]/50 cursor-not-allowed text-[#475569] font-medium',
  },

  
  //  BADGES (STATUS)
  
  badges: {
    productStatus: {
      'RECEIVED': 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155] font-semibold',
      'IN_ANALYSIS': 'bg-amber-900/40 text-amber-400 border border-amber-500/50 font-semibold',
      'REJECTED': 'bg-red-900/40 text-red-400 border border-red-500/50 font-semibold',
      'APPROVED': 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/50 font-semibold',
      'IN_STORAGE': 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155] font-semibold',
      'IN_PREPARATION': 'bg-amber-900/30 text-amber-400 border border-amber-500/40 font-semibold',
      'IN_SHIPPING': 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155] font-semibold',
      'DELIVERED': 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/50 font-semibold',
      'IN_RETURN': 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155] font-semibold',
      'ELIMINATED': 'bg-[#0f172a] text-[#64748b] border border-[#1e293b] font-bold',
      'CANCELLED': 'bg-red-900/40 text-red-400 border border-red-500/50 font-semibold',
      'DISPATCHED': 'bg-amber-900/40 text-amber-400 border border-amber-500/50 font-semibold',
    } as Record<string, string>,
    
    vehicleStatus: {
      'available': 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/50 font-semibold',
      'in_use': 'bg-amber-900/40 text-amber-400 border border-amber-500/50 font-semibold',
      'maintenance': 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155] font-semibold',
    } as Record<string, string>,
    
    transportStatus: {
      'PENDING': 'bg-amber-900/40 text-amber-400 border border-amber-500/50 font-semibold',
      'IN_TRANSIT': 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155] font-semibold',
      'DELIVERED': 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/50 font-semibold',
      'CANCELLED': 'bg-red-900/40 text-red-400 border border-red-500/50 font-semibold',
    } as Record<string, string>,
    
    userRoles: {
      'SUPER_ADMIN': 'bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-[#3b82f6] border border-[#3b82f6]/50 font-black px-3 py-1 rounded-lg',
      'ADMIN': 'bg-[#1e293b]/70 text-[#3b82f6] border border-[#334155] font-bold px-3 py-1 rounded-lg',
      'OPERATOR': 'bg-[#0f172a]/70 text-[#cbd5e1] border border-[#1e293b] font-semibold px-3 py-1 rounded-lg',
    } as Record<string, string>,
  },

  
  //  CARDS E CONTAINERS
  
  cards: {
    base: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-lg border border-[#334155]/50 p-6 hover:border-[#3b82f6]/20 transition-all hover:shadow-xl',
    stat: 'bg-gradient-to-br from-[#1e293b] via-[#1e293b] to-[#0f172a] rounded-xl shadow-lg border border-[#334155]/50 p-6 hover:shadow-xl hover:border-[#3b82f6]/20 transition-all',
    form: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-xl p-6 border-2 border-[#3b82f6]/30',
    superAdminPrimary: 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-xl shadow-xl p-6 text-white border-2 border-[#3b82f6]/50',
    superAdminSecondary: 'bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] rounded-xl shadow-xl p-6 text-white border-2 border-[#3b82f6]',
  },

  
  //  ÍCONES E AVATARES
  
  icons: {
    primary: 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-xl p-3 shadow-lg text-white font-bold',
    secondary: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-3 shadow-lg text-[#3b82f6] border border-[#3b82f6]/30',
    success: 'bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-3 shadow-lg text-white',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-3 shadow-lg text-slate-900 font-bold',
    info: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-3 shadow-lg text-[#3b82f6] border border-[#334155]',
    avatar: 'w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md',
    avatarLarge: 'w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] flex items-center justify-center border-4 border-[#3b82f6] shadow-2xl',
  },

  
  //  BACKGROUNDS
  
  backgrounds: {
    page: 'min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black',
    pageAlt: 'min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-[#1e293b]',
    header: 'bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-b-2 border-[#3b82f6]/30 shadow-xl backdrop-blur-sm',
    table: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-lg overflow-hidden border-2 border-[#334155]/50',
    tableRow: 'hover:bg-[#334155]/30 transition-colors border-b border-[#334155]/50',
  },

  
  // 📐 TABELAS
  
  table: {
    header: 'bg-gradient-to-r from-[#0f172a] to-black px-8 py-4 text-left text-xs font-black text-[#3b82f6] uppercase tracking-widest',
    cell: 'px-8 py-4 whitespace-nowrap text-sm text-[#cbd5e1] font-medium border-b border-[#334155]/50',
    cellSecondary: 'px-8 py-4 whitespace-nowrap text-sm text-[#64748b] font-medium border-b border-[#334155]/50',
  },

  
  // 🔔 ALERTAS E MENSAGENS
  
  alerts: {
    success: 'bg-emerald-900/30 border-l-4 border-emerald-500/70 text-emerald-400 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm font-semibold',
    error: 'bg-red-900/30 border-l-4 border-red-500/70 text-red-400 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm font-semibold',
    warning: 'bg-amber-900/30 border-l-4 border-amber-500/70 text-amber-400 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm font-semibold',
    info: 'bg-[#1e293b]/50 border-l-4 border-[#334155]/70 text-[#cbd5e1] px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm font-semibold',
  },

  
  // 📑 TABS
  
  tabs: {
    active: 'py-4 px-6 border-b-4 border-[#3b82f6] text-[#3b82f6] font-black transition-colors uppercase tracking-wide',
    inactive: 'py-4 px-6 border-b-4 border-transparent text-[#64748b] hover:text-[#cbd5e1] hover:border-[#334155] font-bold transition-colors uppercase tracking-wide',
  },
};


// 🔧 FUNÇÕES AUXILIARES


export function combineThemeClasses(...classes: string[]): string {
  return classes.join(' ');
}

export function getStatusBadgeClass(
  type: 'product' | 'vehicle' | 'transport' | 'user',
  status: string
): string {
  switch (type) {
    case 'product':
      return theme.badges.productStatus[status] || 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155]';
    case 'vehicle':
      return theme.badges.vehicleStatus[status] || 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155]';
    case 'transport':
      return theme.badges.transportStatus[status] || 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155]';
    case 'user':
      return theme.badges.userRoles[status] || 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155]';
    default:
      return 'bg-[#1e293b]/50 text-[#cbd5e1] border border-[#334155]';
  }
}

export const statusLabels = {
  product: {
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
    'CANCELLED': 'Cancelado',
    'DISPATCHED': 'Despachado',
  } as Record<string, string>,
  vehicle: {
    'available': 'Disponível',
    'in_use': 'Em Uso',
    'maintenance': 'Manutenção',
  } as Record<string, string>,
  transport: {
    'PENDING': 'Pendente',
    'IN_TRANSIT': 'Em Trânsito',
    'DELIVERED': 'Entregue',
    'CANCELLED': 'Cancelado',
  } as Record<string, string>,
  user: {
    'SUPER_ADMIN': 'Super Admin',
    'ADMIN': 'Administrador',
    'OPERATOR': 'Operador',
  } as Record<string, string>,
};

export const statusColors = {
  product: {
    'RECEIVED': '#021b44ff',
    'IN_ANALYSIS': '#d97706',
    'REJECTED': '#dc2626',
    'APPROVED': '#059669',
    'IN_STORAGE': '#334155',
    'IN_PREPARATION': '#b45309',
    'IN_SHIPPING': '#3b82f6',
    'DELIVERED': '#10b981',
    'IN_RETURN': '#979797ff',
    'ELIMINATED': '#002782ff',
    'CANCELLED': '#991b1b',
    'DISPATCHED': '#d97706',
  } as Record<string, string>,
  vehicle: {
    'available': '#059669',
    'in_use': '#d97706',
    'maintenance': '#334155',
  } as Record<string, string>,
  transport: {
    'PENDING': '#d97706',
    'IN_TRANSIT': '#3b82f6',
    'DELIVERED': '#059669',
    'CANCELLED': '#dc2626',
  } as Record<string, string>,
  user: {
    'SUPER_ADMIN': '#3b82f6',
    'ADMIN': '#2563eb',
    'OPERATOR': '#00245fff',
  } as Record<string, string>,
};

export default theme;