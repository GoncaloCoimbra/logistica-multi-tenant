import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper para extrair userId de forma segura
function getUserId(req: Request): string {
  const user = req.user as any;
  return user?.id || user?.userId || '';
}

/**
 * 🏢 GESTÃO DE EMPRESAS
 */

// Listar todas as empresas
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: {
            users: true,
            products: true,
            suppliers: true,
            vehicles: true,
            transports: true
          }
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(companies);
  } catch (error: any) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ message: 'Erro ao listar empresas', error: error.message });
  }
};

// Criar nova empresa
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, nif, address, email, phone, adminUser } = req.body;

   
    if (!name || !nif || !email) {
      return res.status(400).json({ 
        message: 'Nome, NIF e Email da empresa são obrigatórios' 
      });
    }

    // Verificar se NIF ou email já existem
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { nif },
          { email }
        ]
      }
    });

    if (existingCompany) {
      return res.status(400).json({ 
        message: existingCompany.nif === nif 
          ? 'Já existe uma empresa com este NIF' 
          : 'Já existe uma empresa com este email' 
      });
    }

    // Criar empresa
    const company = await prisma.company.create({
      data: {
        name,
        nif,
        address,
        email,
        phone
      }
    });

    // Se forneceu dados de admin, criar utilizador admin
    let adminCreated = null;
    if (adminUser && adminUser.name && adminUser.email && adminUser.password) {
      const hashedPassword = await bcrypt.hash(adminUser.password, 10);
      
      adminCreated = await prisma.user.create({
        data: {
          name: adminUser.name,
          email: adminUser.email,
          password: hashedPassword,
          role: 'ADMIN',
          companyId: company.id
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
    }

    // Criar log de auditoria (se possível)
    const userId = getUserId(req);
    if (userId) {
      await prisma.auditLog.create({
        data: {
          action: 'CREATE_COMPANY',
          entity: 'Company',
          entityId: company.id,
          userId: userId,
          companyId: company.id,
          ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown'
        }
      });
    }

    res.status(201).json({
      message: 'Empresa criada com sucesso',
      company,
      admin: adminCreated
    });

  } catch (error: any) {
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ message: 'Erro ao criar empresa', error: error.message });
  }
};

// Atualizar empresa
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, nif, address, email, phone } = req.body;

    // Verificar se empresa existe
    const existingCompany = await prisma.company.findUnique({
      where: { id }
    });

    if (!existingCompany) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Verificar duplicados (excluindo a própria empresa)
    if (nif || email) {
      const duplicate = await prisma.company.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                { nif: nif || undefined },
                { email: email || undefined }
              ]
            }
          ]
        }
      });

      if (duplicate) {
        return res.status(400).json({ 
          message: duplicate.nif === nif 
            ? 'Já existe uma empresa com este NIF' 
            : 'Já existe uma empresa com este email' 
        });
      }
    }

    // Atualizar
    const company = await prisma.company.update({
      where: { id },
      data: {
        name: name || existingCompany.name,
        nif: nif || existingCompany.nif,
        address,
        email: email || existingCompany.email,
        phone
      }
    });

    res.json({ message: 'Empresa atualizada com sucesso', company });

  } catch (error: any) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ message: 'Erro ao atualizar empresa', error: error.message });
  }
};

// Eliminar empresa
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            products: true
          }
        }
      }
    });

    if (!company) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Avisar se houver dados associados
    if (company._count.users > 0 || company._count.products > 0) {
      return res.status(400).json({ 
        message: `Não é possível eliminar. A empresa tem ${company._count.users} utilizador(es) e ${company._count.products} produto(s) associados.`,
        warning: 'Considere desativar em vez de eliminar'
      });
    }

    await prisma.company.delete({ where: { id } });

    res.json({ message: 'Empresa eliminada com sucesso' });

  } catch (error: any) {
    console.error('Erro ao eliminar empresa:', error);
    res.status(500).json({ message: 'Erro ao eliminar empresa', error: error.message });
  }
};

/**
 * 👥 GESTÃO GLOBAL DE UTILIZADORES
 */

