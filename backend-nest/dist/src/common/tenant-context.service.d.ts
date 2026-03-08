interface TenantContext {
    companyId: string;
    userId: string;
}
export declare class TenantContextService {
    private readonly als;
    run<T>(context: TenantContext, callback: () => T): T;
    getCompanyId(): string | undefined;
    getUserId(): string | undefined;
    getContext(): TenantContext | undefined;
}
export {};
