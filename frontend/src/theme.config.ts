export const theme = {
  colors: {
    // Cor primária (tons de azul navy com gradiente melhorado)
    primary: {
      50: 'bg-blue-50 dark:bg-gradient-to-br dark:from-[#1e293b] dark:to-[#0f172a]',
      100: 'bg-blue-100 dark:bg-[#1e293b]/60',
      500: 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] dark:from-[#3b82f6] dark:to-[#2563eb]',
      600: 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] dark:from-[#2563eb] dark:to-[#1d4ed8]',
      700: 'bg-gradient-to-r from-[#1d4ed8] to-[#1e40af] dark:from-[#1d4ed8] dark:to-[#1e40af]',
      text: 'text-blue-600 dark:text-[#60a5fa]',
      textDark: 'text-blue-800 dark:text-[#3b82f6]',
      border: 'border-blue-500 dark:border-[#3b82f6]/50',
      ring: 'ring-blue-500 dark:ring-[#3b82f6]/50',
    },
    
    // Cor secundária (tons escuros navy com melhor constraste)
    secondary: {
      50: 'bg-gray-50 dark:bg-[#1e293b]',
      100: 'bg-gray-100 dark:bg-[#334155]',
      500: 'bg-gray-500 dark:bg-[#1e293b]',
      600: 'bg-gray-600 dark:bg-[#0f172a]',
      700: 'bg-gray-700 dark:bg-black',
      text: 'text-gray-600 dark:text-[#cbd5e1]',
      textSecondary: 'text-gray-500 dark:text-[#64748b]',
      border: 'border-gray-500 dark:border-[#334155]/50',
    },
    
    // Cores de estado com sombras melhoradas
    success: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/20',
      text: 'text-green-600 dark:text-emerald-400',
      border: 'border-green-500 dark:border-emerald-500/70',
      light: 'dark:bg-emerald-900/20 dark:text-emerald-300',
    },
    
    warning: {
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20',
      text: 'text-yellow-600 dark:text-amber-400',
      border: 'border-yellow-500 dark:border-amber-500/70',
      light: 'dark:bg-amber-900/20 dark:text-amber-300',
    },
    
    error: {
      bg: 'bg-gradient-to-br from-red-50 to-red-50 dark:from-red-900/40 dark:to-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-500 dark:border-red-500/70',
      light: 'dark:bg-red-900/20 dark:text-red-300',
    },
    
    info: {
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-[#1e293b]/50 dark:to-[#0f172a]',
      text: 'text-blue-600 dark:text-[#60a5fa]',
      border: 'border-blue-500 dark:border-[#3b82f6]/50',
    },
  },

  
  //  BOTÕES COM EFEITOS DARK MODE
  
  buttons: {
    primary: 'px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] dark:from-[#3b82f6] dark:to-[#2563eb] text-white rounded-lg hover:from-[#2563eb] hover:to-[#1d4ed8] dark:hover:from-[#60a5fa] dark:hover:to-[#3b82f6] transition-all duration-300 font-bold shadow-lg dark:shadow-dark-lg hover:shadow-xl dark:hover:shadow-neon-lg active:scale-95',
    secondary: 'px-6 py-3 bg-[#1e293b] border-2 border-[#334155] text-[#cbd5e1] dark:text-white rounded-lg hover:border-[#3b82f6] hover:bg-[#334155] dark:hover:bg-[#334155] transition-all duration-300 font-bold shadow-dark-md dark:hover:shadow-neon focus:ring-2 focus:ring-[#3b82f6]/50',
    success: 'px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 dark:hover:from-emerald-600 dark:hover:to-emerald-700 transition-all duration-300 font-bold shadow-dark-lg hover:shadow-neon-lg',
    danger: 'px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 transition-all duration-300 font-bold shadow-dark-lg hover:shadow-neon-lg',
    outline: 'px-6 py-3 border-2 border-[#3b82f6]/50 text-[#3b82f6] rounded-lg hover:bg-[#3b82f6]/10 dark:hover:bg-[#3b82f6]/20 transition-all duration-300 font-bold hover:border-[#3b82f6] dark:border-[#3b82f6]/70 dark:text-[#60a5fa]',
    icon: 'p-2 hover:bg-[#3b82f6]/20 dark:hover:bg-[#3b82f6]/30 rounded-lg transition-all duration-300 text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] dark:hover:text-white',
    ghost: 'px-4 py-2 text-[#cbd5e1] dark:text-[#cbd5e1] rounded-lg hover:bg-[#334155]/50 dark:hover:bg-[#334155] transition-all duration-300 font-medium',
  },

  
  //  INPUTS E FORMS COM FOCO MELHORADO
  
  inputs: {
    base: 'w-full px-4 py-3 bg-white dark:bg-[#0f172a] border-2 border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#3b82f6]/50 dark:focus:ring-[#3b82f6]/70 focus:border-[#3b82f6] dark:focus:border-[#3b82f6] transition-all duration-200 placeholder-gray-500 dark:placeholder-[#475569] font-medium shadow-dark-sm dark:shadow-dark-md',
    error: 'w-full px-4 py-3 bg-white dark:bg-[#0f172a] border-2 border-red-500/70 dark:border-red-500/70 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500/50 focus:border-red-400 dark:focus:border-red-500 transition-all duration-200 placeholder-gray-500 dark:placeholder-[#475569] shadow-dark-sm',
    disabled: 'w-full px-4 py-3 border-2 border-gray-300 dark:border-[#334155]/70 rounded-lg bg-gray-100 dark:bg-[#1e293b]/50 cursor-not-allowed text-gray-500 dark:text-[#475569] font-medium opacity-60',
    success: 'w-full px-4 py-3 bg-white dark:bg-[#0f172a] border-2 border-emerald-500/70 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all duration-200 placeholder-gray-500 dark:placeholder-[#475569]',
  },

  
  //  BADGES COM MAIS VARIAÇÕES
  
  badges: {
    productStatus: {
      'RECEIVED': 'bg-[#1e293b]/60 text-[#cbd5e1] border border-[#334155]/50 font-semibold shadow-dark-sm',
      'IN_ANALYSIS': 'bg-gradient-to-r from-amber-900/40 to-amber-900/20 text-amber-400 border border-amber-500/70 font-semibold shadow-dark-sm',
      'REJECTED': 'bg-gradient-to-r from-red-900/40 to-red-900/20 text-red-400 border border-red-500/70 font-semibold shadow-dark-sm',
      'APPROVED': 'bg-gradient-to-r from-emerald-900/40 to-emerald-900/20 text-emerald-400 border border-emerald-500/70 font-semibold shadow-dark-sm',
      'IN_STORAGE': 'bg-[#1e293b]/60 text-[#cbd5e1] border border-[#334155]/50 font-semibold shadow-dark-sm',
      'IN_PREPARATION': 'bg-gradient-to-r from-amber-900/40 to-amber-900/20 text-amber-400 border border-amber-500/70 font-semibold shadow-dark-sm',
      'IN_SHIPPING': 'bg-[#1e293b]/60 text-[#cbd5e1] border border-[#334155]/50 font-semibold shadow-dark-sm',
      'DELIVERED': 'bg-gradient-to-r from-emerald-900/40 to-emerald-900/20 text-emerald-400 border border-emerald-500/70 font-semibold shadow-dark-sm',
      'IN_RETURN': 'bg-[#1e293b]/60 text-[#cbd5e1] border border-[#334155]/50 font-semibold shadow-dark-sm',
      'ELIMINATED': 'bg-[#0f172a] text-[#64748b] border border-[#1e293b] font-bold shadow-dark-sm',
      'CANCELLED': 'bg-gradient-to-r from-red-900/40 to-red-900/20 text-red-400 border border-red-500/70 font-semibold shadow-dark-sm',
      'DISPATCHED': 'bg-gradient-to-r from-amber-900/40 to-amber-900/20 text-amber-400 border border-amber-500/70 font-semibold shadow-dark-sm',
    } as Record<string, string>,
    
    vehicleStatus: {
      'available': 'bg-gradient-to-r from-emerald-900/40 to-emerald-900/20 text-emerald-400 border border-emerald-500/70 font-semibold shadow-dark-sm',
      'in_use': 'bg-gradient-to-r from-amber-900/40 to-amber-900/20 text-amber-400 border border-amber-500/70 font-semibold shadow-dark-sm',
      'maintenance': 'bg-[#1e293b]/60 text-[#cbd5e1] border border-[#334155]/50 font-semibold shadow-dark-sm',
    } as Record<string, string>,
    
    transportStatus: {
      'PENDING': 'bg-gradient-to-r from-amber-900/40 to-amber-900/20 text-amber-400 border border-amber-500/70 font-semibold shadow-dark-sm',
      'IN_TRANSIT': 'bg-[#1e293b]/60 text-[#cbd5e1] border border-[#334155]/50 font-semibold shadow-dark-sm',
      'DELIVERED': 'bg-gradient-to-r from-emerald-900/40 to-emerald-900/20 text-emerald-400 border border-emerald-500/70 font-semibold shadow-dark-sm',
      'CANCELLED': 'bg-gradient-to-r from-red-900/40 to-red-900/20 text-red-400 border border-red-500/70 font-semibold shadow-dark-sm',
    } as Record<string, string>,
    
    userRoles: {
      'SUPER_ADMIN': 'bg-gradient-to-r from-[#1d4ed8] to-[#1e40af] dark:from-[#3b82f6] dark:to-[#2563eb] text-white font-black px-3 py-1 rounded-lg shadow-dark-md',
      'ADMIN': 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] dark:from-[#2563eb] dark:to-[#1d4ed8] text-white font-bold px-3 py-1 rounded-lg shadow-dark-sm',
      'OPERATOR': 'bg-[#1e293b]/70 text-[#cbd5e1] border border-[#334155] font-semibold px-3 py-1 rounded-lg shadow-dark-sm',
    } as Record<string, string>,

    size: {
      sm: 'px-2 py-1 text-xs rounded-md',
      md: 'px-3 py-1 text-sm rounded-lg',
      lg: 'px-4 py-2 text-base rounded-lg',
    },
  },

  
  //  CARDS E CONTAINERS COM MELHOR VISUAL
  
  cards: {
    base: 'bg-gradient-to-br from-white to-gray-50 dark:from-[#1e293b] dark:to-[#0f172a] rounded-xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-[#334155]/50 p-6 hover:border-[#3b82f6]/30 dark:hover:border-[#3b82f6]/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-neon',
    stat: 'bg-gradient-to-br from-white to-gray-50 dark:from-[#1e293b] dark:via-[#1e293b] dark:to-[#0f172a] rounded-xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-[#334155]/50 p-6 hover:shadow-xl dark:hover:shadow-neon hover:border-[#3b82f6]/30 dark:hover:border-[#3b82f6]/50 transition-all duration-300',
    form: 'bg-gradient-to-br from-white to-gray-50 dark:from-[#1e293b] dark:to-[#0f172a] rounded-xl shadow-xl dark:shadow-dark-xl p-6 border-2 border-blue-200 dark:border-[#3b82f6]/40',
    superAdminPrimary: 'bg-gradient-to-br from-gray-50 to-white dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] rounded-xl shadow-xl dark:shadow-dark-xl p-6 text-gray-900 dark:text-white border-2 border-blue-300 dark:border-[#3b82f6]/70',
    superAdminSecondary: 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] dark:from-[#3b82f6] dark:to-[#1d4ed8] rounded-xl shadow-xl dark:shadow-neon-lg p-6 text-white border-2 border-[#2563eb] dark:border-[#60a5fa]/50',
    elevated: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-dark-xl p-6 border border-[#334155]/70 dark:hover:shadow-neon-lg transition-all duration-300',
  },

  
  //  ÍCONES E AVATARES COM GLOW
  
  icons: {
    primary: 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-xl p-3 shadow-dark-lg text-white font-bold',
    secondary: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-3 shadow-dark-lg text-[#3b82f6] border border-[#3b82f6]/30',
    success: 'bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-3 shadow-dark-lg text-white',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-3 shadow-dark-lg text-slate-900 font-bold',
    danger: 'bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-3 shadow-dark-lg text-white',
    info: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-3 shadow-dark-lg text-[#3b82f6] border border-[#334155]',
    avatar: 'w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-dark-md',
    avatarLarge: 'w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] flex items-center justify-center border-4 border-[#3b82f6] shadow-dark-xl hover:shadow-neon-lg transition-all duration-300',
  },

  
  //  BACKGROUNDS COM MELHOR GRADIENTE
  
  backgrounds: {
    page: 'min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-[#0f172a] dark:via-[#1e293b] dark:to-black',
    pageAlt: 'min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-black dark:via-[#0f172a] dark:to-[#1e293b]',
    header: 'bg-gradient-to-r from-white to-gray-50 dark:from-[#0f172a] dark:to-[#1e293b] border-b-2 border-blue-200 dark:border-[#3b82f6]/40 shadow-xl dark:shadow-dark-lg backdrop-blur-sm',
    table: 'bg-gradient-to-br from-white to-gray-50 dark:from-[#1e293b] dark:to-[#0f172a] rounded-xl shadow-lg dark:shadow-dark-lg overflow-hidden border-2 border-gray-200 dark:border-[#334155]/50',
    tableRow: 'hover:bg-gray-50 dark:hover:bg-[#334155]/40 transition-colors duration-200 border-b border-gray-200 dark:border-[#334155]/50',
    overlay: 'fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm',
  },

  
  // 📐 TABELAS COM MELHOR ESTILO
  
  table: {
    header: 'bg-gradient-to-r from-gray-50 to-white dark:from-[#0f172a] dark:to-black px-8 py-4 text-left text-xs font-black text-blue-600 dark:text-[#3b82f6] uppercase tracking-widest',
    cell: 'px-8 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-[#cbd5e1] font-medium border-b border-gray-200 dark:border-[#334155]/50',
    cellSecondary: 'px-8 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#64748b] font-medium border-b border-gray-200 dark:border-[#334155]/50',
  },

  
  // 🔔 ALERTAS E MENSAGENS
  
  alerts: {
    success: 'bg-green-50 dark:bg-emerald-900/30 border-l-4 border-green-500 dark:border-emerald-500/70 text-green-700 dark:text-emerald-400 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm font-semibold',
    error: 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-500/70 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm font-semibold',
    warning: 'bg-yellow-50 dark:bg-amber-900/30 border-l-4 border-yellow-500 dark:border-amber-500/70 text-yellow-700 dark:text-amber-400 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm font-semibold',
    info: 'bg-blue-50 dark:bg-[#1e293b]/50 border-l-4 border-blue-500 dark:border-[#334155]/70 text-blue-700 dark:text-[#cbd5e1] px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm font-semibold',
  },

  
  // 📑 TABS
  
  tabs: {
    active: 'py-4 px-6 border-b-4 border-blue-500 dark:border-[#3b82f6] text-blue-600 dark:text-[#3b82f6] font-black transition-colors uppercase tracking-wide',
    inactive: 'py-4 px-6 border-b-4 border-transparent text-gray-500 dark:text-[#64748b] hover:text-gray-700 dark:hover:text-[#cbd5e1] hover:border-gray-300 dark:hover:border-[#334155] font-bold transition-colors uppercase tracking-wide',
  },
};
  
  // 📐 TABELAS COM MELHOR ESTILO
  
  table: {
    header: 'bg-gradient-to-r from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] px-8 py-4 text-left text-xs font-black text-blue-600 dark:text-[#60a5fa] uppercase tracking-widest shadow-dark-sm',
    cell: 'px-8 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-[#cbd5e1] font-medium border-b border-gray-200 dark:border-[#334155]/50',
    cellSecondary: 'px-8 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#64748b] font-medium border-b border-gray-200 dark:border-[#334155]/50',
  },

  
  // 🔔 ALERTAS E MENSAGENS COM MELHOR VISUAL
  
  alerts: {
    success: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/20 border-l-4 border-green-500 dark:border-emerald-500/70 text-green-700 dark:text-emerald-400 px-4 py-3 rounded-lg shadow-dark-md backdrop-blur-sm font-semibold',
    error: 'bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/40 dark:to-red-900/20 border-l-4 border-red-500 dark:border-red-500/70 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg shadow-dark-md backdrop-blur-sm font-semibold',
    warning: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20 border-l-4 border-yellow-500 dark:border-amber-500/70 text-yellow-700 dark:text-amber-400 px-4 py-3 rounded-lg shadow-dark-md backdrop-blur-sm font-semibold',
    info: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-[#1e293b]/50 dark:to-[#0f172a] border-l-4 border-blue-500 dark:border-[#3b82f6]/70 text-blue-700 dark:text-[#60a5fa] px-4 py-3 rounded-lg shadow-dark-md backdrop-blur-sm font-semibold',
  },

  
  // 📑 TABS COM MAIS ESTILO
  
  tabs: {
    active: 'py-4 px-6 border-b-4 border-blue-500 dark:border-[#3b82f6] text-blue-600 dark:text-[#60a5fa] font-black transition-all duration-300 uppercase tracking-wide shadow-dark-sm',
    inactive: 'py-4 px-6 border-b-4 border-transparent text-gray-500 dark:text-[#64748b] hover:text-gray-700 dark:hover:text-[#cbd5e1] hover:border-gray-300 dark:hover:border-[#334155] font-bold transition-all duration-300 uppercase tracking-wide',
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
    'RECEIVED': 'Received',
    'IN_ANALYSIS': 'In Analysis',
    'REJECTED': 'Rejected',
    'APPROVED': 'Approved',
    'IN_STORAGE': 'In Storage',
    'IN_PREPARATION': 'In Preparation',
    'IN_SHIPPING': 'In Shipping',
    'DELIVERED': 'Delivered',
    'IN_RETURN': 'In Return',
    'ELIMINATED': 'Eliminated',
    'CANCELLED': 'Cancelled',
    'DISPATCHED': 'Dispatched',
  } as Record<string, string>,
  vehicle: {
    'available': 'Available',
    'in_use': 'In Use',
    'maintenance': 'Maintenance',
  } as Record<string, string>,
  transport: {
    'PENDING': 'Pending',
    'IN_TRANSIT': 'In Transit',
    'DELIVERED': 'Delivered',
    'CANCELLED': 'Cancelled',
  } as Record<string, string>,
  user: {
    'SUPER_ADMIN': 'Super Admin',
    'ADMIN': 'Administrator',
    'OPERATOR': 'Operator',
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