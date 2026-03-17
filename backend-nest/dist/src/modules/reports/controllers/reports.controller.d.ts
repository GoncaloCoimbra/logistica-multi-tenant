import { ReportsService } from '../reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getProductsReport(user: any): Promise<{
        title: string;
        data: ({
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
            } | null;
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
        })[];
        generatedAt: Date;
    }>;
    getTransportsReport(user: any): Promise<{
        title: string;
        data: ({
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
        })[];
        generatedAt: Date;
    }>;
}
