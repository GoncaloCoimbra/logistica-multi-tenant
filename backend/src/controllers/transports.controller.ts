import { Request, Response } from 'express';
import { PrismaClient, TransportStatus, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

type PrismaTransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export const listTransports = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { status, vehicleId, dateFrom, dateTo } = req.query;

    const where: any = {
      companyId: req.user.companyId,
    };

    if (status && Object.values(TransportStatus).includes(status as TransportStatus)) {
      where.status = status as TransportStatus;
    }

    if (vehicleId) {
      where.vehicleId = vehicleId as string;
    }

    if (dateFrom || dateTo) {
      where.expectedDate = {};
      if (dateFrom) where.expectedDate.gte = new Date(dateFrom as string);
      if (dateTo) {
        const endDate = new Date(dateTo as string);
        endDate.setHours(23, 59, 59, 999);
        where.expectedDate.lte = endDate;
      }
    }

    const transports = await prisma.transport.findMany({
      where,
      include: {
        vehicle: true,
        products: {
          include: {
            product: {
              select: {
                id: true,
                internalCode: true,
                description: true,
                quantity: true,
                unit: true
              }
            }
          }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { expectedDate: 'desc' },
    });

    res.json(transports);
  } catch (error) {
    console.error('List transports error:', error);
    res.status(500).json({ error: 'Erro ao listar transportes' });
  }
};

export const getTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;

    const transport = await prisma.transport.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        vehicle: true,
        products: {
          include: {
            product: {
              include: {
                supplier: true
              }
            }
          }
        }
      },
    });

    if (!transport) {
      res.status(404).json({ error: 'Transporte não encontrado' });
      return;
    }

    res.json(transport);
  } catch (error) {
    console.error('Get transport error:', error);
    res.status(500).json({ error: 'Erro ao obter transporte' });
  }
};

export const createTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { 
      origin, 
      destination, 
      expectedDate,         
      departureDate,       
      estimatedArrival,     
      driver, 
      vehicleId, 
      productIds,
      totalWeight,          
      notes,                
      status
    } = req.body;

    
    const finalExpectedDate = expectedDate || departureDate;

    if (!origin || !destination || !finalExpectedDate) {
      res.status(400).json({
        error: 'Campos obrigatórios: Origem, Destino e Data de Partida',
      });
      return;
    }

    const expectedDateObj = new Date(finalExpectedDate);
    if (isNaN(expectedDateObj.getTime())) {
      res.status(400).json({ error: 'Data inválida' });
      return;
    }

    
    const estimatedArrivalObj = estimatedArrival ? new Date(estimatedArrival) : null;

    if (vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: {
          id: vehicleId,
          companyId: req.user.companyId,
        },
      });

      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      if (productIds && Array.isArray(productIds) && productIds.length > 0) {
        const products = await prisma.product.findMany({
          where: {
            id: { in: productIds },
            companyId: req.user.companyId,
          },
        });

        const totalProductWeight = products.reduce((sum, p) => sum + (p.totalWeight || 0), 0);
        
        if (totalProductWeight > vehicle.capacity) {
          res.status(400).json({
            error: `Capacidade do veículo excedida. Capacidade: ${vehicle.capacity}kg, Peso total: ${totalProductWeight}kg`,
          });
          return;
        }
      }
    }

    const transport = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const createdTransport = await tx.transport.create({
        data: {
          origin: origin.trim(),
          destination: destination.trim(),
          expectedDate: expectedDateObj,
          departureDate: expectedDateObj,              
          estimatedArrival: estimatedArrivalObj,       
          driver: driver?.trim(),
          vehicleId: vehicleId || null,
          status: (status as TransportStatus) || TransportStatus.PENDING,
          totalWeight: totalWeight ? parseFloat(totalWeight) : null,  
          notes: notes?.trim(),                       
          companyId: req.user!.companyId,
        },
      });

      if (productIds && Array.isArray(productIds) && productIds.length > 0) {
        const transportProducts = productIds.map((productId: string) => ({
          transportId: createdTransport.id,
          productId,
        }));

        await tx.transportProduct.createMany({
          data: transportProducts,
        });

        await tx.product.updateMany({
          where: {
            id: { in: productIds },
            companyId: req.user!.companyId,
          },
          data: {
            status: ProductStatus.IN_SHIPPING,
            lastMovedAt: new Date(),
          },
        });

        for (const productId of productIds) {
          await tx.productMovement.create({
            data: {
              productId,
              previousStatus: ProductStatus.IN_PREPARATION,
              newStatus: ProductStatus.IN_SHIPPING,
              quantity: 0,
              reason: `Associado ao transporte ${createdTransport.id}`,
              userId: req.user!.userId,
            },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          entity: 'Transport',
          entityId: createdTransport.id,
          userId: req.user!.userId,
          companyId: req.user!.companyId,
        },
      });

      return createdTransport;
    });

    const fullTransport = await prisma.transport.findUnique({
      where: { id: transport.id },
      include: {
        vehicle: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });

    res.status(201).json(fullTransport);
  } catch (error) {
    console.error('Create transport error:', error);
    res.status(500).json({ error: 'Erro ao criar transporte' });
  }
};

