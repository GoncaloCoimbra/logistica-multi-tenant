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
var RegistrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let RegistrationService = RegistrationService_1 = class RegistrationService {
    prisma;
    jwtService;
    logger = new common_1.Logger(RegistrationService_1.name);
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async registerCompanyAndUser(data) {
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.logger.log('📝 Iniciando registro de empresa + usuário');
        this.logger.log(`🏢 Empresa: ${data.companyName}`);
        this.logger.log(`👤 Usuário: ${data.userName} (${data.userEmail})`);
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            this.logger.log(' Prisma conectado com sucesso');
        }
        catch (err) {
            this.logger.error(' ERRO: Prisma não está conectado!');
            this.logger.error('Error:', err.message);
            throw new common_1.InternalServerErrorException('Erro de conexão com banco de dados');
        }
        this.logger.log('🔍 Validando dados...');
        if (!data.companyName || !data.companyNif || !data.companyEmail) {
            throw new common_1.BadRequestException('Dados da empresa incompletos');
        }
        if (!data.userName || !data.userEmail || !data.userPassword) {
            throw new common_1.BadRequestException('Dados do usuário incompletos');
        }
        if (data.userPassword.length < 6) {
            throw new common_1.BadRequestException('Password deve ter no mínimo 6 caracteres');
        }
        this.logger.log('🔍 Verificando se empresa já existe...');
        const existingCompany = await this.prisma.company.findFirst({
            where: {
                OR: [
                    { nif: data.companyNif },
                    { email: data.companyEmail },
                ],
            },
        });
        if (existingCompany) {
            if (existingCompany.nif === data.companyNif) {
                this.logger.error(` NIF ${data.companyNif} já está em uso`);
                throw new common_1.ConflictException('Já existe uma empresa com este NIF');
            }
            if (existingCompany.email === data.companyEmail) {
                this.logger.error(` Email ${data.companyEmail} já está em uso`);
                throw new common_1.ConflictException('Já existe uma empresa com este email');
            }
        }
        this.logger.log('🔍 Verificando se usuário já existe...');
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.userEmail },
        });
        if (existingUser) {
            this.logger.error(` Email de usuário ${data.userEmail} já está em uso`);
            throw new common_1.ConflictException('Este email já está em uso');
        }
        this.logger.log('🔒 Gerando hash da password...');
        const hashedPassword = await bcrypt.hash(data.userPassword, 10);
        try {
            this.logger.log('🔄 Iniciando transação...');
            const result = await this.prisma.$transaction(async (tx) => {
                this.logger.log('📍 DENTRO DA TRANSAÇÃO - iniciou');
                this.logger.log(' Criando empresa...');
                const company = await tx.company.create({
                    data: {
                        name: data.companyName,
                        nif: data.companyNif,
                        email: data.companyEmail,
                        phone: data.companyPhone || null,
                        address: data.companyAddress || null,
                        isActive: true,
                    },
                });
                this.logger.log(` Empresa criada: ${company.id} - ${company.name}`);
                this.logger.log('👤 Criando usuário administrador...');
                const user = await tx.user.create({
                    data: {
                        name: data.userName,
                        email: data.userEmail,
                        password: hashedPassword,
                        role: client_1.Role.ADMIN,
                        companyId: company.id,
                        isActive: true,
                    },
                });
                this.logger.log(` Usuário criado: ${user.id} - ${user.name} (ADMIN)`);
                this.logger.log(`   Email armazenado: ${user.email}`);
                this.logger.log(`   isActive: ${user.isActive}`);
                this.logger.log('⚙️ Criando Configurations padrão...');
                await tx.settings.create({
                    data: {
                        companyId: company.id,
                        taxRate: 0.23,
                    },
                });
                this.logger.log(' Configurations criadas');
                this.logger.log('📍 DENTRO DA TRANSAÇÃO - finalizando...');
                return { company, user };
            });
            this.logger.log('📍 TRANSAÇÃO CONCLUÍDA COM SUCESSO');
            this.logger.log('🔍 Verificando se usuário foi realmente criado no banco...');
            const userInDb = await this.prisma.user.findUnique({
                where: { email: result.user.email },
            });
            if (!userInDb) {
                this.logger.error(' CRÍTICO: Usuário NÃO foi encontrado no banco após transação!');
                this.logger.error(` Email procurado: ${result.user.email}`);
                throw new common_1.InternalServerErrorException('Falha na verificação: usuário não foi criado');
            }
            this.logger.log(' Verificação OK - usuário existe no banco de dados');
            this.logger.log('🔑 Gerando tokens JWT...');
            const tokens = await this.generateTokens(result.user.id, result.user.email, result.user.role);
            this.logger.log(' Tokens gerados com sucesso');
            this.logger.log(' REGISTRO COMPLETO!');
            this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            const responseData = {
                token: tokens.token,
                refreshToken: tokens.refreshToken,
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role,
                    companyId: result.user.companyId,
                    companyName: result.company.name,
                    isActive: result.user.isActive,
                },
            };
            this.logger.log('📤 Respondendo ao cliente com:');
            this.logger.log(`   - Token: ${tokens.token.substring(0, 20)}...`);
            this.logger.log(`   - User Email: ${responseData.user.email}`);
            this.logger.log(`   - User ID: ${responseData.user.id}`);
            this.logger.log(`   - Company ID: ${responseData.user.companyId}`);
            return responseData;
        }
        catch (error) {
            this.logger.error(' Erro ao criar empresa e usuário:', error.message);
            this.logger.error(error.stack);
            throw new common_1.InternalServerErrorException('Erro ao processar registro. Tente novamente.');
        }
    }
    async generateTokens(userId, email, role) {
        const payload = {
            sub: userId,
            email,
            role
        };
        const token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET || 'default-secret-key',
            expiresIn: '7d',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET || 'default-secret-key',
            expiresIn: '30d',
        });
        return { token, refreshToken };
    }
};
exports.RegistrationService = RegistrationService;
exports.RegistrationService = RegistrationService = RegistrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], RegistrationService);
//# sourceMappingURL=registration.service.js.map