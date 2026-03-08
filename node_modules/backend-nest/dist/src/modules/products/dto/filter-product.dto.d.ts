import { ProductStatus } from '@prisma/client';
export declare class FilterProductDto {
    status?: ProductStatus;
    supplierId?: string;
    search?: string;
    supplier?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
}
