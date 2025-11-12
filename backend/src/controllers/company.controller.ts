import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Obter informações da empresa do utilizador autenticado
 */
export const getCompanyInfo = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        nif: true,
        address: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            users: true,
            products: true,
            suppliers: true,
            transports: true,
            vehicles: true,
          }
        }
      }
    });

    if (!company) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    res.json(company);
  } catch (error) {
    console.error('Erro ao obter informações da empresa:', error);
    res.status(500).json({ message: 'Erro ao obter informações da empresa' });
  }
};

/**
 * Atualizar informações da empresa (apenas ADMIN)
 */
export const updateCompanyInfo = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const requestUserRole = req.user?.role;
    const { name, address, email, phone } = req.body;

    if (!companyId || !requestUserRole) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (requestUserRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem atualizar a empresa' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: updateData,
      select: {
        id: true,
        name: true,
        nif: true,
        address: true,
        email: true,
        phone: true,
        updatedAt: true,
      }
    });

    res.json(company);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ message: 'Erro ao atualizar empresa' });
  }
};

/**
 * Obter estatísticas gerais da empresa
 */
export const getCompanyStats = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const [
      totalUsers,
      totalProducts,
      totalSuppliers,
      totalTransports,
      totalVehicles,
      adminCount,
      operatorCount
    ] = await Promise.all([
      prisma.user.count({ where: { companyId } }),
      prisma.product.count({ where: { companyId } }),
      prisma.supplier.count({ where: { companyId } }),
      prisma.transport.count({ where: { companyId } }),
      prisma.vehicle.count({ where: { companyId } }),
      prisma.user.count({ where: { companyId, role: 'ADMIN' } }),
      prisma.user.count({ where: { companyId, role: 'OPERATOR' } }),
    ]);

    res.json({
      users: {
        total: totalUsers,
        admins: adminCount,
        operators: operatorCount,
      },
      products: totalProducts,
      suppliers: totalSuppliers,
      transports: totalTransports,
      vehicles: totalVehicles,
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas da empresa:', error);
    res.status(500).json({ message: 'Erro ao obter estatísticas' });
  }
};