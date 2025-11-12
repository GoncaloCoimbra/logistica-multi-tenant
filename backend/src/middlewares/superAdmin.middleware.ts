import { Request, Response, NextFunction } from 'express';

/**
 * Middleware que verifica se o utilizador é SUPER_ADMIN
 */
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ 
      message: 'Acesso negado: apenas Super Administradores podem aceder a este recurso' 
    });
  }

  next();
};

/**
 * Middleware que verifica se é SUPER_ADMIN ou ADMIN
 */
export const requireAdminOrSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      message: 'Acesso negado: apenas Administradores podem aceder a este recurso' 
    });
  }

  next();
};