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
    findAll(req: any, filters?: any): Promise<({
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
    findAvailable(req: any, queryCompanyId?: string): Promise<({
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
    getStats(req: any, queryCompanyId?: string): Promise<{
        total: number;
        available: number;
        inUse: number;
        inMaintenance: number;
        retired: number;
    }>;
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateVehicleDto: UpdateVehicleDto, req: any): Promise<{
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
    updateStatus(id: string, body: {
        status: string;
    }, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
        finishedTransports: number;
    }>;
}
