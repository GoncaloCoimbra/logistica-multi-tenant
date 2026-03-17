import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Product } from '@prisma/client';
export declare class ProductRepository extends BaseRepository<Product> {
    constructor(prisma: PrismaService);
    findByCompany(companyId: string): Promise<Product[]>;
    findByStatus(status: string): Promise<Product[]>;
    findByInternalCode(code: string, companyId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        internalCode: string;
        description: string;
        quantity: number;
        unit: string;
        totalWeight: number | null;
        totalVolume: number | null;
        currentLocation: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        supplierId: string;
    } | null>;
    findByCompanyId(companyId: string, filters?: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        internalCode: string;
        description: string;
        quantity: number;
        unit: string;
        totalWeight: number | null;
        totalVolume: number | null;
        currentLocation: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        supplierId: string;
    }[]>;
    findWithMovements(id: string): Promise<({
        movements: {
            id: string;
            createdAt: Date;
            userId: string;
            quantity: number;
            productId: string;
            previousStatus: import(".prisma/client").$Enums.ProductStatus;
            newStatus: import(".prisma/client").$Enums.ProductStatus;
            location: string;
            reason: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        internalCode: string;
        description: string;
        quantity: number;
        unit: string;
        totalWeight: number | null;
        totalVolume: number | null;
        currentLocation: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        supplierId: string;
    }) | null>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        internalCode: string;
        description: string;
        quantity: number;
        unit: string;
        totalWeight: number | null;
        totalVolume: number | null;
        currentLocation: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        supplierId: string;
    }>;
    countByStatus(companyId: string, status: any): Promise<number>;
}
