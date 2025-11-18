import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      companyId: string;
      role: string;
      email: string; 
    };
  }
}
