import { ReportsService } from '../reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getProductsReport(user: any): Promise<{
        title: string;
        data: ({
            company: {
                id: string;
                name: string;
                nif: string;
                email: string;
                phone: string | null;
                address: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            supplier: {
                id: string;
                name: string;
                nif: string;
                email: string | null;
                phone: string | null;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                city: string | null;
                state: string | null;
                companyId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            internalCode: string;
            description: string;
            quantity: number;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
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
