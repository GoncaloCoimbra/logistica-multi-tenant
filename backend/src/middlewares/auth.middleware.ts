import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR';

export interface MyJwtPayload {
  userId: string;
  email: string;
  companyId: string | null;
  role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui';

export const generateToken = (payload: MyJwtPayload): string => {
  console.log('🔑 Generating token for:', {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    roleType: typeof payload.role
  });
  return jwt.sign(payload as any, JWT_SECRET, { expiresIn: '7d' });
};

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log('🔐 authenticate - Headers:', {
      hasAuthHeader: !!authHeader,
      authHeader: authHeader?.substring(0, 20) + '...'
    });
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ authenticate - No token provided');
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
    
    console.log(' authenticate - Token decoded:', {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      roleType: typeof decoded.role,
      companyId: decoded.companyId
    });
    
    req.user = decoded as any;
    next();
  } catch (error) {
    console.error('❌ authenticate - Token verification failed:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      console.log('❌ requireRole - No user in request');
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const userRole = req.user.role as Role;
    
    console.log('🔒 requireRole - Checking:', {
      userRole,
      requiredRoles: roles,
      hasAccess: roles.includes(userRole)
    });
    
    if (!roles.includes(userRole)) {
      console.log('❌ requireRole - Access denied');
      res.status(403).json({ error: 'Sem permissão para esta ação' });
      return;
    }

    console.log(' requireRole - Access granted');
    next();
  };
};