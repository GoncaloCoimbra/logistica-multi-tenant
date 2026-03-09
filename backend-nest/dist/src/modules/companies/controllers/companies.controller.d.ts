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
        name: string;
        id: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: any): Promise<{
        name: string;
        id: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getCompanyInfo(req: any): Promise<{
        name: string;
        id: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string, req: any): Promise<{
        name: string;
        id: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findWithUsers(id: string, req: any): Promise<{
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            internalCode: string;
            description: string;
            quantity: number;
            unit: string;
            totalWeight: number | null;
            totalVolume: number | null;
            currentLocation: string | null;
            status: import(".prisma/client").$Enums.ProductStatus;
            supplierId: string;
            companyId: string;
        }[];
        users: {
            name: string;
            id: string;
            email: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            avatarUrl: string | null;
        }[];
        vehicles: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VehicleStatus;
            companyId: string;
            licensePlate: string;
            type: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        }[];
    } & {
        name: string;
        id: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findWithStats(id: string, req: any): Promise<{
        _count: {
            products: number;
            users: number;
            vehicles: number;
        };
    } & {
        name: string;
        id: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto, req: any): Promise<{
        name: string;
        id: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
