import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { FilterProductDto } from './dto/filter-product.dto';
export declare class ProductsService {
    private prisma;
    private notificationsService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createProductDto: CreateProductDto, companyId: string, userId: string): Promise<{
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
    }>;
    findAll(companyId: string, filters?: FilterProductDto): Promise<({
        supplier: {
            id: string;
            name: string;
            nif: string;
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
    })[]>;
    findOne(id: string, companyId: string): Promise<{
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
    }>;
    getStatsByStatus(companyId: string): Promise<{
        total: number;
        byStatus: Record<string, number>;
    }>;
    findWithMovements(id: string, companyId: string): Promise<{
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
        movements: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            productId: string;
            previousStatus: import(".prisma/client").$Enums.ProductStatus;
            newStatus: import(".prisma/client").$Enums.ProductStatus;
            quantity: number;
            location: string;
            reason: string | null;
        })[];
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto, companyId: string, userId: string): Promise<{
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
    }>;
    updateStatus(id: string, statusDto: UpdateProductStatusDto, companyId: string, userId: string): Promise<{
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
    }>;
    remove(id: string, companyId: string, userId: string): Promise<{
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
    }>;
}
