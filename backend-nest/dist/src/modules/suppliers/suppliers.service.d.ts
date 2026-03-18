import { PrismaService } from '../../database/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SerializedSupplier } from './interfaces/supplier.interface';
export declare class SuppliersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createSupplierDto: CreateSupplierDto, companyId: string): Promise<SerializedSupplier>;
    findAll(companyId?: string, search?: string): Promise<SerializedSupplier[]>;
    private serialize;
    findOne(id: string, companyId?: string): Promise<SerializedSupplier>;
    findByVehicle(vehicleId: string, companyId?: string): Promise<SerializedSupplier[]>;
    findWithProducts(id: string, companyId?: string): Promise<{
        products: {
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
        }[];
        id: string;
        name: string;
        nif: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, updateSupplierDto: UpdateSupplierDto, companyId?: string): Promise<SerializedSupplier>;
    remove(id: string, companyId?: string): Promise<{
        message: string;
    }>;
}
