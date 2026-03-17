import { PrismaService } from '../../database/prisma.service';
import { VehicleStatus } from '@prisma/client';
export declare class VehiclesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(data: any, companyId: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            email: string;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            nif: string;
            phone: string | null;
            address: string | null;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
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
            email: string;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            nif: string;
            phone: string | null;
            address: string | null;
        };
        transports: {
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            internalCode: string;
            totalWeight: number;
            status: import(".prisma/client").$Enums.TransportStatus;
            vehicleId: string;
            origin: string;
            destination: string;
            departureDate: Date;
            estimatedArrival: Date;
            notes: string | null;
            actualArrival: Date | null;
            receivedBy: string | null;
            receivingNotes: string | null;
        }[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
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
            email: string;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            nif: string;
            phone: string | null;
            address: string | null;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
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
            email: string;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            nif: string;
            phone: string | null;
            address: string | null;
        };
        transports: {
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            internalCode: string;
            totalWeight: number;
            status: import(".prisma/client").$Enums.TransportStatus;
            vehicleId: string;
            origin: string;
            destination: string;
            departureDate: Date;
            estimatedArrival: Date;
            notes: string | null;
            actualArrival: Date | null;
            receivedBy: string | null;
            receivingNotes: string | null;
        }[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
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
            email: string;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            nif: string;
            phone: string | null;
            address: string | null;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
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
            email: string;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            nif: string;
            phone: string | null;
            address: string | null;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
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
