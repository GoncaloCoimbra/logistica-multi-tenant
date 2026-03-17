import { CompanyRepository } from '../../database/repositories/company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private companyRepository;
    constructor(companyRepository: CompanyRepository);
    create(createCompanyDto: CreateCompanyDto): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    findWithUsers(id: string): Promise<{
        products: {
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            internalCode: string;
            quantity: number;
            unit: string;
            totalWeight: number | null;
            totalVolume: number | null;
            currentLocation: string | null;
            supplierId: string;
            status: import(".prisma/client").$Enums.ProductStatus;
        }[];
        users: {
            id: string;
            email: string;
            name: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            avatarUrl: string | null;
            companyId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        vehicles: {
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            status: import(".prisma/client").$Enums.VehicleStatus;
            licensePlate: string;
            model: string;
            brand: string;
            capacity: number;
            year: number;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    findWithStats(id: string): Promise<{
        _count: {
            products: number;
            users: number;
            vehicles: number;
        };
    } & {
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nif: string;
        phone: string | null;
        address: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
