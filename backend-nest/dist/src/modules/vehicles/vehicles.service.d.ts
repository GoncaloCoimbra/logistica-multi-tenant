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
            updatedAt: Date;
            name: string;
            nif: string;
            email: string;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
        status: import(".prisma/client").$Enums.VehicleStatus;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
    }>;
    findAll(companyId?: string, filters?: {
        status?: VehicleStatus;
        type?: string;
    }): Promise<({
        transports: {
            id: string;
            status: import(".prisma/client").$Enums.TransportStatus;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            internalCode: string;
            vehicleId: string;
            origin: string;
            destination: string;
            departureDate: Date;
            estimatedArrival: Date;
            actualArrival: Date | null;
            receivedBy: string | null;
            receivingNotes: string | null;
            totalWeight: number;
            notes: string | null;
        }[];
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            nif: string;
            email: string;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
        status: import(".prisma/client").$Enums.VehicleStatus;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
    })[]>;
    findAvailable(companyId?: string): Promise<({
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            nif: string;
            email: string;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
        status: import(".prisma/client").$Enums.VehicleStatus;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
    })[]>;
    findOne(id: string, companyId?: string): Promise<{
        transports: {
            id: string;
            status: import(".prisma/client").$Enums.TransportStatus;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            internalCode: string;
            vehicleId: string;
            origin: string;
            destination: string;
            departureDate: Date;
            estimatedArrival: Date;
            actualArrival: Date | null;
            receivedBy: string | null;
            receivingNotes: string | null;
            totalWeight: number;
            notes: string | null;
        }[];
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            nif: string;
            email: string;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
        status: import(".prisma/client").$Enums.VehicleStatus;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
    }>;
    update(id: string, data: any, companyId?: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            nif: string;
            email: string;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
        status: import(".prisma/client").$Enums.VehicleStatus;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
    }>;
    updateStatus(id: string, status: VehicleStatus, companyId?: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            nif: string;
            email: string;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        licensePlate: string;
        type: string;
        model: string;
        brand: string;
        capacity: number;
        year: number;
        status: import(".prisma/client").$Enums.VehicleStatus;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
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
