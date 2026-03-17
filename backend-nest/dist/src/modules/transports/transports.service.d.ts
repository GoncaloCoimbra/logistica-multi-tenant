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
    findAll(companyId?: string, filters?: FilterTransportDto): Promise<({
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
    findPending(companyId?: string): Promise<({
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
    findInTransit(companyId?: string): Promise<({
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
    update(id: string, data: UpdateTransportDto, companyId?: string, userId?: string): Promise<{
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
    updateStatus(id: string, status: TransportStatus, companyId?: string, userId?: string): Promise<{
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
    deleteTrackingRoute(id: string, companyId?: string, userId?: string): Promise<{
        message: string;
        transportId: string;
    }>;
    clearAllTrackingRoutes(companyId?: string, userId?: string): Promise<{
        message: string;
        routesDeleted: number;
    }>;
}
