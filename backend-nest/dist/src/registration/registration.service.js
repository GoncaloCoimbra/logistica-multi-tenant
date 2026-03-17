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
        this.logger.log('📝 Starting company + user registration');
        this.logger.log(`🏢 Company: ${data.companyName}`);
        this.logger.log(`👤 User: ${data.userName} (${data.userEmail})`);
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            this.logger.log('✓ Prisma connected successfully');
        }
        catch (err) {
            this.logger.error('❌ ERROR: Prisma is not connected!');
            this.logger.error('Error:', err.message);
            throw new common_1.InternalServerErrorException('Database connection error');
        }
        this.logger.log('🔍 Validating data...');
        if (!data.companyName || !data.companyNif || !data.companyEmail) {
            throw new common_1.BadRequestException('Company data incomplete');
        }
        if (!data.userName || !data.userEmail || !data.userPassword) {
            throw new common_1.BadRequestException('User data incomplete');
        }
        if (data.userPassword.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters');
        }
        this.logger.log('🔍 Checking if company already exists...');
        const existingCompany = await this.prisma.company.findFirst({
            where: {
                OR: [{ nif: data.companyNif }, { email: data.companyEmail }],
            },
        });
        if (existingCompany) {
            if (existingCompany.nif === data.companyNif) {
                this.logger.error(`❌ NIF ${data.companyNif} is already in use`);
                throw new common_1.ConflictException('A company with this NIF already exists');
            }
            if (existingCompany.email === data.companyEmail) {
                this.logger.error(`❌ Email ${data.companyEmail} is already in use`);
                throw new common_1.ConflictException('A company with this email already exists');
            }
        }
        this.logger.log('🔍 Checking if user already exists...');
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.userEmail },
        });
        if (existingUser) {
            this.logger.error(`❌ User email ${data.userEmail} is already in use`);
            throw new common_1.ConflictException('This email is already in use');
        }
        this.logger.log('🔒 Generating password hash...');
        const hashedPassword = await bcrypt.hash(data.userPassword, 10);
        try {
            this.logger.log('🔄 Starting transaction...');
            const result = await this.prisma.$transaction(async (tx) => {
                this.logger.log('📍 INSIDE TRANSACTION - started');
                this.logger.log('📍 Creating company...');
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
                this.logger.log(`✓ Company created: ${company.id} - ${company.name}`);
                this.logger.log('👤 Creating admin user...');
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
                this.logger.log(`✓ User created: ${user.id} - ${user.name} (ADMIN)`);
                this.logger.log(`   Email stored: ${user.email}`);
                this.logger.log(`   isActive: ${user.isActive}`);
                this.logger.log('⚙️ Creating default Settings...');
                await tx.settings.create({
                    data: {
                        companyId: company.id,
                        taxRate: 0.23,
                    },
                });
                this.logger.log('✓ Settings created');
                this.logger.log('📍 INSIDE TRANSACTION - finalizing...');
                return { company, user };
            });
            this.logger.log('📍 TRANSACTION COMPLETED SUCCESSFULLY');
            this.logger.log('🔍 Verifying if user was really created in database...');
            const userInDb = await this.prisma.user.findUnique({
                where: { email: result.user.email },
            });
            if (!userInDb) {
                this.logger.error('❌ CRITICAL: User NOT found in database after transaction!');
                this.logger.error(`   Email searched: ${result.user.email}`);
                throw new common_1.InternalServerErrorException('Verification failed: user was not created');
            }
            this.logger.log('✓ Verification OK - user exists in database');
            this.logger.log('🔑 Generating JWT tokens...');
            const tokens = await this.generateTokens(result.user.id, result.user.email, result.user.role);
            this.logger.log('✓ Tokens generated successfully');
            this.logger.log('✓ REGISTRATION COMPLETE!');
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
            this.logger.log('📤 Responding to client with:');
            this.logger.log(`   - Token: ${tokens.token.substring(0, 20)}...`);
            this.logger.log(`   - User Email: ${responseData.user.email}`);
            this.logger.log(`   - User ID: ${responseData.user.id}`);
            this.logger.log(`   - Company ID: ${responseData.user.companyId}`);
            return responseData;
        }
        catch (error) {
            this.logger.error('❌ Error creating company and user:', error.message);
            this.logger.error(error.stack);
            throw new common_1.InternalServerErrorException('Error processing registration. Please try again.');
        }
    }
    async generateTokens(userId, email, role) {
        const payload = {
            sub: userId,
            email,
            role,
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