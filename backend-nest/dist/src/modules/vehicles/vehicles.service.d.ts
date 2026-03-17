import { PrismaService } from '../../database/prisma.service';
import { VehicleStatus } from '@prisma/client';
export declare class VehiclesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(date: any, companyId: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            isActive: boolean;
            nif: string;
            phone: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import(".prisma/client").$Enums.VehicleStatus;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
    }>;
    findAll(companyId?: string, filters?: {
        status?: VehicleStatus;
        type?: string;
    }): Promise<({
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            isActive: boolean;
            nif: string;
            phone: string | null;
            address: string | null;
        };
        transports: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            internalCode: string;
            totalWeight: number;
            status: import(".prisma/client").$Enums.TransportStatus;
            origin: string;
            destination: string;
            departureDate: Date;
            estimatedArrival: Date;
            actualArrival: Date | null;
            receivedBy: string | null;
            receivingNotes: string | null;
            notes: string | null;
            vehicleId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import(".prisma/client").$Enums.VehicleStatus;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
    })[]>;
    findAvailable(companyId?: string): Promise<({
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            isActive: boolean;
            nif: string;
            phone: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import(".prisma/client").$Enums.VehicleStatus;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
    })[]>;
    findOne(id: string, companyId?: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            isActive: boolean;
            nif: string;
            phone: string | null;
            address: string | null;
        };
        transports: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            internalCode: string;
            totalWeight: number;
            status: import(".prisma/client").$Enums.TransportStatus;
            origin: string;
            destination: string;
            departureDate: Date;
            estimatedArrival: Date;
            actualArrival: Date | null;
            receivedBy: string | null;
            receivingNotes: string | null;
            notes: string | null;
            vehicleId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import(".prisma/client").$Enums.VehicleStatus;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
    }>;
    update(id: string, data: any, companyId?: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            isActive: boolean;
            nif: string;
            phone: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import(".prisma/client").$Enums.VehicleStatus;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
    }>;
    updateStatus(id: string, status: VehicleStatus, companyId?: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            isActive: boolean;
            nif: string;
            phone: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import(".prisma/client").$Enums.VehicleStatus;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
    }>;
    remove(id: string, companyId?: string): Promise<{
        message: string;
        finishedTransports: number;
    }>;
    getStats(companyId?: string): Promise<{
        total: number;
        available: number;
        inUse: number;
        inMaintenance: number;
        retired: number;
    }>;
}
