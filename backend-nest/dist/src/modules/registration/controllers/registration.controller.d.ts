import { RegistrationService } from '../../../registration/registration.service';
interface RegisterDto {
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
    private readonly logger;
    constructor(registrationService: RegistrationService);
    register(dto: RegisterDto): Promise<{
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
