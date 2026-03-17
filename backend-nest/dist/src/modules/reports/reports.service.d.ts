import { PrismaService } from '../../database/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    generateProductReport(companyId: string): Promise<{
        title: string;
        data: ({
            company: {
                id: string;
                email: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                nif: string;
                phone: string | null;
                address: string | null;
            } | null;
            supplier: {
                id: string;
                email: string | null;
                name: string;
                companyId: string;
                createdAt: Date;
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
            description: string;
            internalCode: string;
            quantity: number;
            unit: string;
            totalWeight: number | null;
            totalVolume: number | null;
            currentLocation: string | null;
            supplierId: string;
            status: import(".prisma/client").$Enums.ProductStatus;
        })[];
        generatedAt: Date;
    }>;
    generateTransportReport(companyId: string): Promise<{
        title: string;
        data: ({
            vehicle: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                status: import(".prisma/client").$Enums.VehicleStatus;
                licensePlate: string;
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
        })[];
        generatedAt: Date;
    }>;
}
