import { ProductStatus } from '@prisma/client';
export declare class CreateProductDto {
    internalCode: string;
    description: string;
    quantity: number;
    unit: string;
    totalWeight?: number;
    totalVolume?: number;
    currentLocation?: string;
    supplierId: string;
    status?: ProductStatus;
}
