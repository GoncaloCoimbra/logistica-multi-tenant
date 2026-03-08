import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from '../tenant-context.service';
export declare class TenantInterceptor implements NestInterceptor {
    private readonly tenantContext;
    private readonly logger;
    constructor(tenantContext: TenantContextService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
