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
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const audit_log_repository_1 = require("../../database/repositories/audit-log.repository");
let AuditLogService = class AuditLogService {
    auditLogRepository;
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async findAll(companyId, filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;
        const where = { companyId };
        if (filters?.action)
            where.action = filters.action;
        if (filters?.entity)
            where.entity = filters.entity;
        if (filters?.userId)
            where.userId = filters.userId;
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                where.createdAt.lte = endDate;
            }
        }
        const [logs, totalItems] = await Promise.all([
            this.auditLogRepository.findAllWithPagination(where, skip, limit),
            this.auditLogRepository.count(where),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            logs,
            totalItems,
            totalPages,
            currentPage: page,
        };
    }
    async findByEntity(entity, entityId, companyId) {
        return this.auditLogRepository.findByEntity(entity, entityId);
    }
    async findByUser(userId, companyId) {
        return this.auditLogRepository.findByUser(userId);
    }
    async getActionStats(companyId) {
        const totalActions = await this.auditLogRepository.count({ companyId });
        const actionsByTypeRaw = await this.auditLogRepository.getActionStats(companyId);
        const actionsByType = actionsByTypeRaw.map(item => ({
            action: item.action,
            count: item._count,
        }));
        const actionsByEntityRaw = await this.auditLogRepository.getEntityStats(companyId);
        const actionsByEntity = actionsByEntityRaw.map(item => ({
            entity: item.entity,
            count: item._count,
        }));
        const topUsersRaw = await this.auditLogRepository.getTopUsers(companyId);
        const topUsers = topUsersRaw.map(item => ({
            userId: item.userId,
            userName: item.user?.name || 'Desconhecido',
            userEmail: item.user?.email || 'N/A',
            count: item._count,
        }));
        return {
            totalActions,
            actionsByType,
            actionsByEntity,
            topUsers,
        };
    }
    async createLog(data) {
        return this.auditLogRepository.createLog({
            action: data.action,
            entity: data.entity,
            entityId: data.entityId || undefined,
            userId: data.userId,
            companyId: data.companyId,
            ipAddress: data.ipAddress || undefined,
            data: data.metadata || undefined,
        });
    }
    async clearAllLogs(companyId) {
        try {
            const deletedCount = await this.auditLogRepository.deleteAllByCompany(companyId);
            console.log(`[AuditLog] Deleted ${deletedCount} logs for company ${companyId}`);
            return deletedCount;
        }
        catch (error) {
            console.error(`[AuditLog] Error clearing logs for company ${companyId}:`, error);
            throw error;
        }
    }
    async deleteLog(id, companyId) {
        const log = await this.auditLogRepository.findById(id);
        if (!log || log.companyId !== companyId) {
            return false;
        }
        await this.auditLogRepository.deleteById(id);
        return true;
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_repository_1.AuditLogRepository])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map