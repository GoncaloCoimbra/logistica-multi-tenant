"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TenantGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let TenantGuard = TenantGuard_1 = class TenantGuard {
    logger = new common_1.Logger(TenantGuard_1.name);
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const method = request.method;
        const url = request.url;
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(` TenantGuard - ${method} ${url}`);
        if (!user) {
            this.logger.error(' Unauthenticated user');
            throw new common_1.ForbiddenException('Utilizador não autenticado');
        }
        this.logger.log(`👤 User: ${user.email} | Role: ${user.role}`);
        if (user.role === client_1.Role.SUPER_ADMIN) {
            this.logger.log('⭐ SUPER_ADMIN detectado - access total permitido');
            this.logger.log(`   🌐 Can access ALL companies`);
            request.companyId = user.companyId || null;
            request.userId = user.id;
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            return true;
        }
        if (!user.companyId) {
            this.logger.error(` User ${user.email} (${user.role}) without associated company`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            throw new common_1.ForbiddenException('User without associated company');
        }
        this.logger.log(`🏢 User companyId: ${user.companyId}`);
        if (['POST', 'PATCH', 'PUT'].includes(method) && request.body) {
            if (request.body.companyId && request.body.companyId !== user.companyId) {
                this.logger.error(` User ${user.email} tried to manipulate company ${request.body.companyId}`);
                this.logger.error(`   🏢 User company: ${user.companyId}`);
                this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                throw new common_1.ForbiddenException('Não pode manipular dados de outra company');
            }
            this.logger.debug(` Validation de tenant OK`);
        }
        if (request.params?.companyId &&
            request.params.companyId !== user.companyId) {
            this.logger.error(` User ${user.email} tried to access company ${request.params.companyId}`);
            this.logger.error(`   🏢 Company do user: ${user.companyId}`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            throw new common_1.ForbiddenException('Não pode aceder dados de outra company');
        }
        request.companyId = user.companyId;
        request.userId = user.id;
        this.logger.log(` Tenant OK - ${user.email} | Company: ${user.companyId}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return true;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = TenantGuard_1 = __decorate([
    (0, common_1.Injectable)()
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map