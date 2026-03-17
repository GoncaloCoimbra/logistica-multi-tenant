import { PrismaService } from '../../database/prisma.service';
import { DashboardFiltersDto } from './dto/dashboard-filters.dto';
export declare class DashboardService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getStats(companyId?: string): Promise<{
        totalProducts: number;
        totalSuppliers: number;
        totalVehicles: number;
        totalTransports: number;
        vehiclesAvailable: number;
        productsInStorage: number;
        productsByStatus: {
            status: import(".prisma/client").$Enums.ProductStatus;
            count: number;
        }[];
        summary: {
            received: number;
            inAnalysis: number;
            inStorage: number;
            delivered: number;
            rejected: number;
        };
        percentages: {
            received: string;
            inStorage: string;
            delivered: string;
            rejected: string;
        };
        topSuppliers: {
            id: string;
            name: string;
            productCount: number;
        }[];
        recentMovements: number;
    }>;
    getOverview(companyId?: string, filters?: DashboardFiltersDto): Promise<{
        message: string;
        companyId: string;
        filters: DashboardFiltersDto | undefined;
    }>;
    getProductsByStatus(companyId?: string): Promise<{
        status: import(".prisma/client").$Enums.ProductStatus;
        count: number;
    }[]>;
    getTransportsByStatus(companyId?: string): Promise<{
        status: import(".prisma/client").$Enums.TransportStatus;
        count: number;
    }[]>;
    getRecentActivity(companyId?: string): Promise<({
        user: {
            email: string;
            name: string;
        };
    } & {
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        companyId: string;
        userId: string;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
    })[]>;
    getMonthlyStats(companyId?: string): Promise<{
        message: string;
        companyId: string;
        data: never[];
    }>;
    getTopSuppliers(companyId?: string): Promise<{
        id: string;
        name: string;
        nif: string;
        productCount: number;
    }[]>;
}
