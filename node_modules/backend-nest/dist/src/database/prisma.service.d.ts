import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../common/tenant-context.service';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly tenantContext;
    private readonly logger;
    constructor(tenantContext: TenantContextService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private shouldInjectCompanyId;
    cleanDatabase(): Promise<any>;
}
