import { ProductStatus, Role } from '@prisma/client';
import { STATE_TRANSITIONS, TRANSITION_REQUIREMENTS, StateTransitionRequirements } from '../types/product-states';

export class ProductStateService {
  
  static isTransitionAllowed(
    currentStatus: ProductStatus,
    newStatus: ProductStatus
  ): boolean {
    const allowedTransitions = STATE_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  
  static getTransitionRequirements(
    currentStatus: ProductStatus,
    newStatus: ProductStatus
  ): StateTransitionRequirements {
    const key = `${currentStatus}->${newStatus}`;
    return TRANSITION_REQUIREMENTS[key] || {};
  }

  
  static canUserMakeTransition(
    currentStatus: ProductStatus,
    newStatus: ProductStatus,
    userRole: Role
  ): { allowed: boolean; reason?: string } {
     
    if (!this.isTransitionAllowed(currentStatus, newStatus)) {
      return {
        allowed: false,
        reason: `Transição de ${currentStatus} para ${newStatus} não é permitida`
      };
    }

   
    const requirements = this.getTransitionRequirements(currentStatus, newStatus);
    
    if (requirements.requiresAdminRole && userRole !== Role.ADMIN) {
      return {
        allowed: false,
        reason: 'Esta transição requer permissões de Administrador'
      };
    }

    return { allowed: true };
  }

 
  static validateRequiredFields(
    currentStatus: ProductStatus,
    newStatus: ProductStatus,
    data: any
  ): { valid: boolean; missingFields?: string[] } {
    const requirements = this.getTransitionRequirements(currentStatus, newStatus);
    
    const missingFields: string[] = [];

     
    if (requirements.requiredFields) {
      for (const field of requirements.requiredFields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
          missingFields.push(field);
        }
      }
    }

     
    if (requirements.requiresComment && (!data.reason || data.reason.trim() === '')) {
      missingFields.push('reason');
    }

    return {
      valid: missingFields.length === 0,
      missingFields: missingFields.length > 0 ? missingFields : undefined
    };
  }

  
  static getNextPossibleStates(currentStatus: ProductStatus): ProductStatus[] {
    return STATE_TRANSITIONS[currentStatus] || [];
  }

  
  static isFinalState(status: ProductStatus): boolean {
    return STATE_TRANSITIONS[status].length === 0;
  }
}