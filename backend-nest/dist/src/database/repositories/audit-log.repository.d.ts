import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { AuditLog } from '@prisma/client';
export declare class AuditLogRepository extends BaseRepository<AuditLog> {
    constructor(prisma: PrismaService);
    findAllWithPagination(where: any, skip: number, take: number): Promise<({
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
    })[]>;
    count(where: any): Promise<number>;
    findByUser(userId: string): Promise<AuditLog[]>;
    findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
    findByCompany(companyId: string): Promise<AuditLog[]>;
    createLog(data: any): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        companyId: string;
        createdAt: Date;
        userId: string;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
    }>;
    getActionStats(companyId: string): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AuditLogGroupByOutputType, "action"[]> & {
        _count: number;
    })[]>;
    getEntityStats(companyId: string): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AuditLogGroupByOutputType, "entity"[]> & {
        _count: number;
    })[]>;
    getTopUsers(companyId: string): Promise<{
        userId: string;
        _count: number;
        user: {
            id: string;
            email: string;
            name: string;
        } | undefined;
    }[]>;
    deleteAllByCompany(companyId: string): Promise<number>;
    findById(id: string): Promise<AuditLog | null>;
    deleteById(id: string): Promise<AuditLog>;
}
