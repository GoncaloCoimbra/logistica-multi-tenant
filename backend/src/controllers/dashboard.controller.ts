import { Request, Response } from 'express';
import { ProductStatus, TransportStatus } from '@prisma/client';
import prisma from '../config/database';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const companyId = req.user.companyId;
    
   
    const { period = '30d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

  
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

    
    const recentMovements = await prisma.productMovement.count({
      where: {
        product: {
          companyId
        },
        createdAt: {
          gte: startDate
        }
      }
    });

   
    const movementsByDay = await prisma.$queryRaw<Array<{date: Date, count: bigint}>>`
      SELECT 
        DATE(pm."createdAt") as date,
        COUNT(*)::int as count
      FROM "ProductMovement" pm
      INNER JOIN "Product" p ON p.id = pm."productId"
      WHERE p."companyId" = ${companyId}
        AND pm."createdAt" >= ${startDate}
      GROUP BY DATE(pm."createdAt")
      ORDER BY date ASC
    `;

    
    const productsCreatedByDay = await prisma.$queryRaw<Array<{date: Date, count: bigint}>>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as count
      FROM "Product"
      WHERE "companyId" = ${companyId}
        AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // ✅ CORREÇÃO: Cast explícito do enum para text
    const deliveredByDay = await prisma.$queryRaw<Array<{date: Date, count: bigint}>>`
      SELECT 
        DATE(pm."createdAt") as date,
        COUNT(*)::int as count
      FROM "ProductMovement" pm
      INNER JOIN "Product" p ON p.id = pm."productId"
      WHERE p."companyId" = ${companyId}
        AND pm."newStatus"::text = ${ProductStatus.DELIVERED}
        AND pm."createdAt" >= ${startDate}
      GROUP BY DATE(pm."createdAt")
      ORDER BY date ASC
    `;

    
    const [receivedCount, inAnalysisCount, inStorageCount, deliveredCount, rejectedCount] = await Promise.all([
      prisma.product.count({ where: { companyId, status: ProductStatus.RECEIVED } }),
      prisma.product.count({ where: { companyId, status: ProductStatus.IN_ANALYSIS } }),
      prisma.product.count({ where: { companyId, status: ProductStatus.IN_STORAGE } }),
      prisma.product.count({ where: { companyId, status: ProductStatus.DELIVERED } }),
      prisma.product.count({ where: { companyId, status: ProductStatus.REJECTED } })
    ]);

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

   
    const [totalTransports, activeTransports, completedTransports] = await Promise.all([
      prisma.transport.count({ where: { companyId } }),
      prisma.transport.count({ 
        where: { 
          companyId, 
          status: { in: [TransportStatus.PENDING, TransportStatus.IN_TRANSIT] }
        } 
      }),
      prisma.transport.count({ 
        where: { 
          companyId, 
          status: TransportStatus.DELIVERED 
        } 
      })
    ]);

   
    const totalVehicles = await prisma.vehicle.count({ where: { companyId } });

    // ✅ CORREÇÃO: Cast explícito do enum para text
    const rejectionRateBySupplier = await prisma.$queryRaw<Array<{
      supplierId: string,
      supplierName: string,
      totalProducts: bigint,
      rejectedProducts: bigint,
      rejectionRate: number
    }>>`
      SELECT 
        s.id as "supplierId",
        s.name as "supplierName",
        COUNT(p.id)::int as "totalProducts",
        COUNT(CASE WHEN p.status::text = ${ProductStatus.REJECTED} THEN 1 END)::int as "rejectedProducts",
        CASE 
          WHEN COUNT(p.id) > 0 
          THEN ROUND((COUNT(CASE WHEN p.status::text = ${ProductStatus.REJECTED} THEN 1 END)::numeric / COUNT(p.id)::numeric * 100), 2)
          ELSE 0 
        END as "rejectionRate"
      FROM "Supplier" s
      LEFT JOIN "Product" p ON p."supplierId" = s.id
      WHERE s."companyId" = ${companyId}
      GROUP BY s.id, s.name
      HAVING COUNT(p.id) > 0
      ORDER BY "rejectionRate" DESC
      LIMIT 5
    `;

    
    const avgTimeInStatus = await prisma.$queryRaw<Array<{
      status: string,
      avgHours: number
    }>>`
      SELECT 
        pm."newStatus"::text as status,
        ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(pm2."createdAt", NOW()) - pm."createdAt")) / 3600), 2) as "avgHours"
      FROM "ProductMovement" pm
      INNER JOIN "Product" p ON p.id = pm."productId"
      LEFT JOIN "ProductMovement" pm2 ON pm2."productId" = pm."productId" 
        AND pm2."createdAt" > pm."createdAt"
        AND pm2.id = (
          SELECT id FROM "ProductMovement" 
          WHERE "productId" = pm."productId" 
            AND "createdAt" > pm."createdAt"
          ORDER BY "createdAt" ASC
          LIMIT 1
        )
      WHERE p."companyId" = ${companyId}
        AND pm."createdAt" >= ${startDate}
      GROUP BY pm."newStatus"
    `;

    
    const percentages = {
      received: totalProducts > 0 ? ((receivedCount / totalProducts) * 100).toFixed(1) : '0',
      inStorage: totalProducts > 0 ? ((inStorageCount / totalProducts) * 100).toFixed(1) : '0',
      delivered: totalProducts > 0 ? ((deliveredCount / totalProducts) * 100).toFixed(1) : '0',
      rejected: totalProducts > 0 ? ((rejectedCount / totalProducts) * 100).toFixed(1) : '0'
    };

    
    const previousStartDate = new Date(startDate);
    switch (period) {
      case '7d':
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        break;
      case '30d':
        previousStartDate.setDate(previousStartDate.getDate() - 30);
        break;
      case '90d':
        previousStartDate.setDate(previousStartDate.getDate() - 90);
        break;
      case '1y':
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
        break;
    }

    const previousPeriodProducts = await prisma.product.count({
      where: {
        companyId,
        createdAt: {
          gte: previousStartDate,
          lt: startDate
        }
      }
    });

    const previousPeriodDelivered = await prisma.product.count({
      where: {
        companyId,
        status: ProductStatus.DELIVERED,
        shippedAt: {
          gte: previousStartDate,
          lt: startDate
        }
      }
    });

    const currentPeriodProducts = await prisma.product.count({
      where: {
        companyId,
        createdAt: {
          gte: startDate
        }
      }
    });

    const currentPeriodDelivered = await prisma.product.count({
      where: {
        companyId,
        status: ProductStatus.DELIVERED,
        shippedAt: {
          gte: startDate
        }
      }
    });

    const productTrend = previousPeriodProducts > 0
      ? (((currentPeriodProducts - previousPeriodProducts) / previousPeriodProducts) * 100).toFixed(1)
      : '0';

    const deliveryTrend = previousPeriodDelivered > 0
      ? (((currentPeriodDelivered - previousPeriodDelivered) / previousPeriodDelivered) * 100).toFixed(1)
      : '0';

    res.json({
      period,
      totalProducts,
      productsByStatus: statusData,
      recentMovements,
      movementsByDay: movementsByDay.map(m => ({
        date: m.date,
        count: Number(m.count)
      })),
      productsCreatedByDay: productsCreatedByDay.map(p => ({
        date: p.date,
        count: Number(p.count)
      })),
      deliveredByDay: deliveredByDay.map(d => ({
        date: d.date,
        count: Number(d.count)
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
      })),
      transportStats: {
        total: totalTransports,
        active: activeTransports,
        completed: completedTransports
      },
      vehicleStats: {
        total: totalVehicles
      },
      rejectionRateBySupplier: rejectionRateBySupplier.map(r => ({
        supplierId: r.supplierId,
        supplierName: r.supplierName,
        totalProducts: Number(r.totalProducts),
        rejectedProducts: Number(r.rejectedProducts),
        rejectionRate: r.rejectionRate
      })),
      avgTimeInStatus: avgTimeInStatus.map(a => ({
        status: a.status,
        avgHours: a.avgHours
      })),
      trends: {
        products: productTrend,
        deliveries: deliveryTrend
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};