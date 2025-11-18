import { Request, Response } from 'express';
import { PrismaClient, ProductStatus, TransportStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  entityType: 'product' | 'transport' | 'vehicle';
  entityId: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read?: boolean;
}

const readNotifications = new Map<string, Set<string>>();

const getUserReadNotifications = (userId: string): Set<string> => {
  if (!readNotifications.has(userId)) {
    readNotifications.set(userId, new Set());
  }
  return readNotifications.get(userId)!;
};

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    //  BYPASS: Super Admin não tem notificações (ou retorna vazio)
    if (req.user.role === 'SUPER_ADMIN') {
      res.json({
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        notifications: []
      });
      return;
    }

    //  VERIFICAR: Se não tem companyId, não pode acessar notificações
    if (!req.user.companyId) {
      res.status(403).json({ error: 'Usuário sem empresa associada' });
      return;
    }

    const notifications: Notification[] = [];
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const readNotifs = getUserReadNotifications(req.user.userId);

    // Produtos parados em análise
    const productsInAnalysis = await prisma.product.findMany({
      where: {
        companyId: req.user.companyId,
        status: ProductStatus.IN_ANALYSIS,
        lastMovedAt: {
          lt: fortyEightHoursAgo
        }
      },
      select: {
        id: true,
        internalCode: true,
        description: true,
        lastMovedAt: true
      }
    });

    productsInAnalysis.forEach(product => {
      const hoursInAnalysis = Math.floor((now.getTime() - new Date(product.lastMovedAt).getTime()) / (1000 * 60 * 60));
      const notifId = `product-analysis-${product.id}`;
      notifications.push({
        id: notifId,
        type: 'warning',
        title: 'Produto parado em análise',
        message: `${product.description} (${product.internalCode}) está em análise há ${hoursInAnalysis}h`,
        entityType: 'product',
        entityId: product.id,
        createdAt: product.lastMovedAt,
        priority: hoursInAnalysis > 72 ? 'critical' : 'high',
        read: readNotifs.has(notifId)
      });
    });

    // Produtos rejeitados
    const rejectedProducts = await prisma.product.findMany({
      where: {
        companyId: req.user.companyId,
        status: ProductStatus.REJECTED,
      },
      select: {
        id: true,
        internalCode: true,
        description: true,
        lastMovedAt: true,
        supplier: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        lastMovedAt: 'desc'
      },
      take: 10
    });

    rejectedProducts.forEach(product => {
      const notifId = `product-rejected-${product.id}`;
      notifications.push({
        id: notifId,
        type: 'error',
        title: 'Produto rejeitado',
        message: `${product.description} (${product.internalCode}) - Fornecedor: ${product.supplier?.name || 'N/A'}`,
        entityType: 'product',
        entityId: product.id,
        createdAt: product.lastMovedAt,
        priority: 'high',
        read: readNotifs.has(notifId)
      });
    });

    // Transportes atrasados
    const delayedTransports = await prisma.transport.findMany({
      where: {
        companyId: req.user.companyId,
        status: {
          in: [TransportStatus.PENDING, TransportStatus.IN_TRANSIT]
        },
        expectedDate: {
          lt: now
        }
      },
      select: {
        id: true,
        origin: true,
        destination: true,
        expectedDate: true,
        vehicle: {
          select: {
            licensePlate: true
          }
        }
      }
    });

    delayedTransports.forEach(transport => {
      const hoursDelay = Math.floor((now.getTime() - new Date(transport.expectedDate).getTime()) / (1000 * 60 * 60));
      const notifId = `transport-delayed-${transport.id}`;
      notifications.push({
        id: notifId,
        type: 'warning',
        title: 'Transporte atrasado',
        message: `${transport.origin} → ${transport.destination} (${transport.vehicle?.licensePlate || 'Sem veículo'}) - Atraso: ${hoursDelay}h`,
        entityType: 'transport',
        entityId: transport.id,
        createdAt: transport.expectedDate,
        priority: hoursDelay > 24 ? 'critical' : 'high',
        read: readNotifs.has(notifId)
      });
    });

    // Produtos em preparação há muito tempo
    const productsInPreparation = await prisma.product.findMany({
      where: {
        companyId: req.user.companyId,
        status: ProductStatus.IN_PREPARATION,
        lastMovedAt: {
          lt: new Date(now.getTime() - 24 * 60 * 60 * 1000)
        }
      },
      select: {
        id: true,
        internalCode: true,
        description: true,
        lastMovedAt: true
      }
    });

    productsInPreparation.forEach(product => {
      const hoursInPreparation = Math.floor((now.getTime() - new Date(product.lastMovedAt).getTime()) / (1000 * 60 * 60));
      const notifId = `product-preparation-${product.id}`;
      notifications.push({
        id: notifId,
        type: 'info',
        title: 'Produto em preparação há muito tempo',
        message: `${product.description} (${product.internalCode}) está em preparação há ${hoursInPreparation}h`,
        entityType: 'product',
        entityId: product.id,
        createdAt: product.lastMovedAt,
        priority: 'medium',
        read: readNotifs.has(notifId)
      });
    });

    // Produtos parados no armazém
    const stagnantProducts = await prisma.product.findMany({
      where: {
        companyId: req.user.companyId,
        status: ProductStatus.IN_STORAGE,
        lastMovedAt: {
          lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        id: true,
        internalCode: true,
        description: true,
        lastMovedAt: true,
        currentLocation: true
      },
      take: 5
    });

    stagnantProducts.forEach(product => {
      const daysStagnant = Math.floor((now.getTime() - new Date(product.lastMovedAt).getTime()) / (1000 * 60 * 60 * 24));
      const notifId = `product-stagnant-${product.id}`;
      notifications.push({
        id: notifId,
        type: 'info',
        title: 'Produto sem movimentação',
        message: `${product.description} (${product.internalCode}) em ${product.currentLocation} há ${daysStagnant} dias`,
        entityType: 'product',
        entityId: product.id,
        createdAt: product.lastMovedAt,
        priority: 'low',
        read: readNotifs.has(notifId)
      });
    });

    // Ordenar por prioridade
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    notifications.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const unreadNotifications = notifications.filter(n => !n.read);

    res.json({
      total: unreadNotifications.length,
      critical: unreadNotifications.filter(n => n.priority === 'critical').length,
      high: unreadNotifications.filter(n => n.priority === 'high').length,
      medium: unreadNotifications.filter(n => n.priority === 'medium').length,
      low: unreadNotifications.filter(n => n.priority === 'low').length,
      notifications
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;
    const readNotifs = getUserReadNotifications(req.user.userId);
    
    readNotifs.add(id);

    res.json({ 
      success: true,
      message: 'Notificação marcada como lida',
      id 
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Erro ao marcar notificação como lida' });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    //  BYPASS: Super Admin
    if (req.user.role === 'SUPER_ADMIN' || !req.user.companyId) {
      res.json({ 
        success: true,
        message: 'Nenhuma notificação para marcar',
        count: 0
      });
      return;
    }

    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const [
      productsInAnalysis,
      rejectedProducts,
      delayedTransports,
      productsInPreparation,
      stagnantProducts
    ] = await Promise.all([
      prisma.product.findMany({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.IN_ANALYSIS,
          lastMovedAt: { lt: fortyEightHoursAgo }
        },
        select: { id: true }
      }),
      prisma.product.findMany({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.REJECTED
        },
        select: { id: true },
        take: 10
      }),
      prisma.transport.findMany({
        where: {
          companyId: req.user.companyId,
          status: { in: [TransportStatus.PENDING, TransportStatus.IN_TRANSIT] },
          expectedDate: { lt: now }
        },
        select: { id: true }
      }),
      prisma.product.findMany({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.IN_PREPARATION,
          lastMovedAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
        },
        select: { id: true }
      }),
      prisma.product.findMany({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.IN_STORAGE,
          lastMovedAt: { lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        },
        select: { id: true },
        take: 5
      })
    ]);

    const readNotifs = getUserReadNotifications(req.user.userId);

    productsInAnalysis.forEach(p => readNotifs.add(`product-analysis-${p.id}`));
    rejectedProducts.forEach(p => readNotifs.add(`product-rejected-${p.id}`));
    delayedTransports.forEach(t => readNotifs.add(`transport-delayed-${t.id}`));
    productsInPreparation.forEach(p => readNotifs.add(`product-preparation-${p.id}`));
    stagnantProducts.forEach(p => readNotifs.add(`product-stagnant-${p.id}`));

    res.json({ 
      success: true,
      message: 'Todas as notificações foram marcadas como lidas',
      count: readNotifs.size
    });

  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Erro ao marcar todas como lidas' });
  }
};

