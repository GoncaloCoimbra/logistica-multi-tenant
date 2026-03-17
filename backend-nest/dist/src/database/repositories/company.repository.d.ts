import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Company } from '@prisma/client';
export declare class CompanyRepository extends BaseRepository<Company> {
    constructor(prisma: PrismaService);
    findWithUsers(id: string): Promise<({
        products: {
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            internalCode: string;
            quantity: number;
            unit: string;
            totalWeight: number | null;
            totalVolume: number | null;
            currentLocation: string | null;
            supplierId: string;
            status: import(".prisma/client").$Enums.ProductStatus;
        }[];
        users: {
            id: string;
            email: string;
            name: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            avatarUrl: string | null;
            companyId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        vehicles: {
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            status: import(".prisma/client").$Enums.VehicleStatus;
            licensePlate: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }) | null>;
    findByTenant(tenant: string): Promise<Company | null>;
    findByNif(nif: string): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    } | null>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    } | null>;
    findWithStats(id: string): Promise<({
        _count: {
            products: number;
            users: number;
            vehicles: number;
        };
    } & {
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }) | null>;
}
