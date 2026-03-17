import { PrismaService } from '../../database/prisma.service';
export declare class SuperadminService {
    private prisma;
    constructor(prisma: PrismaService);
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
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    })[]>;
    createCompany(data: any): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    getCompany(id: string): Promise<{
        _count: {
            products: number;
            suppliers: number;
            transports: number;
            vehicles: number;
        };
        users: {
            id: string;
            companyId: string | null;
            createdAt: Date;
            email: string;
            name: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            avatarUrl: string | null;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    updateCompany(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    deleteCompany(id: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    getCompanyStats(companyId: string): Promise<{
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
    toggleCompanyStatus(id: string, isActive: boolean): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
}
