import { UserRepository } from '../database/repositories/user.repository';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    findByCompany(companyId: string): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        companyId: string | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        companyId: string | null;
    } | null>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        companyId: string | null;
    } | null>;
    findSuperAdmins(): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        companyId: string | null;
    }[]>;
}
