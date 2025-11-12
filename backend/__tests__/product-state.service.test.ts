import { ProductStatus, Role } from '@prisma/client';
import { ProductStateService } from '../src/services/product-state.service';


describe('ProductStateService', () => {
  
  // ========================================
  // TESTES: isTransitionAllowed
  // ========================================
  describe('isTransitionAllowed', () => {
    
    test('deve permitir RECEIVED -> IN_ANALYSIS', () => {
      const result = ProductStateService.isTransitionAllowed(
        ProductStatus.RECEIVED,
        ProductStatus.IN_ANALYSIS
      );
      expect(result).toBe(true);
    });

    test('deve permitir IN_ANALYSIS -> APPROVED', () => {
      const result = ProductStateService.isTransitionAllowed(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.APPROVED
      );
      expect(result).toBe(true);
    });

    test('deve permitir IN_ANALYSIS -> REJECTED', () => {
      const result = ProductStateService.isTransitionAllowed(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED
      );
      expect(result).toBe(true);
    });

    test('deve NEGAR transição RECEIVED -> APPROVED (salto inválido)', () => {
      const result = ProductStateService.isTransitionAllowed(
        ProductStatus.RECEIVED,
        ProductStatus.APPROVED
      );
      expect(result).toBe(false);
    });

    test('deve NEGAR transição DELIVERED -> IN_SHIPPING (estado final)', () => {
      const result = ProductStateService.isTransitionAllowed(
        ProductStatus.DELIVERED,
        ProductStatus.IN_SHIPPING
      );
      expect(result).toBe(false);
    });

    test('deve permitir IN_STORAGE -> IN_PREPARATION', () => {
      const result = ProductStateService.isTransitionAllowed(
        ProductStatus.IN_STORAGE,
        ProductStatus.IN_PREPARATION
      );
      expect(result).toBe(true);
    });

    test('deve permitir IN_RETURN -> ELIMINATED', () => {
      const result = ProductStateService.isTransitionAllowed(
        ProductStatus.IN_RETURN,
        ProductStatus.ELIMINATED
      );
      expect(result).toBe(true);
    });

    test('deve permitir CANCELLED -> IN_STORAGE (reativação)', () => {
      const result = ProductStateService.isTransitionAllowed(
        ProductStatus.CANCELLED,
        ProductStatus.IN_STORAGE
      );
      expect(result).toBe(true);
    });
  });

  // ========================================
  // TESTES: getTransitionRequirements
  // ========================================
  describe('getTransitionRequirements', () => {
    
    test('deve retornar requirements para IN_ANALYSIS -> APPROVED', () => {
      const requirements = ProductStateService.getTransitionRequirements(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.APPROVED
      );
      expect(requirements.requiresAdminRole).toBe(true);
      expect(requirements.requiresComment).toBe(false);
    });

    test('deve retornar requirements para IN_ANALYSIS -> REJECTED', () => {
      const requirements = ProductStateService.getTransitionRequirements(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED
      );
      expect(requirements.requiresAdminRole).toBe(true);
      expect(requirements.requiresComment).toBe(true);
      expect(requirements.requiredFields).toContain('reason');
    });

    test('deve retornar requirements para REJECTED -> IN_RETURN', () => {
      const requirements = ProductStateService.getTransitionRequirements(
        ProductStatus.REJECTED,
        ProductStatus.IN_RETURN
      );
      expect(requirements.requiresComment).toBe(true);
    });

    test('deve retornar objeto vazio para transição sem requirements definidos', () => {
      const requirements = ProductStateService.getTransitionRequirements(
        ProductStatus.APPROVED,
        ProductStatus.IN_STORAGE
      );
      expect(requirements).toEqual({});
    });
  });

  // ========================================
  // TESTES: canUserMakeTransition
  // ========================================
  describe('canUserMakeTransition', () => {
    
    test('ADMIN deve poder fazer IN_ANALYSIS -> APPROVED', () => {
      const result = ProductStateService.canUserMakeTransition(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.APPROVED,
        Role.ADMIN
      );
      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    test('OPERATOR NÃO deve poder fazer IN_ANALYSIS -> APPROVED', () => {
      const result = ProductStateService.canUserMakeTransition(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.APPROVED,
        Role.OPERATOR
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Administrador');
    });

    test('OPERATOR deve poder fazer RECEIVED -> IN_ANALYSIS', () => {
      const result = ProductStateService.canUserMakeTransition(
        ProductStatus.RECEIVED,
        ProductStatus.IN_ANALYSIS,
        Role.OPERATOR
      );
      expect(result.allowed).toBe(true);
    });

    test('deve NEGAR transição inválida independente do role', () => {
      const result = ProductStateService.canUserMakeTransition(
        ProductStatus.RECEIVED,
        ProductStatus.DELIVERED,
        Role.ADMIN
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('não é permitida');
    });

    // NOTA: SUPER_ADMIN não existe no schema Prisma atual (apenas ADMIN e OPERATOR)
    // Se quiser adicionar SUPER_ADMIN, atualize o schema e depois adicione este teste
    // test('SUPER_ADMIN deve poder fazer qualquer transição válida', () => {
    //   const result = ProductStateService.canUserMakeTransition(
    //     ProductStatus.IN_ANALYSIS,
    //     ProductStatus.APPROVED,
    //     Role.SUPER_ADMIN
    //   );
    //   expect(result.allowed).toBe(true);
    // });

    test('deve retornar motivo claro ao negar permissão', () => {
      const result = ProductStateService.canUserMakeTransition(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        Role.OPERATOR
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBeDefined();
      expect(typeof result.reason).toBe('string');
    });
  });

  // ========================================
  // TESTES: validateRequiredFields
  // ========================================
  describe('validateRequiredFields', () => {
    
    test('deve validar com sucesso quando todos os campos estão presentes', () => {
      const data = {
        reason: 'Produto danificado',
        otherField: 'value'
      };
      
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        data
      );
      
      expect(result.valid).toBe(true);
      expect(result.missingFields).toBeUndefined();
    });

    test('deve FALHAR quando reason está vazio (string vazia)', () => {
      const data = {
        reason: '   ',  // Apenas espaços
      };
      
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        data
      );
      
      expect(result.valid).toBe(false);
      expect(result.missingFields).toContain('reason');
    });

    test('deve FALHAR quando campo obrigatório está ausente', () => {
      const data = {};
      
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        data
      );
      
      expect(result.valid).toBe(false);
      expect(result.missingFields).toContain('reason');
    });

    test('deve passar quando transição não requer campos', () => {
      const data = {};
      
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.RECEIVED,
        ProductStatus.IN_ANALYSIS,
        data
      );
      
      expect(result.valid).toBe(true);
    });

    test('deve detectar múltiplos campos em falta', () => {
      // Criar uma transição customizada com múltiplos campos (mockando internamente)
      const data = {};
      
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        data
      );
      
      expect(result.valid).toBe(false);
      expect(result.missingFields?.length).toBeGreaterThan(0);
    });

    test('deve aceitar reason com conteúdo válido', () => {
      const data = {
        reason: 'Embalagem violada durante transporte'
      };
      
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.REJECTED,
        ProductStatus.IN_RETURN,
        data
      );
      
      expect(result.valid).toBe(true);
    });

    test('deve rejeitar undefined como valor de campo', () => {
      const data = {
        reason: undefined
      };
      
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        data
      );
      
      expect(result.valid).toBe(false);
    });

    test('deve listar exatamente os campos em falta', () => {
      const data = {};
      
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        data
      );
      
      expect(result.missingFields).toEqual(['reason']);
    });
  });

  // ========================================
  // TESTES: getNextPossibleStates
  // ========================================
  describe('getNextPossibleStates', () => {
    
    test('deve retornar próximos estados para RECEIVED', () => {
      const nextStates = ProductStateService.getNextPossibleStates(
        ProductStatus.RECEIVED
      );
      
      expect(nextStates).toEqual([ProductStatus.IN_ANALYSIS]);
      expect(nextStates.length).toBe(1);
    });

    test('deve retornar múltiplos próximos estados para IN_ANALYSIS', () => {
      const nextStates = ProductStateService.getNextPossibleStates(
        ProductStatus.IN_ANALYSIS
      );
      
      expect(nextStates).toContain(ProductStatus.APPROVED);
      expect(nextStates).toContain(ProductStatus.REJECTED);
      expect(nextStates.length).toBe(2);
    });

    test('deve retornar array vazio para DELIVERED (estado final)', () => {
      const nextStates = ProductStateService.getNextPossibleStates(
        ProductStatus.DELIVERED
      );
      
      expect(nextStates).toEqual([]);
      expect(nextStates.length).toBe(0);
    });

    test('deve retornar array vazio para ELIMINATED (estado final)', () => {
      const nextStates = ProductStateService.getNextPossibleStates(
        ProductStatus.ELIMINATED
      );
      
      expect(nextStates).toEqual([]);
    });

    test('deve retornar estados corretos para IN_STORAGE', () => {
      const nextStates = ProductStateService.getNextPossibleStates(
        ProductStatus.IN_STORAGE
      );
      
      expect(nextStates).toContain(ProductStatus.IN_PREPARATION);
      expect(nextStates).toContain(ProductStatus.IN_SHIPPING);
      expect(nextStates.length).toBe(2);
    });

    test('deve retornar estados para IN_RETURN', () => {
      const nextStates = ProductStateService.getNextPossibleStates(
        ProductStatus.IN_RETURN
      );
      
      expect(nextStates).toContain(ProductStatus.RECEIVED);
      expect(nextStates).toContain(ProductStatus.ELIMINATED);
      expect(nextStates.length).toBe(2);
    });
  });

  // ========================================
  // TESTES: isFinalState
  // ========================================
  describe('isFinalState', () => {
    
    test('DELIVERED deve ser estado final', () => {
      const result = ProductStateService.isFinalState(ProductStatus.DELIVERED);
      expect(result).toBe(true);
    });

    test('ELIMINATED deve ser estado final', () => {
      const result = ProductStateService.isFinalState(ProductStatus.ELIMINATED);
      expect(result).toBe(true);
    });

    test('RECEIVED NÃO deve ser estado final', () => {
      const result = ProductStateService.isFinalState(ProductStatus.RECEIVED);
      expect(result).toBe(false);
    });

    test('IN_ANALYSIS NÃO deve ser estado final', () => {
      const result = ProductStateService.isFinalState(ProductStatus.IN_ANALYSIS);
      expect(result).toBe(false);
    });

    test('IN_STORAGE NÃO deve ser estado final', () => {
      const result = ProductStateService.isFinalState(ProductStatus.IN_STORAGE);
      expect(result).toBe(false);
    });

    test('CANCELLED NÃO deve ser estado final (pode voltar a IN_STORAGE)', () => {
      const result = ProductStateService.isFinalState(ProductStatus.CANCELLED);
      expect(result).toBe(false);
    });
  });

  // ========================================
  // TESTES DE INTEGRAÇÃO: Fluxos Completos
  // ========================================
  describe('Fluxos de Transição Completos', () => {
    
    test('Fluxo Completo: RECEIVED -> DELIVERED (caminho feliz)', () => {
      // Passo 1: RECEIVED -> IN_ANALYSIS
      let canTransition = ProductStateService.isTransitionAllowed(
        ProductStatus.RECEIVED,
        ProductStatus.IN_ANALYSIS
      );
      expect(canTransition).toBe(true);
      
      // Passo 2: IN_ANALYSIS -> APPROVED (requer ADMIN)
      let userCan = ProductStateService.canUserMakeTransition(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.APPROVED,
        Role.ADMIN
      );
      expect(userCan.allowed).toBe(true);
      
      // Passo 3: APPROVED -> IN_STORAGE
      canTransition = ProductStateService.isTransitionAllowed(
        ProductStatus.APPROVED,
        ProductStatus.IN_STORAGE
      );
      expect(canTransition).toBe(true);
      
      // Passo 4: IN_STORAGE -> IN_SHIPPING
      canTransition = ProductStateService.isTransitionAllowed(
        ProductStatus.IN_STORAGE,
        ProductStatus.IN_SHIPPING
      );
      expect(canTransition).toBe(true);
      
      // Passo 5: IN_SHIPPING -> DELIVERED
      canTransition = ProductStateService.isTransitionAllowed(
        ProductStatus.IN_SHIPPING,
        ProductStatus.DELIVERED
      );
      expect(canTransition).toBe(true);
      
      // Verificar que DELIVERED é estado final
      const isFinal = ProductStateService.isFinalState(ProductStatus.DELIVERED);
      expect(isFinal).toBe(true);
    });

    test('Fluxo de Rejeição: RECEIVED -> ELIMINATED', () => {
      // Passo 1: RECEIVED -> IN_ANALYSIS
      let canTransition = ProductStateService.isTransitionAllowed(
        ProductStatus.RECEIVED,
        ProductStatus.IN_ANALYSIS
      );
      expect(canTransition).toBe(true);
      
      // Passo 2: IN_ANALYSIS -> REJECTED (com reason)
      let validation = ProductStateService.validateRequiredFields(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        { reason: 'Produto danificado' }
      );
      expect(validation.valid).toBe(true);
      
      let userCan = ProductStateService.canUserMakeTransition(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        Role.ADMIN
      );
      expect(userCan.allowed).toBe(true);
      
      // Passo 3: REJECTED -> IN_RETURN
      canTransition = ProductStateService.isTransitionAllowed(
        ProductStatus.REJECTED,
        ProductStatus.IN_RETURN
      );
      expect(canTransition).toBe(true);
      
      // Passo 4: IN_RETURN -> ELIMINATED
      canTransition = ProductStateService.isTransitionAllowed(
        ProductStatus.IN_RETURN,
        ProductStatus.ELIMINATED
      );
      expect(canTransition).toBe(true);
      
      // Verificar que ELIMINATED é estado final
      const isFinal = ProductStateService.isFinalState(ProductStatus.ELIMINATED);
      expect(isFinal).toBe(true);
    });

    test('Fluxo com Cancelamento e Reativação', () => {
      // IN_PREPARATION -> CANCELLED
      let canTransition = ProductStateService.isTransitionAllowed(
        ProductStatus.IN_PREPARATION,
        ProductStatus.CANCELLED
      );
      expect(canTransition).toBe(true);
      
      // CANCELLED -> IN_STORAGE (reativação)
      canTransition = ProductStateService.isTransitionAllowed(
        ProductStatus.CANCELLED,
        ProductStatus.IN_STORAGE
      );
      expect(canTransition).toBe(true);
      
      // Verificar que CANCELLED NÃO é estado final
      const isFinal = ProductStateService.isFinalState(ProductStatus.CANCELLED);
      expect(isFinal).toBe(false);
    });
  });

  // ========================================
  // TESTES DE EDGE CASES
  // ========================================
  describe('Edge Cases e Cenários Especiais', () => {
    
    test('deve retornar array de estados mesmo quando vazio', () => {
      const nextStates = ProductStateService.getNextPossibleStates(
        ProductStatus.DELIVERED
      );
      
      expect(Array.isArray(nextStates)).toBe(true);
      expect(nextStates.length).toBe(0);
    });

    test('validateRequiredFields deve lidar com dados null', () => {
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        null as any
      );
      
      expect(result.valid).toBe(false);
    });

    test('deve rejeitar strings vazias após trim', () => {
      const data = {
        reason: '     '  // Apenas espaços
      };
      
      const result = ProductStateService.validateRequiredFields(
        ProductStatus.IN_ANALYSIS,
        ProductStatus.REJECTED,
        data
      );
      
      expect(result.valid).toBe(false);
      expect(result.missingFields).toContain('reason');
    });
  });
});