import { PrismaService } from '../prisma.service';
import { Supplier } from '@prisma/client';
export declare class SupplierRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string): Promise<Supplier[]>;
    findOne(id: string, companyId: string): Promise<Supplier | null>;
    findByNif(nif: string, companyId: string): Promise<Supplier | null>;
    create(data: any): Promise<Supplier>;
    update(id: string, data: any): Promise<Supplier>;
    delete(id: string): Promise<Supplier>;
    count(where: any): Promise<number>;
}
