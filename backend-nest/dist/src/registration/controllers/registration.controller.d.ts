import { RegistrationService } from '../registration.service';
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
export declare class RegistrationController {
    private readonly registrationService;
    constructor(registrationService: RegistrationService);
    registerCompany(registerCompanyDto: RegisterCompanyDto): Promise<{
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
}
export {};
