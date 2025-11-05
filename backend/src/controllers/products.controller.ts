 //backend/src/controllers/products.controller.ts
import { Request, Response } from 'express';
import { ProductStatus, Role, PrismaClient } from '@prisma/client';
import { ProductStateService } from '../services/product-state.service';

import prisma from '../config/database';


type PrismaTransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;



export const listProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { status, search, supplier, location, dateFrom, dateTo } = req.query;

    const where: any = {
      companyId: req.user.companyId,
    };

     
    if (status && typeof status === 'string') {
      if (Object.values(ProductStatus).includes(status as ProductStatus)) {
        where.status = status as ProductStatus;
      } else {
        res.status(400).json({ error: 'Status inválido' });
        return;
      }
    }

    
    if (search) {
      const searchString = search as string;
      where.OR = [
        { internalCode: { contains: searchString, mode: 'insensitive' } },
        { description: { contains: searchString, mode: 'insensitive' } },
      ];
    }

     
    if (supplier && typeof supplier === 'string') {
      where.supplier = {
        name: {
          contains: supplier,
          mode: 'insensitive'
        }
      };
    }

    
    if (location && typeof location === 'string') {
      where.currentLocation = {
        contains: location,
        mode: 'insensitive'
      };
    }

     
    if (dateFrom || dateTo) {
      where.createdAt = {};
      
      if (dateFrom && typeof dateFrom === 'string') {
        where.createdAt.gte = new Date(dateFrom);
      }
      
      if (dateTo && typeof dateTo === 'string') {
         //Adiciona 23:59:59 para incluir o dia inteiro
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDate;
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            nif: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        supplier: true,
        movements: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Erro ao obter produto' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }

    const user = req.user;
    const {
      internalCode,
      description,
      quantity,
      unit,
      totalWeight,
      totalVolume,
      currentLocation,
      supplierId,
      supplierName,
      observations,
    } = req.body;

    if (!internalCode || !description || !quantity || !unit) {
      res.status(400).json({
        error: "Campos obrigatórios: Código Interno, Descrição, Quantidade e Unidade.",
      });
      return;
    }

     
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      res.status(400).json({ error: "Quantidade inválida ou menor que 1" });
      return;
    }

    const totalWeightNum = totalWeight ? parseFloat(totalWeight) : null;
    if (totalWeight && isNaN(totalWeightNum!)) {
      res.status(400).json({ error: "Peso total inválido" });
      return;
    }

    const totalVolumeNum = totalVolume ? parseFloat(totalVolume) : null;
    if (totalVolume && isNaN(totalVolumeNum!)) {
      res.status(400).json({ error: "Volume total inválido" });
      return;
    }

     // Novo: resolver o fornecedor (por ID ou nome)
    let resolvedSupplierId = supplierId || null;

    if (!resolvedSupplierId && supplierName) {
      const supplier = await prisma.supplier.findFirst({
        where: {
          name: supplierName,
          companyId: user.companyId,
        },
      });

      if (!supplier) {
        res.status(404).json({
          error: `Fornecedor '${supplierName}' não encontrado para esta empresa.`,
        });
        return;
      }

      resolvedSupplierId = supplier.id;
    }

     
    const existingProduct = await prisma.product.findFirst({
      where: {
        internalCode,
        companyId: user.companyId,
      },
    });

    if (existingProduct) {
      res
        .status(409)
        .json({ error: `O Código Interno '${internalCode}' já existe para a sua empresa` });
      return;
    }

     
    const product = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const createdProduct = await tx.product.create({
        data: {
          internalCode: internalCode.trim(),
          description: description.trim(),
          quantity: quantityNum,
          unit: unit.trim(),
          totalWeight: totalWeightNum,
          totalVolume: totalVolumeNum,
          currentLocation: currentLocation?.trim() || "Localização não definida",
          supplierId: resolvedSupplierId,
          observations,
          status: ProductStatus.RECEIVED,
          companyId: user.companyId,
        },
        include: {
          supplier: true,
        },
      });

      await tx.productMovement.create({
        data: {
          productId: createdProduct.id,
          newStatus: ProductStatus.RECEIVED,
          quantity: createdProduct.quantity,
          location: createdProduct.currentLocation,
          reason: "Produto criado e recebido no sistema.",
          userId: user.userId,
        },
      });

      await tx.auditLog.create({
        data: {
          action: "CREATE",
          entity: "Product",
          entityId: createdProduct.id,
          userId: user.userId,
          companyId: user.companyId,
        },
      });

      return createdProduct;
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }
    const user = req.user;

    const { id } = req.params;

    const {
      internalCode,
      description,
      quantity,
      unit,
      totalWeight,
      totalVolume,
      currentLocation,
      supplierId,
      observations,
    } = req.body;

    const dataToUpdate: any = {};

    if (internalCode !== undefined) dataToUpdate.internalCode = internalCode;
    if (description !== undefined) dataToUpdate.description = description;
    if (unit !== undefined) dataToUpdate.unit = unit;
    if (totalWeight !== undefined) {
      const totalWeightNum = parseFloat(totalWeight);
      if (isNaN(totalWeightNum)) {
         res.status(400).json({ error: 'Peso total inválido' });
         return;
      }
      dataToUpdate.totalWeight = totalWeightNum;
    }
    if (totalVolume !== undefined) {
       const totalVolumeNum = parseFloat(totalVolume);
       if (isNaN(totalVolumeNum)) {
         res.status(400).json({ error: 'Volume total inválido' });
         return;
       }
      dataToUpdate.totalVolume = totalVolumeNum;
    }
     if (quantity !== undefined) {
       const quantityNum = parseFloat(quantity);
       if (isNaN(quantityNum)) {
         res.status(400).json({ error: 'Quantidade inválida' });
         return;
       }
      dataToUpdate.quantity = quantityNum;
    }
    if (currentLocation !== undefined) dataToUpdate.currentLocation = currentLocation;
    if (supplierId !== undefined) dataToUpdate.supplierId = supplierId;
    if (observations !== undefined) dataToUpdate.observations = observations;

    if (Object.keys(dataToUpdate).length === 0) {
      res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      return;
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    const updatedProduct = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const product = await tx.product.update({
        where: { id },
        data: dataToUpdate,
        include: {
          supplier: true,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'UPDATE',
          entity: 'Product',
          entityId: product.id,
          userId: user.userId,
          companyId: user.companyId,
        },
      });

      return product;
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }
    const user = req.user;

    const { id } = req.params;

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      await tx.product.delete({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          action: 'DELETE',
          entity: 'Product',
          entityId: id,
          userId: user.userId,
          companyId: user.companyId,
        },
      });
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Delete product error:', error);
    
    if (error?.code === 'P2003') {
      res.status(409).json({ error: 'Não é possível eliminar o produto pois existem movimentos associados.' });
      return;
    }
    
    res.status(500).json({ error: 'Erro ao eliminar produto' });
  }
};

 

