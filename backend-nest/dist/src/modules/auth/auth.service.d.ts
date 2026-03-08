import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
type MulterFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
};
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateUser(email: string, password: string): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
        companyId: any;
        isActive: any;
        avatarUrl: any;
    } | null>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            companyId: any;
            isActive: any;
            avatarUrl: any;
        };
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    uploadAvatar(userId: string, file: MulterFile): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            companyId: any;
            isActive: any;
            avatarUrl: any;
        };
    }>;
    refreshToken(refreshToken: string): Promise<AuthResponseDto>;
    removeAvatar(userId: string): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            companyId: any;
            isActive: any;
            avatarUrl: any;
        };
    }>;
    private generateTokens;
    revokeRefreshToken(refreshToken: string): Promise<{
        revoked: boolean;
    }>;
    private formatUser;
}
export {};
