import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        companyId: string | null;
        role: Role;
      };
    }
  }
}

export {};