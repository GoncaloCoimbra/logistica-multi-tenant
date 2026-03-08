import { VehicleStatus } from '@prisma/client';
export declare class CreateVehicleDto {
    licensePlate: string;
    model: string;
    brand: string;
    type: string;
    capacity: number;
    year: number;
    status?: VehicleStatus;
    companyId?: string;
    userId?: string;
}
