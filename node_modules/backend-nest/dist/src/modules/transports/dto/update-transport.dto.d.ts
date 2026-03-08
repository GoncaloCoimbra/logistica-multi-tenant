import { TransportStatus } from '@prisma/client';
export declare class UpdateTransportDto {
    vehicleId?: string;
    origin?: string;
    destination?: string;
    departureDate?: string;
    estimatedArrival?: string;
    totalWeight?: number;
    notes?: string;
    status?: TransportStatus;
    actualArrival?: string;
    receivedBy?: string;
    receivingNotes?: string;
}