export const clearAllNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    //  BYPASS: Super Admin
    if (req.user.role === 'SUPER_ADMIN' || !req.user.companyId) {
      res.json({ 
        success: true,
        message: 'Nenhuma notificação para limpar',
        cleared: 0
      });
      return;
    }

    const readNotifs = getUserReadNotifications(req.user.userId);
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const [
      productsInAnalysis,
      rejectedProducts,
      delayedTransports,
      productsInPreparation,
      stagnantProducts
    ] = await Promise.all([
      prisma.product.findMany({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.IN_ANALYSIS,
          lastMovedAt: { lt: fortyEightHoursAgo }
        },
        select: { id: true }
      }),
      prisma.product.findMany({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.REJECTED
        },
        select: { id: true }
      }),
      prisma.transport.findMany({
        where: {
          companyId: req.user.companyId,
          status: { in: [TransportStatus.PENDING, TransportStatus.IN_TRANSIT] },
          expectedDate: { lt: now }
        },
        select: { id: true }
      }),
      prisma.product.findMany({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.IN_PREPARATION,
          lastMovedAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
        },
        select: { id: true }
      }),
      prisma.product.findMany({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.IN_STORAGE,
          lastMovedAt: { lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        },
        select: { id: true }
      })
    ]);

    productsInAnalysis.forEach(p => readNotifs.add(`product-analysis-${p.id}`));
    rejectedProducts.forEach(p => readNotifs.add(`product-rejected-${p.id}`));
    delayedTransports.forEach(t => readNotifs.add(`transport-delayed-${t.id}`));
    productsInPreparation.forEach(p => readNotifs.add(`product-preparation-${p.id}`));
    stagnantProducts.forEach(p => readNotifs.add(`product-stagnant-${p.id}`));

    res.json({ 
      success: true,
      message: 'Todas as notificações foram limpas',
      cleared: readNotifs.size
    });

  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({ error: 'Erro ao limpar notificações' });
  }
};

