import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Listar logs de auditoria com filtros
 */
export const listAuditLogs = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Parâmetros de paginação
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Filtros
    const filters: any = { companyId };

    // Filtro por data
    if (req.query.startDate || req.query.endDate) {
      filters.createdAt = {};
      if (req.query.startDate) {
        filters.createdAt.gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        const endDate = new Date(req.query.endDate as string);
        endDate.setHours(23, 59, 59, 999);
        filters.createdAt.lte = endDate;
      }
    }

    // Filtro por utilizador
    if (req.query.userId) {
      filters.userId = req.query.userId as string;
    }

    // Filtro por ação
    if (req.query.action) {
      filters.action = req.query.action as string;
    }

    // Filtro por entidade
    if (req.query.entity) {
      filters.entity = req.query.entity as string;
    }

    // Buscar logs e total
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: filters,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where: filters }),
    ]);

    // Calcular páginas
    const totalPages = Math.ceil(total / limit);

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Erro ao listar logs:', error);
    res.status(500).json({ message: 'Erro ao listar logs de auditoria' });
  }
};

/**
 * Obter estatísticas de auditoria
 */
export const getAuditStats = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Filtro de data (últimos 30 dias por padrão)
    const startDate = req.query.startDate 
      ? new Date(req.query.startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    const where = {
      companyId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Total de ações
    const totalActions = await prisma.auditLog.count({ where });

    // Ações por tipo
    const actionsByType = await prisma.auditLog.groupBy({
      by: ['action'],
      where,
      _count: true,
    });

    // Ações por entidade
    const actionsByEntity = await prisma.auditLog.groupBy({
      by: ['entity'],
      where,
      _count: true,
    });

    // Utilizadores mais ativos
    const topUsers = await prisma.auditLog.groupBy({
      by: ['userId'],
      where,
      _count: true,
      orderBy: {
        _count: {
          userId: 'desc',
        },
      },
      take: 5,
    });

    // Buscar dados dos utilizadores
    const userIds = topUsers.map(u => u.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const topUsersWithData = topUsers.map(item => {
      const user = users.find(u => u.id === item.userId);
      return {
        userId: item.userId,
        userName: user?.name || 'Desconhecido',
        userEmail: user?.email || '',
        count: item._count,
      };
    });

    res.json({
      totalActions,
      actionsByType: actionsByType.map(item => ({
        action: item.action,
        count: item._count,
      })),
      actionsByEntity: actionsByEntity.map(item => ({
        entity: item.entity,
        count: item._count,
      })),
      topUsers: topUsersWithData,
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ message: 'Erro ao obter estatísticas de auditoria' });
  }
};

/**
 * Obter detalhes de um log específico
 */
export const getAuditLogDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const { id } = req.params;

    if (!companyId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const log = await prisma.auditLog.findFirst({
      where: { id, companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!log) {
      return res.status(404).json({ message: 'Log não encontrado' });
    }

    res.json(log);
  } catch (error) {
    console.error('Erro ao obter detalhes do log:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do log' });
  }
};