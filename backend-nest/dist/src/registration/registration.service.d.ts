import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
interface RegisterCompanyDto {
    companyName: string;
    companyNif: string;
    companyEmail: string;
    companyPhone?: string;
    companyAddress?: string;
    userName: string;
    userEmail: string;
    userPassword: string;
}
export declare class RegistrationService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    registerCompanyAndUser(data: RegisterCompanyDto): Promise<{
        token: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            companyId: string | null;
            companyName: string;
            isActive: boolean;
        };
    }>;
    private generateTokens;
}
export {};