export const getAlertStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    //  BYPASS: Super Admin
    if (req.user.role === 'SUPER_ADMIN' || !req.user.companyId) {
      res.json({
        productsInAnalysis: 0,
        rejectedProducts: 0,
        delayedTransports: 0,
        stagnantProducts: 0,
        totalAlerts: 0
      });
      return;
    }

    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const [
      productsInAnalysisCount,
      rejectedProductsCount,
      delayedTransportsCount,
      stagnantProductsCount
    ] = await Promise.all([
      prisma.product.count({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.IN_ANALYSIS,
          lastMovedAt: { lt: fortyEightHoursAgo }
        }
      }),
      prisma.product.count({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.REJECTED
        }
      }),
      prisma.transport.count({
        where: {
          companyId: req.user.companyId,
          status: { in: [TransportStatus.PENDING, TransportStatus.IN_TRANSIT] },
          expectedDate: { lt: now }
        }
      }),
      prisma.product.count({
        where: {
          companyId: req.user.companyId,
          status: ProductStatus.IN_STORAGE,
          lastMovedAt: {
            lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    res.json({
      productsInAnalysis: productsInAnalysisCount,
      rejectedProducts: rejectedProductsCount,
      delayedTransports: delayedTransportsCount,
      stagnantProducts: stagnantProductsCount,
      totalAlerts: productsInAnalysisCount + rejectedProductsCount + delayedTransportsCount + stagnantProductsCount
    });

  } catch (error) {
    console.error('Get alert stats error:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas de alertas' });
  }
};