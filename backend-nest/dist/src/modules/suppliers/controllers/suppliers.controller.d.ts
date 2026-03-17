import { SuppliersService } from '../suppliers.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    private readonly logger;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: CreateSupplierDto, req: any): Promise<import("../interfaces/supplier.interface").SerializedSupplier>;
    findAll(req: any, search?: string, queryCompanyId?: string): Promise<import("../interfaces/supplier.interface").SerializedSupplier[]>;
    findByVehicle(vehicleId: string, req: any): Promise<import("../interfaces/supplier.interface").SerializedSupplier[]>;
    findOne(id: string, req: any): Promise<import("../interfaces/supplier.interface").SerializedSupplier>;
    findWithProducts(id: string, req: any): Promise<{
        products: {
            description: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            id: string;
            internalCode: string;
            totalWeight: number | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            quantity: number;
            unit: string;
            totalVolume: number | null;
            currentLocation: string | null;
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
    update(id: string, updateSupplierDto: UpdateSupplierDto, req: any): Promise<import("../interfaces/supplier.interface").SerializedSupplier>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
