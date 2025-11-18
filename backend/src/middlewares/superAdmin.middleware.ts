import { Request, Response, NextFunction } from 'express';

/**
 * Middleware que verifica se o utilizador é SUPER_ADMIN
 */
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log('🔐 requireSuperAdmin - Checking access...');
  
  if (!req.user) {
    console.log('❌ requireSuperAdmin - No user in request');
    return res.status(401).json({ message: 'Não autenticado' });
  }

  console.log('🔍 requireSuperAdmin - User details:', {
    userId: req.user.userId,
    email: req.user.email,
    role: req.user.role,
    roleType: typeof req.user.role,
    isSuperAdmin: req.user.role === 'SUPER_ADMIN'
  });

  if (req.user.role !== 'SUPER_ADMIN') {
    console.log('❌ requireSuperAdmin - Access denied. Role:', req.user.role);
    return res.status(403).json({ 
      message: 'Acesso negado: apenas Super Administradores podem aceder a este recurso',
      userRole: req.user.role,
      requiredRole: 'SUPER_ADMIN'
    });
  }

  console.log(' requireSuperAdmin - Access granted');
  next();
};

/**
 * Middleware que verifica se é SUPER_ADMIN ou ADMIN
 */
export const requireAdminOrSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log('🔐 requireAdminOrSuperAdmin - Checking access...');
  
  if (!req.user) {
    console.log('❌ requireAdminOrSuperAdmin - No user in request');
    return res.status(401).json({ message: 'Não autenticado' });
  }

  console.log('🔍 requireAdminOrSuperAdmin - User role:', req.user.role);

  if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
    console.log('❌ requireAdminOrSuperAdmin - Access denied');
    return res.status(403).json({ 
      message: 'Acesso negado: apenas Administradores podem aceder a este recurso' 
    });
  }

  console.log(' requireAdminOrSuperAdmin - Access granted');
  next();
};