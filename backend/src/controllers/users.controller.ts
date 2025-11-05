import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

export const createUser = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const requestUserRole = req.user?.role;
    const { name, email, password, role } = req.body;

    if (!companyId || !requestUserRole) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (requestUserRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem criar utilizadores' });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Campos obrigatórios em falta' });
    }

    if (!['ADMIN', 'OPERATOR'].includes(role)) {
      return res.status(400).json({ message: 'Role inválida' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    res.status(500).json({ message: 'Erro ao criar utilizador' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const requestUserRole = req.user?.role;
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    if (!companyId || !requestUserRole) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (requestUserRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem editar utilizadores' });
    }

    const user = await prisma.user.findFirst({
      where: { id, companyId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && ['ADMIN', 'OPERATOR'].includes(role)) updateData.role = role;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar utilizador:', error);
    res.status(500).json({ message: 'Erro ao atualizar utilizador' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const requestUserRole = req.user?.role;
    const requestUserId = req.user?.userId;
    const { id } = req.params;

    if (!companyId || !requestUserRole || !requestUserId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (requestUserRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem eliminar utilizadores' });
    }

    if (id === requestUserId) {
      return res.status(400).json({ message: 'Não pode eliminar a sua própria conta' });
    }

    const user = await prisma.user.findFirst({
      where: { id, companyId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: 'Utilizador eliminado com sucesso' });
  } catch (error) {
    console.error('Erro ao eliminar utilizador:', error);
    res.status(500).json({ message: 'Erro ao eliminar utilizador' });
  }
};