export const changeProductStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }
    const user = req.user;

    const { id } = req.params;
    const { newStatus, reason, location } = req.body;

    if (!newStatus) {
      res.status(400).json({ error: 'Novo status é obrigatório' });
      return;
    }

    if (!Object.values(ProductStatus).includes(newStatus as ProductStatus)) {
      res.status(400).json({ 
        error: 'Status inválido',
        validStatuses: Object.values(ProductStatus)
      });
      return;
    }

    const targetStatus = newStatus as ProductStatus;

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    const currentStatus = existingProduct.status;

    if (currentStatus === targetStatus) {
      res.status(400).json({ error: 'Produto já se encontra neste status' });
      return;
    }

    if (!ProductStateService.isTransitionAllowed(currentStatus, targetStatus)) {
      const allowedStates = ProductStateService.getNextPossibleStates(currentStatus);
      res.status(400).json({
        error: 'Transição não permitida',
        currentStatus,
        attemptedStatus: targetStatus,
        allowedNextStates: allowedStates
      });
      return;
    }

    const permissionCheck = ProductStateService.canUserMakeTransition(
      currentStatus,
      targetStatus,
      user.role as Role
    );

    if (!permissionCheck.allowed) {
      res.status(403).json({
        error: 'Permissão negada',
        reason: permissionCheck.reason
      });
      return;
    }

    const fieldsValidation = ProductStateService.validateRequiredFields(
      currentStatus,
      targetStatus,
      { reason, location }
    );

    if (!fieldsValidation.valid) {
      res.status(400).json({
        error: 'Campos obrigatórios em falta',
        missingFields: fieldsValidation.missingFields
      });
      return;
    }

    const updatedProduct = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const product = await tx.product.update({
        where: { id },
        data: {
          status: targetStatus,
          currentLocation: location || existingProduct.currentLocation,
          lastMovedAt: new Date(),
          ...(targetStatus === ProductStatus.DELIVERED || targetStatus === ProductStatus.ELIMINATED
            ? { shippedAt: new Date() }
            : {})
        },
        include: {
          supplier: true,
        },
      });

      await tx.productMovement.create({
        data: {
          productId: product.id,
          previousStatus: currentStatus,
          newStatus: targetStatus,
          quantity: product.quantity,
          location: location || existingProduct.currentLocation,
          reason: reason || `Mudança de status: ${currentStatus} → ${targetStatus}`,
          userId: user.userId,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'STATUS_CHANGE',
          entity: 'Product',
          entityId: product.id,
          userId: user.userId,
          companyId: user.companyId,
        },
      });

      return product;
    });

    res.json({
      message: 'Status alterado com sucesso',
      product: updatedProduct,
      transition: {
        from: currentStatus,
        to: targetStatus
      }
    });

  } catch (error) {
    console.error('Change product status error:', error);
    res.status(500).json({ error: 'Erro ao mudar status do produto' });
  }
};

export const getNextStates = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    const currentStatus = product.status;
    const nextStates = ProductStateService.getNextPossibleStates(currentStatus);

    res.json({
      currentStatus,
      nextPossibleStates: nextStates,
      isFinalState: ProductStateService.isFinalState(currentStatus)
    });

  } catch (error) {
    console.error('Get next states error:', error);
    res.status(500).json({ error: 'Erro ao buscar próximos estados' });
  }
};

export const getProductHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    const movements = await prisma.productMovement.findMany({
      where: {
        productId: id,
      },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(movements);

  } catch (error) {
    console.error('Get product history error:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico do produto' });
  }
};