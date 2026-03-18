import { NotificationsService } from '../notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
interface UserPayload {
    id: string;
    companyId: string | null;
    email: string;
    role: Role;
}
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly prisma;
    constructor(notificationsService: NotificationsService, prisma: PrismaService);
    create(createNotificationDto: CreateNotificationDto, user: UserPayload): Promise<{
        company: {
            id: string;
            name: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        userId: string;
        title: string;
        content: string;
        isRead: boolean;
    }>;
    test(user: UserPayload): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            companyId: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
        timestamp: Date;
    }>;
    findAll(user: UserPayload): Promise<{
        total: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        notifications: {
            id: string;
            type: "info";
            title: string;
            message: string;
            entityType: "product";
            entityId: string;
            createdAt: string;
            priority: "medium";
            read: boolean;
        }[];
    }>;
    findUnread(user: UserPayload): Promise<({
        company: {
            id: string;
            name: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        userId: string;
        title: string;
        content: string;
        isRead: boolean;
    })[]>;
    countUnread(user: UserPayload): Promise<{
        count: number;
    }>;
    markAsRead(id: string): Promise<{
        company: {
            id: string;
            name: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        userId: string;
        title: string;
        content: string;
        isRead: boolean;
    }>;
    markAllAsRead(user: UserPayload): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsReadAlias(user: UserPayload): Promise<import(".prisma/client").Prisma.BatchPayload>;
    removeAll(user: UserPayload): Promise<{
        success: boolean;
        deleted: number;
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        id: string;
    }>;
}
export {};
