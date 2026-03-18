import { AuditLogRepository } from '../../database/repositories/audit-log.repository';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
export declare class AuditLogService {
    private auditLogRepository;
    constructor(auditLogRepository: AuditLogRepository);
    findAll(companyId: string, filters?: FilterAuditLogDto & {
        page?: number;
        limit?: number;
    }): Promise<{
        logs: ({
            user: {
                id: string;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            companyId: string;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            action: string;
            entity: string;
            entityId: string | null;
            ipAddress: string | null;
        })[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }>;
    findByEntity(entity: string, entityId: string, companyId: string): Promise<{
        id: string;
        createdAt: Date;
        companyId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
    }[]>;
    findByUser(userId: string, companyId: string): Promise<{
        id: string;
        createdAt: Date;
        companyId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
    }[]>;
    getActionStats(companyId: string): Promise<{
        totalActions: number;
        actionsByType: {
            action: string;
            count: number;
        }[];
        actionsByEntity: {
            entity: string;
            count: number;
        }[];
        topUsers: {
            userId: string;
            userName: string;
            userEmail: string;
            count: number;
        }[];
    }>;
    createLog(data: {
        action: string;
        entity: string;
        entityId?: string;
        userId: string;
        companyId: string;
        ipAddress?: string;
        metadata?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        companyId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
    }>;
    clearAllLogs(companyId: string): Promise<number>;
    deleteLog(id: string, companyId: string): Promise<boolean>;
}
