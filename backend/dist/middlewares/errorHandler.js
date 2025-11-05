"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
class AppError extends Error {
    constructor(message, statusCode = 400, isOperational = true) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }
     Erros do Prisma
    if (error.name === 'PrismaClientKnownRequestError') {
        const prismaError = error;
         Unique constraint violation
        if (prismaError.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'Já existe um registro com esses dados',
            });
        }
         Foreign key constraint violation
        if (prismaError.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: 'Referência inválida',
            });
        }
         Record not found
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
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
