import { PrismaService } from '../prisma.service';
export declare abstract class BaseRepository<T> {
    protected prisma: PrismaService;
    protected modelName: string;
    constructor(prisma: PrismaService, modelName: string);
    findAll(where?: any): Promise<T[]>;
    findOne(where: any): Promise<T | null>;
    create(data: any): Promise<T>;
    update(where: any, data: any): Promise<T>;
    delete(where: any): Promise<T>;
    count(where?: any): Promise<number>;
}
