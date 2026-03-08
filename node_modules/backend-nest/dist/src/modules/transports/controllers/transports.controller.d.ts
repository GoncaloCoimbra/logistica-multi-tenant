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
            email: string;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            nif: string;
            phone: string | null;
            address: string | null;
        };
        vehicle: {
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
        };
    } & {
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
    }>;
    findAll(req: any, filters: FilterTransportDto, queryCompanyId?: string): Promise<({
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
        products: ({
            product: {
                supplier: {
                    id: string;
                    companyId: string;
                    createdAt: Date;
                    email: string | null;
                    name: string;
                    updatedAt: Date;
                    nif: string;
                    phone: string | null;
                    address: string | null;
                    city: string | null;
                    state: string | null;
                };
            } & {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                internalCode: string;
                description: string;
                unit: string;
                totalWeight: number | null;
                totalVolume: number | null;
                currentLocation: string | null;
                status: import(".prisma/client").$Enums.ProductStatus;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            transportId: string;
        })[];
        vehicle: {
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
        };
    } & {
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
    })[]>;
    findPending(req: any, queryCompanyId?: string): Promise<({
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
        products: ({
            product: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                internalCode: string;
                description: string;
                unit: string;
                totalWeight: number | null;
                totalVolume: number | null;
                currentLocation: string | null;
                status: import(".prisma/client").$Enums.ProductStatus;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            transportId: string;
        })[];
        vehicle: {
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
        };
    } & {
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
    })[]>;
    findInTransit(req: any, queryCompanyId?: string): Promise<({
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
        products: ({
            product: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                internalCode: string;
                description: string;
                unit: string;
                totalWeight: number | null;
                totalVolume: number | null;
                currentLocation: string | null;
                status: import(".prisma/client").$Enums.ProductStatus;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            transportId: string;
        })[];
        vehicle: {
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
        };
    } & {
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
    })[]>;
    findOne(id: string, req: any): Promise<{
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
        products: ({
            product: {
                supplier: {
                    id: string;
                    companyId: string;
                    createdAt: Date;
                    email: string | null;
                    name: string;
                    updatedAt: Date;
                    nif: string;
                    phone: string | null;
                    address: string | null;
                    city: string | null;
                    state: string | null;
                };
            } & {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                internalCode: string;
                description: string;
                unit: string;
                totalWeight: number | null;
                totalVolume: number | null;
                currentLocation: string | null;
                status: import(".prisma/client").$Enums.ProductStatus;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            transportId: string;
        })[];
        vehicle: {
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
        };
    } & {
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
    }>;
    update(id: string, updateTransportDto: UpdateTransportDto, req: any): Promise<{
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
        products: ({
            product: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                internalCode: string;
                description: string;
                unit: string;
                totalWeight: number | null;
                totalVolume: number | null;
                currentLocation: string | null;
                status: import(".prisma/client").$Enums.ProductStatus;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            transportId: string;
        })[];
        vehicle: {
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
        };
    } & {
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
    }>;
    updateStatus(id: string, body: {
        status: string;
    }, req: any): Promise<{
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
        products: ({
            product: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                internalCode: string;
                description: string;
                unit: string;
                totalWeight: number | null;
                totalVolume: number | null;
                currentLocation: string | null;
                status: import(".prisma/client").$Enums.ProductStatus;
                supplierId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            transportId: string;
        })[];
        vehicle: {
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
        };
    } & {
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
        };
        vehicleId: string;
        transportId: string;
        transport: {
            id: string;
        } | undefined;
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
