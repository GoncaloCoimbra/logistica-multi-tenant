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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperadminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let SuperadminService = class SuperadminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGlobalStats() {
        try {
            const [totalCompanies, totalUsers, totalProducts, totalSuppliers, totalVehicles,] = await Promise.all([
                this.prisma.company.count(),
                this.prisma.user.count(),
                this.prisma.product.count(),
                this.prisma.supplier.count(),
                this.prisma.vehicle.count(),
            ]);
            const topCompanies = await this.prisma.company.findMany({
                take: 5,
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: {
                            users: true,
                            products: true,
                            suppliers: true,
                        },
                    },
                },
                orderBy: {
                    products: {
                        _count: 'desc',
                    },
                },
            });
            return {
                totalCompanies,
                totalUsers,
                totalProducts,
                totalSuppliers,
                totalVehicles,
                topCompanies,
            };
        }
        catch (error) {
            console.error('Erro ao buscar estatísticas globais:', error);
            throw error;
        }
    }
    async getAllCompanies() {
        return this.prisma.company.findMany({
            include: {
                _count: {
                    select: {
                        users: true,
                        products: true,
                        vehicles: true,
                        suppliers: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createCompany(data) {
        const { adminUser, ...companyData } = data;
        const company = await this.prisma.company.create({
            data: companyData,
        });
        if (adminUser) {
            const hashedPassword = await bcrypt.hash(adminUser.password, 10);
            await this.prisma.user.create({
                data: {
                    ...adminUser,
                    password: hashedPassword,
                    role: 'ADMIN',
                    companyId: company.id,
                },
            });
        }
        return company;
    }
    async getCompany(id) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                users: true,
                _count: {
                    select: {
                        products: true,
                        vehicles: true,
                        suppliers: true,
                        transports: true,
                    },
                },
            },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada');
        }
        return company;
    }
    async updateCompany(id, data) {
        return this.prisma.company.update({
            where: { id },
            data,
        });
    }
    async deleteCompany(id) {
        return this.prisma.company.delete({
            where: { id },
        });
    }
    async getCompanyStats(companyId) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: {
                _count: {
                    select: {
                        users: true,
                        products: true,
                        suppliers: true,
                        vehicles: true,
                        transports: true,
                    },
                },
            },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada');
        }
        return {
            company: {
                id: company.id,
                name: company.name,
                nif: company.nif,
            },
            stats: company._count,
        };
    }
    async toggleCompanyStatus(id, isActive) {
        return this.prisma.company.update({
            where: { id },
            data: { isActive },
        });
    }
};
exports.SuperadminService = SuperadminService;
exports.SuperadminService = SuperadminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuperadminService);
//# sourceMappingURL=superadmin.service.js.map