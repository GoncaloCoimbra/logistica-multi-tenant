"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TenantInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantInterceptor = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant-context.service");
let TenantInterceptor = TenantInterceptor_1 = class TenantInterceptor {
    tenantContext;
    logger = new common_1.Logger(TenantInterceptor_1.name);
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user && user.companyId) {
            this.logger.debug(`Setting tenant context for user ${user.email}`);
            return this.tenantContext.run({ companyId: user.companyId, userId: user.id }, () => next.handle());
        }
        return next.handle();
    }
};
exports.TenantInterceptor = TenantInterceptor;
exports.TenantInterceptor = TenantInterceptor = TenantInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], TenantInterceptor);
//# sourceMappingURL=tenant.interceptor.js.map