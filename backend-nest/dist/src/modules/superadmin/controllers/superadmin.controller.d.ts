import { SuperadminService } from '../superadmin.service';
export declare class SuperAdminController {
    private readonly superadminService;
    constructor(superadminService: SuperadminService);
    getGlobalStats(): Promise<{
        totalCompanies: number;
        totalUsers: number;
        totalProducts: number;
        totalSuppliers: number;
        totalVehicles: number;
        topCompanies: {
            id: string;
            name: string;
            _count: {
                products: number;
                suppliers: number;
                users: number;
            };
        }[];
    }>;
    getAllCompanies(): Promise<({
        _count: {
            products: number;
            suppliers: number;
            users: number;
            vehicles: number;
        };
    } & {
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCompany(id: string): Promise<{
        users: {
            id: string;
            name: string;
            email: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            avatarUrl: string | null;
            companyId: string | null;
        }[];
        _count: {
            products: number;
            suppliers: number;
            transports: number;
            vehicles: number;
        };
    } & {
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCompanyStats(id: string): Promise<{
        company: {
            id: string;
            name: string;
            nif: string;
        };
        stats: {
            products: number;
            suppliers: number;
            transports: number;
            users: number;
            vehicles: number;
        };
    }>;
    createCompany(data: any): Promise<{
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateCompany(id: string, data: any): Promise<{
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleCompanyStatus(id: string, isActive: boolean): Promise<{
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCompany(id: string): Promise<{
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
