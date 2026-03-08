import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Product } from '@prisma/client';
export declare class ProductRepository extends BaseRepository<Product> {
    constructor(prisma: PrismaService);
    findByCompany(companyId: string): Promise<Product[]>;
    findByStatus(status: string): Promise<Product[]>;
    findByInternalCode(code: string, companyId: string): Promise<{
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        internalCode: string;
        description: string;
        unit: string;
        totalWeight: number | null;
        totalVolume: number | null;
        currentLocation: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        supplierId: string;
    } | null>;
    findByCompanyId(companyId: string, filters?: any): Promise<{
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        internalCode: string;
        description: string;
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
            userId: string;
            createdAt: Date;
            productId: string;
            previousStatus: import(".prisma/client").$Enums.ProductStatus;
            newStatus: import(".prisma/client").$Enums.ProductStatus;
            quantity: number;
            location: string;
            reason: string | null;
        }[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        internalCode: string;
        description: string;
        unit: string;
        totalWeight: number | null;
        totalVolume: number | null;
        currentLocation: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        supplierId: string;
    }) | null>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        internalCode: string;
        description: string;
        unit: string;
        totalWeight: number | null;
        totalVolume: number | null;
        currentLocation: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        supplierId: string;
    }>;
    countByStatus(companyId: string, status: any): Promise<number>;
}
