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
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ProductsService = ProductsService_1 = class ProductsService {
    prisma;
    notificationsService;
    logger = new common_1.Logger(ProductsService_1.name);
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createProductDto, companyId, userId) {
        if (!createProductDto.supplierId) {
            throw new common_1.BadRequestException('Supplier is required');
        }
        const supplier = await this.prisma.supplier.findFirst({
            where: {
                id: createProductDto.supplierId,
                companyId,
            },
        });
        if (!supplier) {
            throw new common_1.NotFoundException('Supplier not found');
        }
        const status = createProductDto.status || 'RECEIVED';
        const product = await this.prisma.product.create({ data: {
                internalCode: createProductDto.internalCode,
                description: createProductDto.description,
                quantity: createProductDto.quantity,
                unit: createProductDto.unit,
                totalWeight: createProductDto.totalWeight,
                totalVolume: createProductDto.totalVolume,
                currentLocation: createProductDto.currentLocation,
                status: status,
                supplierId: createProductDto.supplierId,
                companyId,
            },
            include: {
                supplier: true,
            },
        });
        await this.prisma.productMovement.create({ data: {
                productId: product.id,
                previousStatus: status,
                newStatus: status,
                quantity: product.quantity,
                location: product.currentLocation || 'Entrada',
                reason: 'Initial product receipt',
                userId,
            },
        });
        try {
            this.logger.log(`🔔 [NOTIF-1] Starting notification: userId=${userId}, companyId=${companyId}`);
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { name: true, companyId: true, id: true },
            });
            if (!user) {
                this.logger.error(`❌ [NOTIF-2] User not found para notificação: ${userId}`);
                throw new Error(`User not found: ${userId}`);
            }
            this.logger.log(`✅ [NOTIF-2] User found: ${user.id}, userCompanyId=${user.companyId}, requestCompanyId=${companyId}`);
            if (user.companyId !== companyId) {
                this.logger.error(`❌ [NOTIF-3] CompanyId mismatch: ${user.companyId} !== ${companyId}`);
                throw new Error(`Company mismatch`);
            }
            this.logger.log(`🔔 [NOTIF-3] Calling notificationsService.create()`);
            const result = await this.notificationsService.create({
                title: '📦 New Product Registered',
                message: `New product "${product.description}" (${product.internalCode}) was registered by ${user?.name || 'Utilizador'}`,
                userId,
                companyId,
            });
            this.logger.log(`✅ [NOTIF-4] Notification created: ${result?.id}`);
        }
        catch (error) {
            this.logger.error(`❌ [NOTIF-ERROR] ${error?.message}`);
            this.logger.error('Stack:', error?.stack);
        }
        console.log('🔍 [SERVICE] Product created, returning:', product);
        return product;
    }
    async findAll(companyId, filters) {
        const where = {};
        if (filters?.supplierId) {
            where.supplierId = filters.supplierId;
        }
        if (filters?.supplier) {
            where.supplier = {
                name: { contains: filters.supplier, mode: 'insensitive' },
            };
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.location) {
            where.currentLocation = {
                contains: filters.location,
                mode: 'insensitive',
            };
        }
        if (filters?.dateFrom || filters?.dateTo) {
            where.createdAt = {};
            if (filters.dateFrom) {
                where.createdAt.gte = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                const endDate = new Date(filters.dateTo);
                endDate.setHours(23, 59, 59, 999);
                where.createdAt.lte = endDate;
            }
        }
        if (filters?.search) {
            where.OR = [
                { internalCode: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.product.findMany({
            where,
            include: {
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        nif: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, companyId) {
        const product = await this.prisma.product.findFirst({
            where: { id, companyId },
            include: {
                supplier: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('product not found');
        }
        return product;
    }
    async getStatsByStatus(companyId) {
        const products = await this.prisma.product.findMany({
            where: { companyId },
            select: { status: true },
        });
        const stats = products.reduce((acc, product) => {
            acc[product.status] = (acc[product.status] || 0) + 1;
            return acc;
        }, {});
        return {
            total: products.length,
            byStatus: stats,
        };
    }
    async findWithMovements(id, companyId) {
        const product = await this.prisma.product.findFirst({
            where: { id, companyId },
            include: {
                supplier: true,
                movements: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('product not found');
        }
        return product;
    }
    async update(id, updateProductDto, companyId, userId) {
        const product = await this.findOne(id, companyId);
        if (updateProductDto.supplierId &&
            updateProductDto.supplierId !== product.supplierId) {
            const supplier = await this.prisma.supplier.findFirst({
                where: {
                    id: updateProductDto.supplierId,
                    companyId,
                },
            });
            if (!supplier) {
                throw new common_1.NotFoundException('Supplier not found');
            }
        }
        return this.prisma.product.update({
            where: { id: product.id }, data: updateProductDto,
            include: {
                supplier: true,
            },
        });
    }
    async updateStatus(id, statusDto, companyId, userId) {
        const product = await this.findOne(id, companyId);
        const updatedProduct = await this.prisma.product.update({
            where: { id: product.id }, data: {
                status: statusDto.newStatus,
                currentLocation: statusDto.location || product.currentLocation,
            },
            include: {
                supplier: true,
            },
        });
        await this.prisma.productMovement.create({ data: {
                productId: product.id,
                previousStatus: product.status,
                newStatus: statusDto.newStatus,
                quantity: statusDto.quantity || product.quantity,
                location: statusDto.location || product.currentLocation || 'N/A',
                reason: statusDto.reason || `Alteração de estado para ${statusDto.newStatus}`,
                userId,
            },
        });
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { name: true },
            });
            const statusLabel = {
                RECEIVED: 'Received',
                IN_ANALYSIS: 'Under Analysis',
                IN_STORAGE: 'In Storage',
                APPROVED: 'Approved',
                DISPATCHED: 'Dispatched',
            };
            await this.notificationsService.create({
                title: `Product Updated`,
                message: `product "${product.description}" (${product.internalCode}) foi alterado de ${statusLabel[product.status] || product.status} para ${statusLabel[statusDto.newStatus] || statusDto.newStatus} por ${user?.name || 'Utilizador'}`,
                userId,
                companyId,
            });
            this.logger.log(`✅ Notificação enviada para atualização de status: ${product.id}`);
        }
        catch (error) {
            this.logger.error(`❌ Error ao send notificação de atualização de status: ${error.message}`);
        }
        return updatedProduct;
    }
    async remove(id, companyId, userId) {
        const product = await this.findOne(id, companyId);
        if (product.status !== 'RECEIVED') {
            throw new common_1.BadRequestException(`Não é possível excluir este product. Apenas products no estado "RECEBIDO" podem ser eliminados. Estado atual: ${product.status}`);
        }
        await this.prisma.productMovement.deleteMany({
            where: { productId: product.id },
        });
        return this.prisma.product.delete({
            where: { id: product.id },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map