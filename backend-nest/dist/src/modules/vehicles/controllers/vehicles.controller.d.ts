import { VehiclesService } from '../vehicles.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    private readonly logger;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: CreateVehicleDto, req: any): Promise<{
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
    findAll(req: any, filters?: any): Promise<({
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
    findAvailable(req: any, queryCompanyId?: string): Promise<({
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
    getStats(req: any, queryCompanyId?: string): Promise<{
        total: number;
        available: number;
        inUse: number;
        inMaintenance: number;
        retired: number;
    }>;
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateVehicleDto: UpdateVehicleDto, req: any): Promise<{
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
    updateStatus(id: string, body: {
        status: string;
    }, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
        finishedTransports: number;
    }>;
}
