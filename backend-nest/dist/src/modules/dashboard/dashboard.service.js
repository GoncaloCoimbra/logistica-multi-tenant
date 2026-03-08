"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = DashboardService_1 = class DashboardService {
    prisma;
    logger = new common_1.Logger(DashboardService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats(companyId) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(` Getting stats for company: ${companyId || 'ALL (SUPER_ADMIN)'}`);
        const where = {};
        if (companyId) {
            where.companyId = companyId;
        }
        this.logger.log(` Where query: ${JSON.stringify(where)}`);
        try {
            const [totalProducts, totalSuppliers, totalVehicles, totalTransports, vehiclesAvailable, productsInStorage,] = await Promise.all([
                this.prisma.product.count({ where }),
                this.prisma.supplier.count({ where }),
                this.prisma.vehicle.count({ where }),
                this.prisma.transport.count({ where }),
                this.prisma.vehicle.count({
                    where: { ...where, status: 'available' }
                }),
                this.prisma.product.count({
                    where: { ...where, status: client_1.ProductStatus.IN_STORAGE }
                }),
            ]);
            const productsByStatusRaw = await this.prisma.product.groupBy({
                by: ['status'],
                where,
                _count: true,
            });
            const productsByStatus = productsByStatusRaw.map(p => ({
                status: p.status,
                count: p._count,
            }));
            const summary = {
                received: await this.prisma.product.count({
                    where: { ...where, status: client_1.ProductStatus.RECEIVED }
                }),
                inAnalysis: await this.prisma.product.count({
                    where: { ...where, status: client_1.ProductStatus.IN_ANALYSIS }
                }),
                inStorage: productsInStorage,
                delivered: await this.prisma.product.count({
                    where: { ...where, status: client_1.ProductStatus.DISPATCHED }
                }),
                rejected: 0,
            };
            const percentages = {
                received: totalProducts > 0
                    ? ((summary.received / totalProducts) * 100).toFixed(1)
                    : '0',
                inStorage: totalProducts > 0
                    ? ((summary.inStorage / totalProducts) * 100).toFixed(1)
                    : '0',
                delivered: totalProducts > 0
                    ? ((summary.delivered / totalProducts) * 100).toFixed(1)
                    : '0',
                rejected: totalProducts > 0
                    ? ((summary.rejected / totalProducts) * 100).toFixed(1)
                    : '0',
            };
            const suppliersWithProducts = await this.prisma.supplier.findMany({
                where,
                include: {
                    products: {
                        select: { id: true },
                        where: companyId ? { companyId } : {},
                    },
                },
            });
            const topSuppliers = suppliersWithProducts
                .map(s => ({
                id: s.id,
                name: s.name,
                productCount: s.products.length,
            }))
                .filter(s => s.productCount > 0)
                .sort((a, b) => b.productCount - a.productCount)
                .slice(0, 5);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentMovements = await this.prisma.product.count({
                where: {
                    ...where,
                    updatedAt: {
                        gte: thirtyDaysAgo,
                    },
                },
            });
            const result = {
                totalProducts,
                totalSuppliers,
                totalVehicles,
                totalTransports,
                vehiclesAvailable,
                productsInStorage,
                productsByStatus,
                summary,
                percentages,
                topSuppliers,
                recentMovements,
            };
            this.logger.log(`Stats computed successfully:`);
            this.logger.log(`    Total Products: ${totalProducts}`);
            this.logger.log(`   🏢 Total Suppliers: ${totalSuppliers}`);
            this.logger.log(`   🚗 Total Vehicles: ${totalVehicles}`);
            this.logger.log(`   🚚 Total Transports: ${totalTransports}`);
            this.logger.log(`   Vehicles Available: ${vehiclesAvailable}`);
            this.logger.log(`    Products In Storage: ${productsInStorage}`);
            this.logger.log(`    Products by Status: ${productsByStatus.length} categories`);
            this.logger.log(`    Summary - Received: ${summary.received}`);
            this.logger.log(`    Summary - In Analysis: ${summary.inAnalysis}`);
            this.logger.log(`    Summary - In Storage: ${summary.inStorage}`);
            this.logger.log(`    Summary - Delivered (Dispatched): ${summary.delivered}`);
            this.logger.log(`    Summary - Rejected: ${summary.rejected}`);
            this.logger.log(`   🔝 Top Suppliers: ${topSuppliers.length}`);
            this.logger.log(`   🔄 Recent Movements (30d): ${recentMovements}`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            return result;
        }
        catch (error) {
            this.logger.error(` Error computing stats: ${error.message}`);
            this.logger.error(` Stack: ${error.stack}`);
            throw error;
        }
    }
    async getOverview(companyId, filters) {
        this.logger.log(` Getting overview for company: ${companyId || 'ALL'}`);
        const where = {};
        if (companyId) {
            where.companyId = companyId;
        }
        return {
            message: 'Visão geral do dashboard',
            companyId: companyId || 'ALL',
            filters,
        };
    }
    async getProductsByStatus(companyId) {
        this.logger.log(` Getting products by status for company: ${companyId || 'ALL'}`);
        const where = {};
        if (companyId) {
            where.companyId = companyId;
        }
        const products = await this.prisma.product.groupBy({
            by: ['status'],
            where,
            _count: true,
        });
        return products.map(p => ({
            status: p.status,
            count: p._count,
        }));
    }
    async getTransportsByStatus(companyId) {
        this.logger.log(` Getting transports by status for company: ${companyId || 'ALL'}`);
        const where = {};
        if (companyId) {
            where.companyId = companyId;
        }
        const transports = await this.prisma.transport.groupBy({
            by: ['status'],
            where,
            _count: true,
        });
        return transports.map(t => ({
            status: t.status,
            count: t._count,
        }));
    }
    async getRecentActivity(companyId) {
        this.logger.log(` Getting recent activity for company: ${companyId || 'ALL'}`);
        const where = {};
        if (companyId) {
            where.companyId = companyId;
        }
        const logs = await this.prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    },
                },
            },
        });
        return logs;
    }
    async getMonthlyStats(companyId) {
        this.logger.log(` Getting monthly stats for company: ${companyId || 'ALL'}`);
        const where = {};
        if (companyId) {
            where.companyId = companyId;
        }
        return {
            message: 'Estatísticas mensais',
            companyId: companyId || 'ALL',
            data: [],
        };
    }
    async getTopSuppliers(companyId) {
        this.logger.log(` Getting top suppliers for company: ${companyId || 'ALL'}`);
        const where = {};
        if (companyId) {
            where.companyId = companyId;
        }
        const suppliers = await this.prisma.supplier.findMany({
            where,
            include: {
                products: {
                    select: { id: true },
                    where: companyId ? { companyId } : {},
                },
            },
        });
        return suppliers
            .map(s => ({
            id: s.id,
            name: s.name,
            nif: s.nif,
            productCount: s.products.length,
        }))
            .filter(s => s.productCount > 0)
            .sort((a, b) => b.productCount - a.productCount)
            .slice(0, 5);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map