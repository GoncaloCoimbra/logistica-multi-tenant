import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export type Role = 'ADMIN' | 'OPERATOR';

export interface MyJwtPayload {
  userId: string;
  email: string;
  companyId: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui';

export const generateToken = (payload: MyJwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const userRole = req.user.role as Role;
    if (!roles.includes(userRole)) {
      res.status(403).json({ error: 'Sem permissão para esta ação' });
      return;
    }

    next();
  };
};
