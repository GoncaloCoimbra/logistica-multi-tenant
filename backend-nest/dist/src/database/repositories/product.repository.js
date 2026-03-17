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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const base_repository_1 = require("./base.repository");
let ProductRepository = class ProductRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'product');
    }
    async findByCompany(companyId) {
        return this.prisma.product.findMany({
            where: { companyId },
            include: {
                company: true,
            },
        });
    }
    async findByStatus(status) {
        return this.prisma.product.findMany({
            where: { status: status },
        });
    }
    async findByInternalCode(code, companyId) {
        return this.prisma.product.findFirst({
            where: { internalCode: code, companyId },
        });
    }
    async findByCompanyId(companyId, filters) {
        return this.prisma.product.findMany({
            where: { companyId, ...filters },
        });
    }
    async findWithMovements(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { movements: true },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.product.update({
            where: { id }, data: { status },
        });
    }
    async countByStatus(companyId, status) {
        return this.prisma.product.count({
            where: { companyId, status },
        });
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductRepository);
//# sourceMappingURL=product.repository.js.map