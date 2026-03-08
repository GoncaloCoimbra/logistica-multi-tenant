import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { User } from '@prisma/client';
export declare class UserRepository extends BaseRepository<User> {
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByCompany(companyId: string): Promise<User[]>;
    findSuperAdmins(): Promise<User[]>;
}
