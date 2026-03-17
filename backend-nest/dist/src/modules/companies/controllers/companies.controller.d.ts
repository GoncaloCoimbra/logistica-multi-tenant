import { CompaniesService } from '../companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    private readonly logger;
    constructor(companiesService: CompaniesService);
    findPublic(): Promise<{
        id: string;
        name: string;
        nif: string;
    }[]>;
    create(createCompanyDto: CreateCompanyDto): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }[]>;
    getCompanyInfo(req: any): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    findOne(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    findWithUsers(id: string, req: any): Promise<{
        products: {
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
        }[];
        users: {
            id: string;
            companyId: string | null;
            createdAt: Date;
            email: string;
            name: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            avatarUrl: string | null;
            updatedAt: Date;
        }[];
        vehicles: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    findWithStats(id: string, req: any): Promise<{
        _count: {
            products: number;
            users: number;
            vehicles: number;
        };
    } & {
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
