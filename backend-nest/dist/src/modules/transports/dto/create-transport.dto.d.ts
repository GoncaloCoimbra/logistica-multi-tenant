import { TransportStatus } from '@prisma/client';
export declare class TransportProductDto {
    productId: string;
    quantity: number;
}
export declare class CreateTransportDto {
    vehicleId: string;
    origin: string;
    destination: string;
    departureDate: string;
    estimatedArrival: string;
    totalWeight: number;
    notes?: string;
    status?: TransportStatus;
    companyId?: string;
    products?: TransportProductDto[];
}
