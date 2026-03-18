import { DashboardService } from '../dashboard.service';
import { DashboardFiltersDto } from '../dto/dashboard-filters.dto';
export declare class DashboardController {
    private readonly dashboardService;
    private readonly logger;
    constructor(dashboardService: DashboardService);
    getStats(req: any, queryCompanyId?: string): Promise<{
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
    getOverview(req: any, filters: DashboardFiltersDto, queryCompanyId?: string): Promise<{
        message: string;
        companyId: string;
        filters: DashboardFiltersDto | undefined;
    }>;
    getProductsByStatus(req: any, queryCompanyId?: string): Promise<{
        status: import(".prisma/client").$Enums.ProductStatus;
        count: number;
    }[]>;
    getTransportsByStatus(req: any, queryCompanyId?: string): Promise<{
        status: import(".prisma/client").$Enums.TransportStatus;
        count: number;
    }[]>;
    getRecentActivity(req: any, queryCompanyId?: string): Promise<({
        user: {
            name: string;
            email: string;
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
    })[]>;
    getMonthlyStats(req: any, queryCompanyId?: string): Promise<{
        message: string;
        companyId: string;
        data: never[];
    }>;
    getTopSuppliers(req: any, queryCompanyId?: string): Promise<{
        id: string;
        name: string;
        nif: string;
        productCount: number;
    }[]>;
}
