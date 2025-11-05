"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const prisma = new client_1.PrismaClient();
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email e password são obrigatórios' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true },
        });
        if (!user) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }
        const token = (0, auth_middleware_1.generateToken)({
            id: user.id,
            email: user.email,
            companyId: user.companyId,
             garante o type cast caso user.role venha em runtime
            role: user.role,
        });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                companyName: user.company?.name,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { name, email, password, companyName, companyNif, companyEmail } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Nome, email e password são obrigatórios' });
            return;
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ error: 'Email já está em uso' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        if (!companyName || !companyNif || !companyEmail) {
            res.status(400).json({ error: 'Dados da empresa são obrigatórios' });
            return;
        }
        const company = await prisma.company.create({
            data: {
                name: companyName,
                nif: companyNif,
                email: companyEmail,
            },
        });
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                 usa literal correspondente ao enum do DB; ajusta conforme necessário
                role: 'ADMIN',
                companyId: company.id,
            },
            include: { company: true },
        });
        const token = (0, auth_middleware_1.generateToken)({
            id: user.id,
            email: user.email,
            companyId: user.companyId,
            role: user.role,
        });
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                companyName: user.company?.name,
            },
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erro ao registar utilizador' });
    }
};
exports.register = register;
const me = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { company: true },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyId: true,
                company: {
                    select: {
                        name: true,
                        nif: true,
                        email: true,
                    },
                },
            },
        });
        if (!user) {
            res.status(404).json({ error: 'Utilizador não encontrado' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error('Me error:', error);
        res.status(500).json({ error: 'Erro ao obter dados do utilizador' });
    }
};
exports.me = me;
