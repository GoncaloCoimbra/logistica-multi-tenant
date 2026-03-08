import { PrismaService } from '../../database/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        title: string;
        message: string;
        companyId: string;
        userId: string;
    }): Promise<{
        company: {
            id: string;
            name: string;
        };
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isRead: boolean;
    }>;
    findByCompany(companyId: string | null | undefined): Promise<{
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
    findUnreadByCompany(companyId: string | null | undefined): Promise<({
        company: {
            id: string;
            name: string;
        };
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isRead: boolean;
    })[]>;
    markAsRead(id: string): Promise<{
        company: {
            id: string;
            name: string;
        };
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isRead: boolean;
    }>;
    markAllAsRead(companyId: string | null | undefined): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(id: string): Promise<{
        id: string;
        userId: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isRead: boolean;
    }>;
    countUnread(companyId: string | null | undefined): Promise<number>;
    notifyTransportArrived(companyId: string, transportCode: string, origin: string, destination: string): Promise<void>;
    notifyTransportDelivered(companyId: string, transportCode: string, receivedBy: string): Promise<void>;
    notifyTransportError(companyId: string, title: string, message: string): Promise<void>;
}
