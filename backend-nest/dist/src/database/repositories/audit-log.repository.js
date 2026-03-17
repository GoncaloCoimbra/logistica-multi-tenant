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
exports.AuditLogRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const base_repository_1 = require("./base.repository");
let AuditLogRepository = class AuditLogRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'auditLog');
    }
    async findAllWithPagination(where, skip, take) {
        return this.prisma.auditLog.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async count(where) {
        return this.prisma.auditLog.count({ where });
    }
    async findByUser(userId) {
        return this.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async findByEntity(entityType, entityId) {
        return this.prisma.auditLog.findMany({
            where: { entityId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async findByCompany(companyId) {
        return this.prisma.auditLog.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            take: 100,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async createLog(data) {
        return this.create(data);
    }
    async getActionStats(companyId) {
        return this.prisma.auditLog.groupBy({
            by: ['action'],
            where: { companyId },
            _count: true,
            orderBy: {
                _count: {
                    action: 'desc',
                },
            },
        });
    }
    async getEntityStats(companyId) {
        return this.prisma.auditLog.groupBy({
            by: ['entity'],
            where: { companyId },
            _count: true,
            orderBy: {
                _count: {
                    entity: 'desc',
                },
            },
        });
    }
    async getTopUsers(companyId) {
        const result = await this.prisma.auditLog.groupBy({
            by: ['userId'],
            where: { companyId },
            _count: true,
            orderBy: {
                _count: {
                    userId: 'desc',
                },
            },
            take: 10,
        });
        const userIds = result.map((r) => r.userId);
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, email: true },
        });
        return result.map((r) => ({
            userId: r.userId,
            _count: r._count,
            user: users.find((u) => u.id === r.userId),
        }));
    }
    async deleteAllByCompany(companyId) {
        const res = await this.prisma.auditLog.deleteMany({ where: { companyId } });
        return res.count || 0;
    }
    async findById(id) {
        return this.findOne({ id });
    }
    async deleteById(id) {
        return this.delete({ id });
    }
};
exports.AuditLogRepository = AuditLogRepository;
exports.AuditLogRepository = AuditLogRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogRepository);
//# sourceMappingURL=audit-log.repository.js.map