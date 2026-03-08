import { TransportStatus } from '@prisma/client';
export declare class FilterTransportDto {
    status?: TransportStatus;
    startDate?: string;
    endDate?: string;
    vehicleId?: string;
}
