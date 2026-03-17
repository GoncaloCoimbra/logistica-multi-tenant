import { TransportsService } from '../transports.service';
import { CreateTransportDto } from '../dto/create-transport.dto';
import { UpdateTransportDto } from '../dto/update-transport.dto';
import { FilterTransportDto } from '../dto/filter-transport.dto';
export declare class TransportsController {
    private readonly transportsService;
    private readonly logger;
    constructor(transportsService: TransportsService);
    create(createTransportDto: CreateTransportDto, req: any): Promise<{
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
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VehicleStatus;
            companyId: string;
            licensePlate: string;
            type: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        };
    } & {
        id: string;
        internalCode: string;
        origin: string;
        destination: string;
        departureDate: Date;
        estimatedArrival: Date;
        actualArrival: Date | null;
        receivedBy: string | null;
        receivingNotes: string | null;
        totalWeight: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransportStatus;
        vehicleId: string;
        companyId: string;
    }>;
    findAll(req: any, filters: FilterTransportDto, queryCompanyId?: string): Promise<({
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
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VehicleStatus;
            companyId: string;
            licensePlate: string;
            type: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        };
        products: ({
            product: {
                supplier: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    companyId: string;
                    name: string;
                    nif: string;
                    email: string | null;
                    phone: string | null;
                    address: string | null;
                    city: string | null;
                    state: string | null;
                };
            } & {
                id: string;
                internalCode: string;
                totalWeight: number | null;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ProductStatus;
                companyId: string;
                quantity: number;
                description: string;
                unit: string;
                totalVolume: number | null;
                currentLocation: string | null;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            transportId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        internalCode: string;
        origin: string;
        destination: string;
        departureDate: Date;
        estimatedArrival: Date;
        actualArrival: Date | null;
        receivedBy: string | null;
        receivingNotes: string | null;
        totalWeight: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransportStatus;
        vehicleId: string;
        companyId: string;
    })[]>;
    findPending(req: any, queryCompanyId?: string): Promise<({
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
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VehicleStatus;
            companyId: string;
            licensePlate: string;
            type: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        };
        products: ({
            product: {
                id: string;
                internalCode: string;
                totalWeight: number | null;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ProductStatus;
                companyId: string;
                quantity: number;
                description: string;
                unit: string;
                totalVolume: number | null;
                currentLocation: string | null;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            transportId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        internalCode: string;
        origin: string;
        destination: string;
        departureDate: Date;
        estimatedArrival: Date;
        actualArrival: Date | null;
        receivedBy: string | null;
        receivingNotes: string | null;
        totalWeight: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransportStatus;
        vehicleId: string;
        companyId: string;
    })[]>;
    findInTransit(req: any, queryCompanyId?: string): Promise<({
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
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VehicleStatus;
            companyId: string;
            licensePlate: string;
            type: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        };
        products: ({
            product: {
                id: string;
                internalCode: string;
                totalWeight: number | null;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ProductStatus;
                companyId: string;
                quantity: number;
                description: string;
                unit: string;
                totalVolume: number | null;
                currentLocation: string | null;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            transportId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        internalCode: string;
        origin: string;
        destination: string;
        departureDate: Date;
        estimatedArrival: Date;
        actualArrival: Date | null;
        receivedBy: string | null;
        receivingNotes: string | null;
        totalWeight: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransportStatus;
        vehicleId: string;
        companyId: string;
    })[]>;
    findOne(id: string, req: any): Promise<{
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
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VehicleStatus;
            companyId: string;
            licensePlate: string;
            type: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        };
        products: ({
            product: {
                supplier: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    companyId: string;
                    name: string;
                    nif: string;
                    email: string | null;
                    phone: string | null;
                    address: string | null;
                    city: string | null;
                    state: string | null;
                };
            } & {
                id: string;
                internalCode: string;
                totalWeight: number | null;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ProductStatus;
                companyId: string;
                quantity: number;
                description: string;
                unit: string;
                totalVolume: number | null;
                currentLocation: string | null;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            transportId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        internalCode: string;
        origin: string;
        destination: string;
        departureDate: Date;
        estimatedArrival: Date;
        actualArrival: Date | null;
        receivedBy: string | null;
        receivingNotes: string | null;
        totalWeight: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransportStatus;
        vehicleId: string;
        companyId: string;
    }>;
    update(id: string, updateTransportDto: UpdateTransportDto, req: any): Promise<{
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
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VehicleStatus;
            companyId: string;
            licensePlate: string;
            type: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        };
        products: ({
            product: {
                id: string;
                internalCode: string;
                totalWeight: number | null;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ProductStatus;
                companyId: string;
                quantity: number;
                description: string;
                unit: string;
                totalVolume: number | null;
                currentLocation: string | null;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            transportId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        internalCode: string;
        origin: string;
        destination: string;
        departureDate: Date;
        estimatedArrival: Date;
        actualArrival: Date | null;
        receivedBy: string | null;
        receivingNotes: string | null;
        totalWeight: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransportStatus;
        vehicleId: string;
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
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VehicleStatus;
            companyId: string;
            licensePlate: string;
            type: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        };
        products: ({
            product: {
                id: string;
                internalCode: string;
                totalWeight: number | null;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ProductStatus;
                companyId: string;
                quantity: number;
                description: string;
                unit: string;
                totalVolume: number | null;
                currentLocation: string | null;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            transportId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        internalCode: string;
        origin: string;
        destination: string;
        departureDate: Date;
        estimatedArrival: Date;
        actualArrival: Date | null;
        receivedBy: string | null;
        receivingNotes: string | null;
        totalWeight: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransportStatus;
        vehicleId: string;
        companyId: string;
    }>;
    remove(id: string, req: any, force?: string): Promise<{
        message: string;
        productsReturned: number;
        details: string;
    } | {
        message: string;
        productsReturned?: undefined;
        details?: undefined;
    }>;
    getTrackingRoutes(req: any): Promise<{
        id: string;
        name: string;
        origin: string;
        destination: string;
        origin_lat: number;
        origin_lng: number;
        destination_lat: number;
        destination_lng: number;
        status: string;
        startTime: Date;
        endTime: Date;
        actualArrival: Date | null;
        locations: {
            lat: number;
            lng: number;
            timestamp: string;
            speed: number;
        }[];
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VehicleStatus;
            companyId: string;
            licensePlate: string;
            type: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        };
        vehicleId: string;
        transportId: string;
        transport: {
            id: string;
        } | undefined;
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
    }[]>;
    clearAllTrackingRoutes(req: any): Promise<{
        message: string;
        routesDeleted: number;
    }>;
    deleteTrackingRoute(id: string, req: any): Promise<{
        message: string;
        transportId: string;
    }>;
}