// Listar todos os utilizadores de todas as empresas
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
            nif: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Remover passwords
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(sanitizedUsers);

  } catch (error: any) {
    console.error('Erro ao listar utilizadores:', error);
    res.status(500).json({ message: 'Erro ao listar utilizadores', error: error.message });
  }
};

// Obter utilizadores de uma empresa específica
export const getUsersByCompany = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    const users = await prisma.user.findMany({
      where: { companyId },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(sanitizedUsers);

  } catch (error: any) {
    console.error('Erro ao listar utilizadores:', error);
    res.status(500).json({ message: 'Erro ao listar utilizadores', error: error.message });
  }
};

// Criar utilizador em qualquer empresa
export const createUserForCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, companyId } = req.body;

    // Validações
    if (!name || !email || !password || !companyId) {
      return res.status(400).json({ 
        message: 'Nome, email, password e empresa são obrigatórios' 
      });
    }

    if (!['ADMIN', 'OPERATOR'].includes(role)) {
      return res.status(400).json({ 
        message: 'Role inválida. Use ADMIN ou OPERATOR' 
      });
    }

    // Verificar se empresa existe
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Verificar email duplicado
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Já existe um utilizador com este email' });
    }

    // Criar utilizador
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
        companyId
      },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ 
      message: 'Utilizador criado com sucesso', 
      user: userWithoutPassword 
    });

  } catch (error: any) {
    console.error('Erro ao criar utilizador:', error);
    res.status(500).json({ message: 'Erro ao criar utilizador', error: error.message });
  }
};

// Atualizar utilizador de qualquer empresa
export const updateUserGlobal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, companyId } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    // Proteção para SUPER_ADMIN
    if ((user.role as string) === 'SUPER_ADMIN') {
      return res.status(403).json({ 
        message: 'Não é possível alterar um Super Administrador' 
      });
    }

    // Verificar email duplicado
    if (email && email !== user.email) {
      const duplicate = await prisma.user.findUnique({
        where: { email }
      });

      if (duplicate) {
        return res.status(400).json({ message: 'Já existe um utilizador com este email' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name || user.name,
        email: email || user.email,
        role: role ? (role as Role) : user.role,
        companyId: companyId || user.companyId
      },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({ 
      message: 'Utilizador atualizado com sucesso', 
      user: userWithoutPassword 
    });

  } catch (error: any) {
    console.error('Erro ao atualizar utilizador:', error);
    res.status(500).json({ message: 'Erro ao atualizar utilizador', error: error.message });
  }
};

// Eliminar utilizador de qualquer empresa
export const deleteUserGlobal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    // Proteção para SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN' as Role) {
      return res.status(403).json({ 
        message: 'Não é possível eliminar um Super Administrador' 
      });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: 'Utilizador eliminado com sucesso' });

  } catch (error: any) {
    console.error('Erro ao eliminar utilizador:', error);
    res.status(500).json({ message: 'Erro ao eliminar utilizador', error: error.message });
  }
};

/**
 * 📊 ESTATÍSTICAS GLOBAIS
 */
export const getGlobalStats = async (req: Request, res: Response) => {
  try {
    const [
      totalCompanies,
      totalUsers,
      totalProducts,
      totalSuppliers,
      totalVehicles
    ] = await Promise.all([
      prisma.company.count(),
      // Contar apenas ADMIN e OPERATOR (excluir SUPER_ADMIN)
      prisma.user.count({ 
        where: { 
          role: { 
            in: ['ADMIN' as Role, 'OPERATOR' as Role] 
          } 
        } 
      }),
      prisma.product.count(),
      prisma.supplier.count(),
      prisma.vehicle.count()
    ]);

    const companiesWithStats = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            users: true,
            products: true,
            suppliers: true
          }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      },
      take: 5
    });

    res.json({
      totalCompanies,
      totalUsers,
      totalProducts,
      totalSuppliers,
      totalVehicles,
      topCompanies: companiesWithStats
    });

  } catch (error: any) {
    console.error('Erro ao obter estatísticas globais:', error);
    res.status(500).json({ message: 'Erro ao obter estatísticas', error: error.message });
  }
};