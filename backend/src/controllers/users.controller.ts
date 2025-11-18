import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Listar todos os utilizadores da empresa
 */
export const listUsers = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const users = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true, 
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error);
    res.status(500).json({ message: 'Erro ao listar utilizadores' });
  }
};

/**
 * Criar novo utilizador
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const requestUserRole = req.user?.role;
    const { name, email, password, role } = req.body;

    if (!companyId || !requestUserRole) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    
    if (requestUserRole !== 'ADMIN' && requestUserRole !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem criar utilizadores' });
    }

    // Validações
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Campos obrigatórios: nome, email, password, role' });
    }

    if (!['ADMIN', 'OPERATOR'].includes(role)) {
      return res.status(400).json({ message: 'Role inválida. Use ADMIN ou OPERATOR' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password deve ter pelo menos 6 caracteres' });
    }

    
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role,
        isActive: true,  
        companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        createdAt: true,
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        userId: req.user!.userId,
        companyId,
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    res.status(500).json({ message: 'Erro ao criar utilizador' });
  }
};

/**
 * Atualizar utilizador existente
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const requestUserRole = req.user?.role;
    const requestUserId = req.user?.userId;
    const { id } = req.params;
    const { name, email, role, password, isActive } = req.body;

    if (!companyId || !requestUserRole || !requestUserId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (requestUserRole !== 'ADMIN' && requestUserRole !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem editar utilizadores' });
    }

  
    const user = await prisma.user.findFirst({
      where: { id, companyId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    //  Não permitir que o utilizador edite o próprio role
    if (id === requestUserId && role !== undefined && role !== user.role) {
      return res.status(403).json({ message: 'Não pode alterar a sua própria função' });
    }

    //  Não permitir desativar a si próprio
    if (id === requestUserId && isActive === false) {
      return res.status(403).json({ message: 'Não pode desativar a sua própria conta' });
    }

    const updateData: any = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Nome não pode estar vazio' });
      }
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      const emailTrimmed = email.trim().toLowerCase();
      
      // Verificar se email já existe em outro user
      const existingUser = await prisma.user.findFirst({
        where: {
          email: emailTrimmed,
          id: { not: id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }

      updateData.email = emailTrimmed;
    }

    if (role !== undefined) {
      if (!['ADMIN', 'OPERATOR'].includes(role)) {
        return res.status(400).json({ message: 'Role inválida' });
      }
      updateData.role = role;
    }

    //  Suporta alteração de status
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (password !== undefined && password.trim()) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password deve ter pelo menos 6 caracteres' });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Nenhum dado para atualizar' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        updatedAt: true,
        createdAt: true,
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'User',
        entityId: id,
        userId: requestUserId,
        companyId,
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar utilizador:', error);
    res.status(500).json({ message: 'Erro ao atualizar utilizador' });
  }
};

/**
 * Deletar/Desativar utilizador
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const requestUserRole = req.user?.role;
    const requestUserId = req.user?.userId;
    const { id } = req.params;

    if (!companyId || !requestUserRole || !requestUserId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (requestUserRole !== 'ADMIN' && requestUserRole !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem eliminar utilizadores' });
    }

    //  Não permitir eliminar a si próprio
    if (id === requestUserId) {
      return res.status(400).json({ message: 'Não pode eliminar a sua própria conta' });
    }

    // Verificar se user existe e pertence à empresa
    const user = await prisma.user.findFirst({
      where: { id, companyId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    //  OPÇÃO 1: Soft Delete (Desativar) - RECOMENDADO
    // Apenas marca como inativo sem eliminar do banco
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'DEACTIVATE',
        entity: 'User',
        entityId: id,
        userId: requestUserId,
        companyId,
      }
    });

    res.json({ 
      message: 'Utilizador desativado com sucesso',
      user: {
        id,
        name: user.name,
        email: user.email,
        isActive: false
      }
    });

    /*  OPÇÃO 2: Hard Delete (Eliminar permanentemente)
    // Descomentar se quiser eliminar permanentemente
    
    // Verificar dependências
    const [productMovements, auditLogs] = await Promise.all([
      prisma.productMovement.count({ where: { userId: id } }),
      prisma.auditLog.count({ where: { userId: id } })
    ]);

    if (productMovements > 0 || auditLogs > 0) {
      return res.status(409).json({
        message: `Não é possível eliminar. O utilizador tem ${productMovements} movimentação(ões) e ${auditLogs} log(s) associados`,
        canDelete: false,
        relatedData: {
          productMovements,
          auditLogs
        }
      });
    }

    // Eliminar permanentemente
    await prisma.user.delete({ where: { id } });

    res.json({ 
      message: 'Utilizador eliminado com sucesso',
      deletedUser: {
        id,
        name: user.name,
        email: user.email
      }
    });
    */
  } catch (error: any) {
    console.error('Erro ao eliminar utilizador:', error);
    
    if (error.code === 'P2003') {
      return res.status(409).json({
        message: 'Não é possível eliminar. O utilizador tem dados relacionados no sistema',
        canDelete: false
      });
    }
    
    res.status(500).json({ message: 'Erro ao eliminar utilizador' });
  }
};

/**
 *  NOVO: Reativar utilizador desativado
 */
export const reactivateUser = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const requestUserRole = req.user?.role;
    const requestUserId = req.user?.userId;
    const { id } = req.params;

    if (!companyId || !requestUserRole || !requestUserId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (requestUserRole !== 'ADMIN' && requestUserRole !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem reativar utilizadores' });
    }

    const user = await prisma.user.findFirst({
      where: { id, companyId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    if (user.isActive) {
      return res.status(400).json({ message: 'Utilizador já está ativo' });
    }

    const reactivatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatarUrl: true,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'REACTIVATE',
        entity: 'User',
        entityId: id,
        userId: requestUserId,
        companyId,
      }
    });

    res.json(reactivatedUser);
  } catch (error) {
    console.error('Erro ao reativar utilizador:', error);
    res.status(500).json({ message: 'Erro ao reativar utilizador' });
  }
};