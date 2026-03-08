import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UpdateProfileDto, ChangePasswordDto } from '../dto/update-profile.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
type MulterFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto>;
    revoke(refreshToken: string): Promise<{
        revoked: boolean;
    }>;
    getProfile(user: any): Promise<any>;
    updateProfile(user: any, updateProfileDto: UpdateProfileDto): Promise<{
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
    changePassword(user: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    uploadAvatar(user: any, file: MulterFile): Promise<{
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
    removeAvatar(user: any): Promise<{
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
}
export {};
