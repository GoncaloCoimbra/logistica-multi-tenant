import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const reset = '\x1b[0m';

    console.log(
      `${statusColor}${res.statusCode}${reset} ${req.method} ${req.path} - ${duration}ms`
    );
  });

  next();
};

export const logger = {
  info: (message: string, data?: any) => {
    console.log(`ℹ️  ${message}`, data || '');
  },
  
  success: (message: string, data?: any) => {
    console.log(` ${message}`, data || '');
  },
  
  warning: (message: string, data?: any) => {
    console.warn(`⚠️  ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error || '');
  },
};