import { Role } from '@prisma/client';
declare class UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: Role;
    companyId?: string;
    companyName?: string;
    avatarUrl?: string;
    isActive?: boolean;
}
export declare class AuthResponseDto {
    token: string;
    refreshToken: string;
    user: UserResponseDto;
}
export {};
