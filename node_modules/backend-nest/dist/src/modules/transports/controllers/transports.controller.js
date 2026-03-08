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
var TransportsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportsController = void 0;
const common_1 = require("@nestjs/common");
const transports_service_1 = require("../transports.service");
const create_transport_dto_1 = require("../dto/create-transport.dto");
const update_transport_dto_1 = require("../dto/update-transport.dto");
const filter_transport_dto_1 = require("../dto/filter-transport.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const tenant_guard_1 = require("../../auth/guards/tenant.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let TransportsController = TransportsController_1 = class TransportsController {
    transportsService;
    logger = new common_1.Logger(TransportsController_1.name);
    constructor(transportsService) {
        this.transportsService = transportsService;
    }
    async create(createTransportDto, req) {
        const user = req.user;
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`📥 POST /transports`);
        this.logger.log(`👤 User: ${user.email} (${user.role})`);
        this.logger.log(`🏢 CompanyId: ${user.companyId || 'SUPER_ADMIN - sem empresa'}`);
        this.logger.log(`📋 DTO recebido: ${JSON.stringify(createTransportDto)}`);
        const companyId = createTransportDto.companyId || user.companyId;
        if (!companyId) {
            this.logger.error(' CompanyId não encontrado');
            throw new common_1.HttpException('CompanyId obrigatório', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.transportsService.create(createTransportDto, companyId, user.id);
        this.logger.log(` Transporte criado: ${result.id}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return result;
    }
    findAll(req, filters, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /transports - User: ${user.email} (${user.role})`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.transportsService.findAll(companyId, filters);
    }
    findPending(req, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /transports/pending - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.transportsService.findPending(companyId);
    }
    findInTransit(req, queryCompanyId) {
        const user = req.user;
        this.logger.log(`📥 GET /transports/in-transit - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? queryCompanyId
            : user.companyId;
        return this.transportsService.findInTransit(companyId);
    }
    findOne(id, req) {
        const user = req.user;
        this.logger.log(`📥 GET /transports/${id} - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? undefined
            : user.companyId;
        return this.transportsService.findOne(id, companyId);
    }
    async update(id, updateTransportDto, req) {
        const user = req.user;
        this.logger.log(`📥 PATCH /transports/${id} - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? undefined
            : user.companyId;
        return this.transportsService.update(id, updateTransportDto, companyId, user.id);
    }
    async updateStatus(id, body, req) {
        const user = req.user;
        this.logger.log(`📥 PATCH /transports/${id}/status - New status: ${body.status}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? undefined
            : user.companyId;
        const status = body.status;
        return this.transportsService.updateStatus(id, status, companyId, user.id);
    }
    async remove(id, req, force) {
        const user = req.user;
        this.logger.log(`🗑️ DELETE /transports/${id} (force=${force})`);
        this.logger.log(`👤 User: ${user.email} (${user.role})`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN
            ? undefined
            : user.companyId;
        const forceFlag = force === 'true' || force === '1' || force === 'yes';
        if (forceFlag && user.role !== client_1.Role.ADMIN && user.role !== client_1.Role.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Apenas utilizadores com privilégios de admin podem forçar a eliminação de transportes.');
        }
        return this.transportsService.remove(id, companyId, user.id, forceFlag);
    }
    async getTrackingRoutes(req) {
        const user = req.user;
        this.logger.log(`📍 GET /transports/tracking-routes - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN ? undefined : user.companyId;
        return this.transportsService.getTrackingRoutes(companyId);
    }
    async clearAllTrackingRoutes(req) {
        const user = req.user;
        this.logger.log(`🗑️ DELETE /transports/tracking-routes/clear-all - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN ? undefined : user.companyId;
        return this.transportsService.clearAllTrackingRoutes(companyId, user.id);
    }
    async deleteTrackingRoute(id, req) {
        const user = req.user;
        this.logger.log(`🗑️ DELETE /transports/tracking-routes/${id} - User: ${user.email}`);
        const companyId = user.role === client_1.Role.SUPER_ADMIN ? undefined : user.companyId;
        return this.transportsService.deleteTrackingRoute(id, companyId, user.id);
    }
};
exports.TransportsController = TransportsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transport_dto_1.CreateTransportDto, Object]),
    __metadata("design:returntype", Promise)
], TransportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filter_transport_dto_1.FilterTransportDto, String]),
    __metadata("design:returntype", void 0)
], TransportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransportsController.prototype, "findPending", null);
__decorate([
    (0, common_1.Get)('in-transit'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransportsController.prototype, "findInTransit", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TransportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_transport_dto_1.UpdateTransportDto, Object]),
    __metadata("design:returntype", Promise)
], TransportsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TransportsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('force')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], TransportsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('tracking-routes/all'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransportsController.prototype, "getTrackingRoutes", null);
__decorate([
    (0, common_1.Delete)('tracking-routes/clear-all'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransportsController.prototype, "clearAllTrackingRoutes", null);
__decorate([
    (0, common_1.Delete)('tracking-routes/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransportsController.prototype, "deleteTrackingRoute", null);
exports.TransportsController = TransportsController = TransportsController_1 = __decorate([
    (0, common_1.Controller)('transports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [transports_service_1.TransportsService])
], TransportsController);
//# sourceMappingURL=transports.controller.js.map