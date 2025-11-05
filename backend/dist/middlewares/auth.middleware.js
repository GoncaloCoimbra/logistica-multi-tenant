"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.requireRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Token não fornecido' });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            companyId: decoded.companyId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};
exports.authenticate = authenticate;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Acesso negado' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
exports.generateToken = generateToken;
