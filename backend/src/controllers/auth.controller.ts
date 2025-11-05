import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateToken, Role, MyJwtPayload } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email e password são obrigatórios' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role as Role,
    } as MyJwtPayload);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company?.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, companyName, companyNif, companyEmail } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Nome, email e password são obrigatórios' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'Email já está em uso' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!companyName || !companyNif || !companyEmail) {
      res.status(400).json({ error: 'Dados da empresa são obrigatórios' });
      return;
    }

    const company = await prisma.company.create({
      data: {
        name: companyName,
        nif: companyNif,
        email: companyEmail,
      },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        companyId: company.id,
      },
      include: { company: true },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role as Role,
    } as MyJwtPayload);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company?.name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao registar utilizador' });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        company: {
          select: {
            name: true,
            nif: true,
            email: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Utilizador não encontrado' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Erro ao obter dados do utilizador' });
  }
};
