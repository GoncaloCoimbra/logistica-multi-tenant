"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
        const reset = '\x1b[0m';
        console.log(`${statusColor}${res.statusCode}${reset} ${req.method} ${req.path} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
exports.logger = {
    info: (message, data) => {
        console.log(`ℹ️  ${message}`, data || '');
    },
    success: (message, data) => {
        console.log(`✅ ${message}`, data || '');
    },
    warning: (message, data) => {
        console.warn(`⚠️  ${message}`, data || '');
    },
    error: (message, error) => {
        console.error(`❌ ${message}`, error || '');
    },
};
