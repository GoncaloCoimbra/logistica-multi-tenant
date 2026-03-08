"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, name, role, companyId } = registerDto;
        this.logger.log(`🔵 Iniciando registro para: ${email}`);
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            this.logger.warn(` Email já existe: ${email}`);
            throw new common_1.ConflictException('Email já está em uso');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await this.prisma.$transaction(async (tx) => {
            let finalCompanyId = companyId;
            if (!companyId && role !== client_1.Role.SUPER_ADMIN) {
                this.logger.log(` Criando empresa padrão para: ${name}`);
                const company = await tx.company.create({
                    data: {
                        name: `Empresa de ${name}`,
                        nif: `TEMP-${Date.now()}`,
                        email: email,
                        phone: null,
                        address: null,
                        isActive: true,
                    },
                });
                finalCompanyId = company.id;
                this.logger.log(` Empresa criada com ID: ${company.id}`);
            }
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: role || client_1.Role.OPERATOR,
                    companyId: finalCompanyId ?? undefined,
                },
            });
            this.logger.log(` Usuário criado com ID: ${user.id}`);
            return user;
        });
        const savedUser = await this.prisma.user.findUnique({
            where: { email },
            include: { company: true },
        });
        if (!savedUser) {
            this.logger.error(` ERRO CRÍTICO: Usuário não foi encontrado após criação: ${email}`);
            throw new Error('Erro ao criar usuário');
        }
        this.logger.log(`🔍 Usuário confirmado no banco: ${savedUser.id}`);
        this.logger.log(`🏢 Empresa associada: ${savedUser.companyId || 'Nenhuma'}`);
        const tokens = await this.generateTokens(savedUser.id, savedUser.email, savedUser.role);
        return {
            ...tokens,
            user: this.formatUser(savedUser),
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        this.logger.log(`🔵 Tentativa de login para: ${email}`);
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { company: true },
        });
        if (!user) {
            this.logger.warn(` LOGIN FALHADO: Email "${email}" não encontrado`);
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        this.logger.log(`🔍 Usuário encontrado: ${user.id} | Role: ${user.role} | Ativo: ${user.isActive}`);
        if (!user.isActive) {
            this.logger.warn(` LOGIN FALHADO: Utilizador "${email}" está inativo`);
            throw new common_1.UnauthorizedException('Utilizador inativo');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            this.logger.warn(` LOGIN FALHADO: Password incorreta para "${email}"`);
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        this.logger.log(` LOGIN SUCESSO: ${email} | Company: ${user.companyId || 'Nenhuma'}`);
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            ...tokens,
            user: this.formatUser(user),
        };
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            return this.formatUser(user);
        }
        return null;
    }
    async updateProfile(userId, updateProfileDto) {
        const { name, email } = updateProfileDto;
        if (email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    email,
                    NOT: { id: userId },
                },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Este email já está em uso');
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
            },
        });
        this.logger.log(`Perfil atualizado: ${updatedUser.email}`);
        return { user: this.formatUser(updatedUser) };
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Utilizador não encontrado');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Password atual incorreta');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        this.logger.log(`Password alterada: ${user.email}`);
        return { message: 'Password alterada com sucesso' };
    }
    async uploadAvatar(userId, file) {
        if (!file) {
            throw new common_1.BadRequestException('Nenhum ficheiro enviado');
        }
        const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileExt = path.extname(file.originalname);
        const fileName = `${userId}-${Date.now()}${fileExt}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (user?.avatarUrl) {
            const oldAvatarPath = path.join(process.cwd(), user.avatarUrl);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }
        const avatarUrl = `/uploads/avatars/${fileName}`;
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
        });
        this.logger.log(`Avatar atualizado: ${updatedUser.email}`);
        return { user: this.formatUser(updatedUser) };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_SECRET || 'default-secret-key',
            });
            const tokens = await this.prisma.refreshToken.findMany({
                where: {
                    userId: payload.sub,
                    revoked: false,
                    expiresAt: { gt: new Date() },
                },
            });
            let validToken = false;
            for (const t of tokens) {
                if (await bcrypt.compare(refreshToken, t.tokenHash)) {
                    validToken = true;
                    await this.prisma.refreshToken.update({
                        where: { id: t.id },
                        data: { revoked: true },
                    });
                    break;
                }
            }
            if (!validToken) {
                throw new common_1.UnauthorizedException('Refresh token inválido ou expirado');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { company: true },
            });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('Utilizador não encontrado ou inativo');
            }
            const newTokens = await this.generateTokens(user.id, user.email, user.role);
            return {
                ...newTokens,
                user: this.formatUser(user),
            };
        }
        catch (error) {
            this.logger.error('Erro ao renovar token:', error.message);
            throw new common_1.UnauthorizedException('Token de refresh inválido');
        }
    }
    async removeAvatar(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (user?.avatarUrl) {
            const avatarPath = path.join(process.cwd(), user.avatarUrl);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: null },
        });
        this.logger.log(`Avatar removido: ${updatedUser.email}`);
        return { user: this.formatUser(updatedUser) };
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET || 'default-secret-key',
            expiresIn: '7d',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET || 'default-secret-key',
            expiresIn: '30d',
        });
        try {
            const hash = await bcrypt.hash(refreshToken, 10);
            const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000);
            await this.prisma.refreshToken.create({
                data: {
                    tokenHash: hash,
                    userId,
                    expiresAt,
                },
            });
        }
        catch (err) {
            this.logger.error('Erro ao gravar refresh token', err?.message || err);
        }
        return { token, refreshToken };
    }
    async revokeRefreshToken(refreshToken) {
        const tokens = await this.prisma.refreshToken.findMany({ where: { revoked: false } });
        for (const t of tokens) {
            if (await bcrypt.compare(refreshToken, t.tokenHash)) {
                await this.prisma.refreshToken.update({ where: { id: t.id }, data: { revoked: true } });
                return { revoked: true };
            }
        }
        return { revoked: false };
    }
    formatUser(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            companyId: user.companyId ?? null,
            isActive: user.isActive,
            avatarUrl: user.avatarUrl ?? null,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map