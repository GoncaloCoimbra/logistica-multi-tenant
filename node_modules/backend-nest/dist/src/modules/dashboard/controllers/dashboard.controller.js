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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DashboardController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("../dashboard.service");
const dashboard_filters_dto_1 = require("../dto/dashboard-filters.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const tenant_guard_1 = require("../../auth/guards/tenant.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let DashboardController = DashboardController_1 = class DashboardController {
    dashboardService;
    logger = new common_1.Logger(DashboardController_1.name);
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getStats(req, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /dashboard/stats - User: ${user.email} (${user.role})`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.dashboardService.getStats(companyId);
    }
    getOverview(req, filters, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /dashboard/overview - User: ${user.email} (${user.role})`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.dashboardService.getOverview(companyId, filters);
    }
    getProductsByStatus(req, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /dashboard/products-by-status - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.dashboardService.getProductsByStatus(companyId);
    }
    getTransportsByStatus(req, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /dashboard/transports-by-status - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.dashboardService.getTransportsByStatus(companyId);
    }
    getRecentActivity(req, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /dashboard/recent-activity - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.dashboardService.getRecentActivity(companyId);
    }
    getMonthlyStats(req, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /dashboard/monthly-stats - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.dashboardService.getMonthlyStats(companyId);
    }
    getTopSuppliers(req, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /dashboard/top-suppliers - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.dashboardService.getTopSuppliers(companyId);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Estatísticas do dashboard' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'Filtrar por empresa (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('overview'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Visão geral do dashboard' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'Filtrar por empresa (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_filters_dto_1.DashboardFiltersDto, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('products-by-status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Produtos por estado' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'Filtrar por empresa (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getProductsByStatus", null);
__decorate([
    (0, common_1.Get)('transports-by-status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Transportes por estado' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'Filtrar por empresa (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getTransportsByStatus", null);
__decorate([
    (0, common_1.Get)('recent-activity'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Atividade recente' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'Filtrar por empresa (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRecentActivity", null);
__decorate([
    (0, common_1.Get)('monthly-stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Estatísticas mensais' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'Filtrar por empresa (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getMonthlyStats", null);
__decorate([
    (0, common_1.Get)('top-suppliers'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Top fornecedores' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'Filtrar por empresa (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getTopSuppliers", null);
exports.DashboardController = DashboardController = DashboardController_1 = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map