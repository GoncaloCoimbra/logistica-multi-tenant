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
exports.TransportRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const base_repository_1 = require("./base.repository");
let TransportRepository = class TransportRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'transport');
    }
    async findByCompany(companyId) {
        return this.prisma.transport.findMany({
            where: { companyId },
            include: {
                company: true,
                vehicle: true,
            },
        });
    }
    async findByStatus(status) {
        return this.prisma.transport.findMany({
            where: { status: status },
        });
    }
    async findByCompanyId(companyId, filters) {
        return this.prisma.transport.findMany({
            where: { companyId, ...filters },
        });
    }
    async findPending(companyId) {
        return this.prisma.transport.findMany({
            where: { companyId, status: 'PENDING' },
        });
    }
    async findInTransit(companyId) {
        return this.prisma.transport.findMany({
            where: { companyId, status: 'IN_TRANSIT' },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.transport.update({
            where: { id }, data: { status },
        });
    }
};
exports.TransportRepository = TransportRepository;
exports.TransportRepository = TransportRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransportRepository);
//# sourceMappingURL=transport.repository.js.map