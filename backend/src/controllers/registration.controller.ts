import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerCompanyAndUser = async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      companyNif,
      companyAddress,
      companyEmail,
      companyPhone,
      userName,
      userEmail,
      userPassword,
    } = req.body;

    console.log('📥 /api/registration/register - payload:', {
      companyName,
      companyNif,
      companyEmail,
      userName,
      userEmail,
      hasPassword: !!userPassword,
    });

    if (!companyName || !companyNif || !companyEmail || !userName || !userEmail || !userPassword) {
      return res.status(400).json({
        error: 'Campos obrigatórios em falta',
        missing: {
          companyName: !companyName,
          companyNif: !companyNif,
          companyEmail: !companyEmail,
          userName: !userName,
          userEmail: !userEmail,
          userPassword: !userPassword,
        },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) return res.status(400).json({ error: 'Email da empresa inválido' });
    if (!emailRegex.test(userEmail)) return res.status(400).json({ error: 'Email do utilizador inválido' });
    if (userPassword.length < 6) return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });

    // Verificar duplicados
    const existingCompany = await prisma.company.findFirst({
      where: { OR: [{ nif: companyNif }, { email: companyEmail }] },
    });
    if (existingCompany) {
      return res.status(409).json({
        error: 'Empresa já registada',
        details: existingCompany.nif === companyNif ? 'NIF duplicado' : 'Email duplicado',
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
    if (existingUser) return res.status(409).json({ error: 'Email de utilizador já em uso' });

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const { company, user } = await prisma.$transaction(async (tx) => {
      const createdCompany = await tx.company.create({
        data: {
          name: companyName,
          nif: companyNif,
          address: companyAddress || null,
          email: companyEmail,
          phone: companyPhone || null,
        },
      });

      const createdUser = await tx.user.create({
        data: {
          name: userName,
          email: userEmail,
          password: hashedPassword,
          role: Role.OPERATOR, 
          companyId: createdCompany.id,
        },
      });

      return { company: createdCompany, user: createdUser };
    });

    console.log(' Criado company & user:', { companyId: company.id, userId: user.id, role: user.role });

    const token = jwt.sign(
      { userId: user.id, companyId: company.id, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Empresa e utilizador criados com sucesso',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      company: { id: company.id, name: company.name, nif: company.nif },
    });
  } catch (error: any) {
    console.error('❌ Erro no registo:', error);

    if (error?.code === 'P2002') {
      const target = error?.meta?.target ?? 'campo único';
      return res.status(409).json({ error: `Conflito de unicidade: ${target}` });
    }

    return res.status(500).json({
      error: 'Erro ao criar conta',
      details: process.env.NODE_ENV === 'development' ? (error?.message ?? String(error)) : undefined,
    });
  }
};