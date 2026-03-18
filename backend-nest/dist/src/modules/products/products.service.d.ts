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
    }>;
    findAll(companyId: string, filters?: FilterProductDto): Promise<({
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
    findOne(id: string, companyId: string): Promise<{
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
    }>;
    getStatsByStatus(companyId: string): Promise<{
        total: number;
        byStatus: Record<string, number>;
    }>;
    findWithMovements(id: string, companyId: string): Promise<{
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
        movements: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            quantity: number;
            previousStatus: import(".prisma/client").$Enums.ProductStatus;
            newStatus: import(".prisma/client").$Enums.ProductStatus;
            location: string;
            reason: string | null;
            productId: string;
            userId: string;
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
    update(id: string, updateProductDto: UpdateProductDto, companyId: string, userId: string): Promise<{
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
    }>;
    updateStatus(id: string, statusDto: UpdateProductStatusDto, companyId: string, userId: string): Promise<{
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
    }>;
    remove(id: string, companyId: string, userId: string): Promise<{
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
