import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateToken, Role, MyJwtPayload } from '../middlewares/auth.middleware';
import { deleteOldAvatar } from '../middlewares/upload.middleware';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', email);
    
    if (!email || !password) {
      res.status(400).json({ error: 'Email e password são obrigatórios' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      console.log('❌ User not found:', email);
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      companyId: user.companyId || null,
      role: user.role as Role,
    } as MyJwtPayload);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      companyName: user.company?.name,
      avatarUrl: user.avatarUrl,
    };

    console.log(' Login successful:', {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      roleType: typeof userData.role
    });

    res.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, companyName, companyNif, companyEmail } = req.body;
    
    console.log('📝 Register attempt:', email);
    
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
      companyId: user.companyId || null,
      role: user.role as Role,
    } as MyJwtPayload);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      companyName: user.company?.name,
      avatarUrl: user.avatarUrl,
    };

    console.log(' Register successful:', userData);

    res.status(201).json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ error: 'Erro ao registar utilizador' });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      console.log('❌ /auth/me - No user in request');
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    console.log('🔍 /auth/me - Request user:', req.user);

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        avatarUrl: true,
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
      console.log('❌ /auth/me - User not found in database');
      res.status(404).json({ error: 'Utilizador não encontrado' });
      return;
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      companyName: user.company?.name,
      avatarUrl: user.avatarUrl,
    };

    console.log(' /auth/me - Response:', {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      roleType: typeof userData.role
    });

    res.json(userData);
  } catch (error) {
    console.error('❌ /auth/me error:', error);
    res.status(500).json({ error: 'Erro ao obter dados do utilizador' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { name, email } = req.body;
    const userId = req.user.userId;

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        res.status(409).json({ error: 'Email já está em uso' });
        return;
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        avatarUrl: true,
        company: {
          select: {
            name: true,
          }
        }
      }
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        companyId: updatedUser.companyId,
        companyName: updatedUser.company?.name,
        avatarUrl: updatedUser.avatarUrl
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Passwords são obrigatórias' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'A nova password deve ter pelo menos 6 caracteres' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ error: 'Utilizador não encontrado' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Password atual incorreta' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password alterada com sucesso' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Erro ao alterar password' });
  }
};

export const uploadAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Nenhum ficheiro enviado' });
      return;
    }

    const userId = req.user.userId;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true }
    });

    if (user?.avatarUrl) {
      deleteOldAvatar(user.avatarUrl);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        companyId: true,
        company: {
          select: { name: true }
        }
      }
    });

    res.json({
      message: 'Avatar atualizado com sucesso',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        companyId: updatedUser.companyId,
        companyName: updatedUser.company?.name,
        avatarUrl: updatedUser.avatarUrl
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do avatar' });
  }
};

export const removeAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true }
    });

    if (user?.avatarUrl) {
      deleteOldAvatar(user.avatarUrl);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null }
    });

    res.json({ message: 'Avatar removido com sucesso' });
  } catch (error) {
    console.error('Remove avatar error:', error);
    res.status(500).json({ error: 'Erro ao remover avatar' });
  }
};