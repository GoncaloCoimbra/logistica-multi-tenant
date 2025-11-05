import { Request, Response } from 'express';
import { ProductStatus } from '@prisma/client';
import prisma from '../config/database';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const companyId = req.user.companyId;

     
    const totalProducts = await prisma.product.count({
      where: { companyId }
    });

     
    const productsByStatus = await prisma.product.groupBy({
      by: ['status'],
      where: { companyId },
      _count: {
        id: true
      }
    });

     
    const statusData = productsByStatus.map(item => ({
      status: item.status,
      count: item._count.id
    }));

    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMovements = await prisma.productMovement.count({
      where: {
        product: {
          companyId
        },
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

     
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const movementsByDay = await prisma.productMovement.groupBy({
      by: ['createdAt'],
      where: {
        product: {
          companyId
        },
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: {
        id: true
      }
    });

    const receivedCount = await prisma.product.count({
      where: {
        companyId,
        status: ProductStatus.RECEIVED
      }
    });

    const inAnalysisCount = await prisma.product.count({
      where: {
        companyId,
        status: ProductStatus.IN_ANALYSIS
      }
    });

    const inStorageCount = await prisma.product.count({
      where: {
        companyId,
        status: ProductStatus.IN_STORAGE
      }
    });

    const deliveredCount = await prisma.product.count({
      where: {
        companyId,
        status: ProductStatus.DELIVERED
      }
    });

    
    const topSuppliers = await prisma.supplier.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      },
      take: 5
    });

    
    const rejectedCount = await prisma.product.count({
      where: {
        companyId,
        status: ProductStatus.REJECTED
      }
    });

    
    const percentages = {
      received: totalProducts > 0 ? ((receivedCount / totalProducts) * 100).toFixed(1) : 0,
      inStorage: totalProducts > 0 ? ((inStorageCount / totalProducts) * 100).toFixed(1) : 0,
      delivered: totalProducts > 0 ? ((deliveredCount / totalProducts) * 100).toFixed(1) : 0,
      rejected: totalProducts > 0 ? ((rejectedCount / totalProducts) * 100).toFixed(1) : 0
    };

    res.json({
      totalProducts,
      productsByStatus: statusData,
      recentMovements,
      movementsByDay: movementsByDay.map(m => ({
        date: m.createdAt,
        count: m._count.id
      })),
      summary: {
        received: receivedCount,
        inAnalysis: inAnalysisCount,
        inStorage: inStorageCount,
        delivered: deliveredCount,
        rejected: rejectedCount
      },
      percentages,
      topSuppliers: topSuppliers.map(s => ({
        id: s.id,
        name: s.name,
        productCount: s._count.products
      }))
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};