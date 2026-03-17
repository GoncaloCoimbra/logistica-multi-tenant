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
var VehiclesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vehicles_service_1 = require("../vehicles.service");
const create_vehicle_dto_1 = require("../dto/create-vehicle.dto");
const update_vehicle_dto_1 = require("../dto/update-vehicle.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const tenant_guard_1 = require("../../auth/guards/tenant.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let VehiclesController = VehiclesController_1 = class VehiclesController {
    vehiclesService;
    logger = new common_1.Logger(VehiclesController_1.name);
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    async create(createVehicleDto, req) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`📥 POST /vehicles - User: ${req.user.email}, Role: ${req.user.role}`);
        this.logger.log(`🏢 CompanyId: ${req.user.companyId || 'SUPER_ADMIN'}`);
        const companyId = createVehicleDto.companyId || req.user.companyId;
        if (!companyId) {
            this.logger.error(` CompanyId not found!`);
            throw new common_1.BadRequestException('CompanyId is required');
        }
        this.logger.log(`Validation passed, creating vehicle...`);
        const result = await this.vehiclesService.create(createVehicleDto, companyId);
        this.logger.log(`Vehicle created successfully: ${result.id}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return result;
    }
    async findAll(req, filters) {
        this.logger.log(`📥 GET /vehicles - User: ${req.user.email} (${req.user.role})`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN
            ? filters?.companyId
            : req.user.companyId;
        this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS'}`);
        return this.vehiclesService.findAll(companyId, filters);
    }
    async findAvailable(req, queryCompanyId) {
        this.logger.log(`📥 GET /vehicles/available - User: ${req.user.email}`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN ? queryCompanyId : req.user.companyId;
        return this.vehiclesService.findAvailable(companyId);
    }
    async getStats(req, queryCompanyId) {
        this.logger.log(`📥 GET /vehicles/stats - User: ${req.user.email}`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN ? queryCompanyId : req.user.companyId;
        return this.vehiclesService.getStats(companyId);
    }
    async findOne(id, req) {
        this.logger.log(`📥 GET /vehicles/${id} - User: ${req.user.email}`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN ? undefined : req.user.companyId;
        return this.vehiclesService.findOne(id, companyId);
    }
    async update(id, updateVehicleDto, req) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`📥 PATCH /vehicles/${id} - User: ${req.user.email}`);
        this.logger.log(`🏢 CompanyId do user: ${req.user.companyId}`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN ? undefined : req.user.companyId;
        const result = await this.vehiclesService.update(id, updateVehicleDto, companyId);
        this.logger.log(`Vehicle ${id} updated successfully`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return result;
    }
    async updateStatus(id, body, req) {
        this.logger.log(`📥 PATCH /vehicles/${id}/status - Status: ${body.status}`);
        if (!Object.values(client_1.VehicleStatus).includes(body.status)) {
            throw new common_1.BadRequestException(`Invalid status. Valid values: ${Object.values(client_1.VehicleStatus).join(', ')}`);
        }
        const status = body.status;
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN ? undefined : req.user.companyId;
        return this.vehiclesService.updateStatus(id, status, companyId);
    }
    async remove(id, req) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`📥 DELETE /vehicles/${id} - User: ${req.user.email}`);
        this.logger.log(`🏢 CompanyId do user: ${req.user.companyId}`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN ? undefined : req.user.companyId;
        const result = await this.vehiclesService.remove(id, companyId);
        this.logger.log(`Vehicle ${id} deleted successfully`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return result;
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create new vehicle' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_dto_1.CreateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'List vehicles' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'List available vehicles' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findAvailable", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Vehicle statistics' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get vehicle by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vehicle_dto_1.UpdateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete vehicle' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "remove", null);
exports.VehiclesController = VehiclesController = VehiclesController_1 = __decorate([
    (0, swagger_1.ApiTags)('Vehicles'),
    (0, common_1.Controller)('vehicles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map