import { PrismaService } from '../prisma.service';
import { Vehicle, Prisma } from '@prisma/client';
export declare class VehicleRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Vehicle[]>;
    findById(id: string): Promise<Vehicle | null>;
    findOne(id: string): Promise<Vehicle | null>;
    findByCompany(companyId: string): Promise<Vehicle[]>;
    findByCompanyId(companyId: string): Promise<Vehicle[]>;
    findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
    findAvailable(companyId?: string): Promise<Vehicle[]>;
    create(data: Prisma.VehicleCreateInput): Promise<Vehicle>;
    update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle>;
    updateStatus(id: string, status: any): Promise<Vehicle>;
    delete(id: string): Promise<Vehicle>;
}
