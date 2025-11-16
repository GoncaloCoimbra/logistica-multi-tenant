import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type PrismaTransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export const listVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        companyId: req.user.companyId,
      },
      include: {
        _count: {
          select: { transports: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(vehicles);
  } catch (error) {
    console.error('List vehicles error:', error);
    res.status(500).json({ error: 'Erro ao listar veículos' });
  }
};

export const getVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        transports: {
          include: {
            products: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
    });

    if (!vehicle) {
      res.status(404).json({ error: 'Veículo não encontrado' });
      return;
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ error: 'Erro ao obter veículo' });
  }
};

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { 
      licensePlate, 
      model,       
      brand,       
      type, 
      capacity, 
      year, 
      observations,
      status        
    } = req.body;

    // Validações básicas
    if (!licensePlate || !type || !capacity) {
      res.status(400).json({
        error: 'Campos obrigatórios: Matrícula, Tipo e Capacidade',
      });
      return;
    }

    const capacityNum = parseFloat(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      res.status(400).json({ error: 'Capacidade inválida' });
      return;
    }

    const yearNum = year ? parseInt(year) : null;
    if (year && (isNaN(yearNum!) || yearNum! < 1900 || yearNum! > new Date().getFullYear() + 1)) {
      res.status(400).json({ error: 'Ano inválido' });
      return;
    }

    // Verificar se já existe veículo com essa placa
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        licensePlate: licensePlate.trim().toUpperCase(),
        companyId: req.user.companyId,
      },
    });

    if (existingVehicle) {
      res.status(409).json({
        error: `Matrícula '${licensePlate}' já existe para a sua empresa`,
      });
      return;
    }

    const vehicle = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const createdVehicle = await tx.vehicle.create({
        data: {
          licensePlate: licensePlate.trim().toUpperCase(),
          model: model?.trim() || null,          
          brand: brand?.trim() || null,           
          type: type.trim(),
          capacity: capacityNum,
          year: yearNum,
          status: status || 'available',          
          observations: observations?.trim(),
          companyId: req.user!.companyId,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          entity: 'Vehicle',
          entityId: createdVehicle.id,
          userId: req.user!.userId,
          companyId: req.user!.companyId,
        },
      });

      return createdVehicle;
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ error: 'Erro ao criar veículo' });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;
    const { 
      licensePlate, 
      model,        
      brand,        
      type, 
      capacity, 
      year, 
      observations,
      status       
    } = req.body;

    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!existingVehicle) {
      res.status(404).json({ error: 'Veículo não encontrado' });
      return;
    }

    const dataToUpdate: any = {};

    if (licensePlate !== undefined) {
      dataToUpdate.licensePlate = licensePlate.trim().toUpperCase();
    }
    if (model !== undefined) dataToUpdate.model = model?.trim();           
    if (brand !== undefined) dataToUpdate.brand = brand?.trim();           
    if (type !== undefined) dataToUpdate.type = type.trim();
    if (status !== undefined) dataToUpdate.status = status;                
    
    if (capacity !== undefined) {
      const capacityNum = parseFloat(capacity);
      if (isNaN(capacityNum) || capacityNum <= 0) {
        res.status(400).json({ error: 'Capacidade inválida' });
        return;
      }
      dataToUpdate.capacity = capacityNum;
    }
    if (year !== undefined) {
      const yearNum = parseInt(year);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
        res.status(400).json({ error: 'Ano inválido' });
        return;
      }
      dataToUpdate.year = yearNum;
    }
    if (observations !== undefined) dataToUpdate.observations = observations?.trim();

    if (Object.keys(dataToUpdate).length === 0) {
      res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      return;
    }

    const updatedVehicle = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const vehicle = await tx.vehicle.update({
        where: { id },
        data: dataToUpdate,
      });

      await tx.auditLog.create({
        data: {
          action: 'UPDATE',
          entity: 'Vehicle',
          entityId: vehicle.id,
          userId: req.user!.userId,
          companyId: req.user!.companyId,
        },
      });

      return vehicle;
    });

    res.json(updatedVehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Erro ao atualizar veículo' });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;

    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        transports: {
          where: {
            status: {
              in: ['PENDING', 'IN_TRANSIT']
            }
          }
        }
      }
    });

    if (!existingVehicle) {
      res.status(404).json({ error: 'Veículo não encontrado' });
      return;
    }

    if (existingVehicle.transports.length > 0) {
      res.status(409).json({
        error: 'Não é possível eliminar veículo com transportes ativos'
      });
      return;
    }

    await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      await tx.vehicle.delete({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          action: 'DELETE',
          entity: 'Vehicle',
          entityId: id,
          userId: req.user!.userId,
          companyId: req.user!.companyId,
        },
      });
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Erro ao eliminar veículo' });
  }
};

export const getVehicleStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!vehicle) {
      res.status(404).json({ error: 'Veículo não encontrado' });
      return;
    }

    const [totalTransports, activeTransports, completedTransports] = await Promise.all([
      prisma.transport.count({
        where: { vehicleId: id }
      }),
      prisma.transport.count({
        where: { 
          vehicleId: id,
          status: { in: ['PENDING', 'IN_TRANSIT'] }
        }
      }),
      prisma.transport.count({
        where: { 
          vehicleId: id,
          status: 'DELIVERED'
        }
      })
    ]);

    res.json({
      vehicleId: id,
      totalTransports,
      activeTransports,
      completedTransports,
      utilizationRate: totalTransports > 0 
        ? ((completedTransports / totalTransports) * 100).toFixed(2) 
        : '0.00'
    });

  } catch (error) {
    console.error('Get vehicle stats error:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas do veículo' });
  }
};