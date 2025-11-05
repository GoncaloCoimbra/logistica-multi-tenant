import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

   
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Já existe um registro com esses dados',
      });
    }

     
    if (prismaError.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Referência inválida',
      });
    }

    
    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Registro não encontrado',
      });
    }
  }

  console.error('❌ Erro não tratado:', error);
  
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Erro interno do servidor',
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};