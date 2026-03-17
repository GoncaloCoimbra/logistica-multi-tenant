import { ProductsService } from '../products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FilterProductDto } from '../dto/filter-product.dto';
import { UpdateProductStatusDto } from '../dto/update-product-status.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, user: any): Promise<{
        supplier: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            email: string | null;
            name: string;
            nif: string;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
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
    }>;
    findAll(user: any, filters: FilterProductDto): Promise<({
        supplier: {
            id: string;
            name: string;
            nif: string;
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
    })[]>;
    getStats(user: any): Promise<{
        total: number;
        byStatus: Record<string, number>;
    }>;
    findOne(id: string, user: any): Promise<{
        supplier: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            email: string | null;
            name: string;
            nif: string;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
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
    }>;
    findWithMovements(id: string, user: any): Promise<{
        supplier: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            email: string | null;
            name: string;
            nif: string;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
        };
        movements: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            quantity: number;
            productId: string;
            previousStatus: import(".prisma/client").$Enums.ProductStatus;
            newStatus: import(".prisma/client").$Enums.ProductStatus;
            location: string;
            reason: string | null;
        })[];
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto, user: any): Promise<{
        supplier: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            email: string | null;
            name: string;
            nif: string;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
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
    }>;
    updateStatus(id: string, updateStatusDto: UpdateProductStatusDto, user: any): Promise<{
        supplier: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            email: string | null;
            name: string;
            nif: string;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
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
    }>;
    remove(id: string, user: any): Promise<{
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
    }>;
}