export const updateTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;
    const { 
      origin, 
      destination, 
      expectedDate,
      departureDate,        
      estimatedArrival,    
      driver, 
      vehicleId, 
      status,
      totalWeight,          
      notes                
    } = req.body;

    const existingTransport = await prisma.transport.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!existingTransport) {
      res.status(404).json({ error: 'Transporte não encontrado' });
      return;
    }

    const dataToUpdate: any = {};

    if (origin !== undefined) dataToUpdate.origin = origin.trim();
    if (destination !== undefined) dataToUpdate.destination = destination.trim();
    if (driver !== undefined) dataToUpdate.driver = driver?.trim();
    if (vehicleId !== undefined) dataToUpdate.vehicleId = vehicleId;
    if (totalWeight !== undefined) dataToUpdate.totalWeight = totalWeight ? parseFloat(totalWeight) : null;
    if (notes !== undefined) dataToUpdate.notes = notes?.trim();
    
    if (expectedDate !== undefined || departureDate !== undefined) {
      const dateToUse = expectedDate || departureDate;
      const expectedDateObj = new Date(dateToUse);
      if (isNaN(expectedDateObj.getTime())) {
        res.status(400).json({ error: 'Data inválida' });
        return;
      }
      dataToUpdate.expectedDate = expectedDateObj;
      dataToUpdate.departureDate = expectedDateObj;
    }

    if (estimatedArrival !== undefined) {
      const estimatedArrivalObj = new Date(estimatedArrival);
      if (!isNaN(estimatedArrivalObj.getTime())) {
        dataToUpdate.estimatedArrival = estimatedArrivalObj;
      }
    }

    if (status !== undefined) {
      if (!Object.values(TransportStatus).includes(status as TransportStatus)) {
        res.status(400).json({ error: 'Status inválido' });
        return;
      }
      dataToUpdate.status = status as TransportStatus;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      return;
    }

    const updatedTransport = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const transport = await tx.transport.update({
        where: { id },
        data: dataToUpdate,
        include: {
          vehicle: true,
          products: {
            include: {
              product: true
            }
          }
        },
      });

      if (status === TransportStatus.DELIVERED && existingTransport.status !== TransportStatus.DELIVERED) {
        const transportProducts = await tx.transportProduct.findMany({
          where: { transportId: id }
        });

        const productIds = transportProducts.map(tp => tp.productId);

        await tx.product.updateMany({
          where: {
            id: { in: productIds }
          },
          data: {
            status: ProductStatus.DELIVERED,
            shippedAt: new Date(),
            lastMovedAt: new Date(),
          }
        });

        for (const productId of productIds) {
          await tx.productMovement.create({
            data: {
              productId,
              previousStatus: ProductStatus.IN_SHIPPING,
              newStatus: ProductStatus.DELIVERED,
              quantity: 0,
              reason: `Transporte ${id} entregue`,
              userId: req.user!.userId,
            },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          action: 'UPDATE',
          entity: 'Transport',
          entityId: transport.id,
          userId: req.user!.userId,
          companyId: req.user!.companyId,
        },
      });

      return transport;
    });

    res.json(updatedTransport);
  } catch (error) {
    console.error('Update transport error:', error);
    res.status(500).json({ error: 'Erro ao atualizar transporte' });
  }
};

export const deleteTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;

    const existingTransport = await prisma.transport.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!existingTransport) {
      res.status(404).json({ error: 'Transporte não encontrado' });
      return;
    }

    if (existingTransport.status === TransportStatus.IN_TRANSIT) {
      res.status(409).json({
        error: 'Não é possível eliminar transporte em trânsito'
      });
      return;
    }

    await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      await tx.transport.delete({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          action: 'DELETE',
          entity: 'Transport',
          entityId: id,
          userId: req.user!.userId,
          companyId: req.user!.companyId,
        },
      });
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Delete transport error:', error);
    res.status(500).json({ error: 'Erro ao eliminar transporte' });
  }
};

export const addProductsToTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      res.status(400).json({ error: 'Lista de produtos é obrigatória' });
      return;
    }

    const transport = await prisma.transport.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        vehicle: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });

    if (!transport) {
      res.status(404).json({ error: 'Transporte não encontrado' });
      return;
    }

    if (transport.status === TransportStatus.DELIVERED || transport.status === TransportStatus.CANCELLED) {
      res.status(400).json({ error: 'Não é possível adicionar produtos a um transporte finalizado' });
      return;
    }

    if (transport.vehicle) {
      const newProducts = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          companyId: req.user.companyId,
        },
      });

      const currentWeight = transport.products.reduce((sum, tp) => 
        sum + (tp.product.totalWeight || 0), 0
      );
      const additionalWeight = newProducts.reduce((sum, p) => sum + (p.totalWeight || 0), 0);
      const totalWeight = currentWeight + additionalWeight;

      if (totalWeight > transport.vehicle.capacity) {
        res.status(400).json({
          error: `Capacidade do veículo excedida. Disponível: ${transport.vehicle.capacity - currentWeight}kg`,
        });
        return;
      }
    }

    await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const transportProducts = productIds.map((productId: string) => ({
        transportId: id,
        productId,
      }));

      await tx.transportProduct.createMany({
        data: transportProducts,
        skipDuplicates: true,
      });

      await tx.product.updateMany({
        where: {
          id: { in: productIds },
        },
        data: {
          status: ProductStatus.IN_SHIPPING,
          lastMovedAt: new Date(),
        },
      });

      for (const productId of productIds) {
        await tx.productMovement.create({
          data: {
            productId,
            newStatus: ProductStatus.IN_SHIPPING,
            quantity: 0,
            reason: `Adicionado ao transporte ${id}`,
            userId: req.user!.userId,
          },
        });
      }
    });

    const updatedTransport = await prisma.transport.findUnique({
      where: { id },
      include: {
        vehicle: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(updatedTransport);
  } catch (error) {
    console.error('Add products to transport error:', error);
    res.status(500).json({ error: 'Erro ao adicionar produtos ao transporte' });
  }
};