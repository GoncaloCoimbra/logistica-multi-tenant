import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export const successResponse = <T = any>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400
) => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T = any>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
) => {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
    },
  };

  return res.status(200).json(response);
};