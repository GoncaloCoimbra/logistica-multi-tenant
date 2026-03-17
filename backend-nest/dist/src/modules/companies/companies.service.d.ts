import { CompanyRepository } from '../../database/repositories/company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private companyRepository;
    constructor(companyRepository: CompanyRepository);
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
    findAll(): Promise<{
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
    findOne(id: string): Promise<{
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
    findWithUsers(id: string): Promise<{
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
    findWithStats(id: string): Promise<{
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
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<{
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
