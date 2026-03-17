import { AuditLogService } from '../audit-log.service';
import { FilterAuditLogDto } from '../dto/filter-audit-log.dto';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    clearAllLogs(user: any): Promise<{
        success: boolean;
        message: string;
        deletedCount: number;
        timestamp: string;
    }>;
    getStats(user: any): Promise<{
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
    findByEntity(entity: string, entityId: string, user: any): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        companyId: string;
        createdAt: Date;
        userId: string;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
    }[]>;
    findByUser(userId: string, user: any): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        companyId: string;
        createdAt: Date;
        userId: string;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
    }[]>;
    deleteLog(id: string, user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    findAll(user: any, filters: FilterAuditLogDto): Promise<{
        logs: ({
            user: {
                id: string;
                email: string;
                name: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            data: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            companyId: string;
            createdAt: Date;
            userId: string;
            action: string;
            entity: string;
            entityId: string | null;
            ipAddress: string | null;
        })[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
}
