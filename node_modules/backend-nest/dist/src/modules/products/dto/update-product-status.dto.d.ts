import { ProductStatus } from '@prisma/client';
export declare class UpdateProductStatusDto {
    newStatus: ProductStatus;
    quantity?: number;
    location?: string;
    reason?: string;
}
