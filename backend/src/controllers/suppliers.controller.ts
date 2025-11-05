 //backend/src/controllers/suppliers.controller.ts
import { Request, Response } from 'express';
import prisma from '../../prisma/client';


export const listSuppliers = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });

    const suppliers = await prisma.supplier.findMany({
      where: { companyId: req.user.companyId },
      orderBy: { name: 'asc' },
    });
    res.json(suppliers);
  } catch (error) {
    console.error('List suppliers error:', error);
    res.status(500).json({ error: 'Erro ao listar fornecedores' });
  }
};

export const getSupplier = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
    const { id } = req.params;

    const supplier = await prisma.supplier.findFirst({
      where: { id, companyId: req.user.companyId },
    });
    if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json(supplier);
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ error: 'Erro ao obter fornecedor' });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
    const { name, nif, address, email, phone } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

    const created = await prisma.supplier.create({
      data: {
        name,
        nif,
        address,
        email,
        phone,
        companyId: req.user.companyId,
      },
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ error: 'Erro ao criar fornecedor' });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
    const { id } = req.params;
    const { name, nif, address, email, phone } = req.body;

    const existing = await prisma.supplier.findFirst({ where: { id, companyId: req.user.companyId }});
    if (!existing) return res.status(404).json({ error: 'Fornecedor não encontrado' });

    const updated = await prisma.supplier.update({
      where: { id },
      data: { name, nif, address, email, phone },
    });
    res.json(updated);
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
    const { id } = req.params;

    const existing = await prisma.supplier.findFirst({ where: { id, companyId: req.user.companyId }});
    if (!existing) return res.status(404).json({ error: 'Fornecedor não encontrado' });

     
    const productsCount = await prisma.product.count({ where: { supplierId: id }});
    if (productsCount > 0) {
      return res.status(409).json({ error: 'Existem produtos associados a este fornecedor' });
    }

    await prisma.supplier.delete({ where: { id }});
    res.status(204).send();
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ error: 'Erro ao eliminar fornecedor' });
  }
};
