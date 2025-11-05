import { ProductStatus } from '@prisma/client';

export const STATE_TRANSITIONS: Record<ProductStatus, ProductStatus[]> = {
  [ProductStatus.RECEIVED]: [ProductStatus.IN_ANALYSIS],
  
  [ProductStatus.IN_ANALYSIS]: [
    ProductStatus.APPROVED,
    ProductStatus.REJECTED
  ],
  
  [ProductStatus.REJECTED]: [ProductStatus.IN_RETURN],
  
  [ProductStatus.APPROVED]: [ProductStatus.IN_STORAGE],
  
  [ProductStatus.IN_STORAGE]: [
    ProductStatus.IN_PREPARATION,
    ProductStatus.IN_SHIPPING
  ],
  
  [ProductStatus.IN_PREPARATION]: [
    ProductStatus.IN_SHIPPING,
    ProductStatus.CANCELLED
  ],
  
  [ProductStatus.IN_SHIPPING]: [ProductStatus.DELIVERED],
  
  [ProductStatus.DELIVERED]: [],
  
  [ProductStatus.IN_RETURN]: [
    ProductStatus.RECEIVED,
    ProductStatus.ELIMINATED
  ],
  
  [ProductStatus.ELIMINATED]: [],
  
  [ProductStatus.CANCELLED]: [ProductStatus.IN_STORAGE]
};

export interface StateTransitionRequirements {
  requiredFields?: string[];
  requiresAdminRole?: boolean;
  requiresComment?: boolean;
}

export const TRANSITION_REQUIREMENTS: Record<string, StateTransitionRequirements> = {
  'RECEIVED->IN_ANALYSIS': {
    requiresComment: false
  },
  
  'IN_ANALYSIS->APPROVED': {
    requiresAdminRole: true,
    requiresComment: false
  },
  
  'IN_ANALYSIS->REJECTED': {
    requiresAdminRole: true,
    requiresComment: true,
    requiredFields: ['reason']
  },
  
  'REJECTED->IN_RETURN': {
    requiresComment: true
  },
  
  'IN_PREPARATION->IN_SHIPPING': {
    requiresComment: false
  },
  
  'IN_SHIPPING->DELIVERED': {
    requiresComment: false
  }
};

export const STATUS_TRANSLATIONS: Record<ProductStatus, string> = {
  [ProductStatus.RECEIVED]: 'Recebido',
  [ProductStatus.IN_ANALYSIS]: 'Em Análise',
  [ProductStatus.REJECTED]: 'Rejeitado',
  [ProductStatus.APPROVED]: 'Aprovado',
  [ProductStatus.IN_STORAGE]: 'Em Armazenamento',
  [ProductStatus.IN_PREPARATION]: 'Em Preparação',
  [ProductStatus.IN_SHIPPING]: 'Em Expedição',
  [ProductStatus.DELIVERED]: 'Entregue',
  [ProductStatus.IN_RETURN]: 'Em Devolução',
  [ProductStatus.ELIMINATED]: 'Eliminado',
  [ProductStatus.CANCELLED]: 'Cancelado'
};