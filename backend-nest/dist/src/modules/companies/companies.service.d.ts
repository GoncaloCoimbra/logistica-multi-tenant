import { CompanyRepository } from '../../database/repositories/company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private companyRepository;
    constructor(companyRepository: CompanyRepository);
    create(createCompanyDto: CreateCompanyDto): Promise<{
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findWithUsers(id: string): Promise<{
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
        users: {
            id: string;
            name: string;
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
            companyId: string;
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
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findWithStats(id: string): Promise<{
        _count: {
            products: number;
            users: number;
            vehicles: number;
        };
    } & {
        id: string;
        name: string;
        nif: string;
        email: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<{
        id: string;
        name: string;
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
