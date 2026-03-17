import { PrismaService } from '../../database/prisma.service';
import { TransportStatus } from '@prisma/client';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { FilterTransportDto } from './dto/filter-transport.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class TransportsService {
    private prisma;
    private notificationsService;
    private auditLogService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, auditLogService: AuditLogService);
    private checkVehicleAvailability;
    autoArriveTransports(): Promise<void>;
    create(date: CreateTransportDto, companyId: string, userId: string): Promise<{
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
    findAll(companyId?: string, filters?: FilterTransportDto): Promise<({
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
    findPending(companyId?: string): Promise<({
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
    findInTransit(companyId?: string): Promise<({
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
    findOne(id: string, companyId?: string): Promise<{
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
    update(id: string, data: UpdateTransportDto, companyId?: string, userId?: string): Promise<{
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
    updateStatus(id: string, status: TransportStatus, companyId?: string, userId?: string): Promise<{
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
    remove(id: string, companyId?: string, userId?: string, force?: boolean): Promise<{
        message: string;
        productsReturned: number;
        details: string;
    } | {
        message: string;
        productsReturned?: undefined;
        details?: undefined;
    }>;
    getStats(companyId?: string): Promise<{
        total: number;
        pending: number;
        inTransit: number;
        arrived: number;
        delivered: number;
        cancelled: number;
    }>;
    private readonly citiesCoordinates;
    private getCityCoordinates;
    getTrackingRoutes(companyId?: string): Promise<{
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
    deleteTrackingRoute(id: string, companyId?: string, userId?: string): Promise<{
        message: string;
        transportId: string;
    }>;
    clearAllTrackingRoutes(companyId?: string, userId?: string): Promise<{
        message: string;
        routesDeleted: number;
    }>;
}
