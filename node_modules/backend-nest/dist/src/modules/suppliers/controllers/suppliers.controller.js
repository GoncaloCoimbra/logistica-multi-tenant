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
var SuppliersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const suppliers_service_1 = require("../suppliers.service");
const create_supplier_dto_1 = require("../dto/create-supplier.dto");
const update_supplier_dto_1 = require("../dto/update-supplier.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const tenant_guard_1 = require("../../auth/guards/tenant.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SuppliersController = SuppliersController_1 = class SuppliersController {
    suppliersService;
    logger = new common_1.Logger(SuppliersController_1.name);
    constructor(suppliersService) {
        this.suppliersService = suppliersService;
    }
    async create(createSupplierDto, req) {
        try {
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            this.logger.log(`📥 POST /suppliers`);
            this.logger.log(`👤 User: ${req.user?.email} (${req.user?.role})`);
            this.logger.log(`🏢 CompanyId: ${req.user?.companyId || 'SUPER_ADMIN - sem empresa'}`);
            const companyId = createSupplierDto.companyId || req.user.companyId;
            if (!companyId) {
                this.logger.error(' CompanyId não encontrado');
                throw new common_1.HttpException('CompanyId obrigatório', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.suppliersService.create(createSupplierDto, companyId);
            this.logger.log(` Fornecedor criado: ${result.id}`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            return result;
        }
        catch (error) {
            this.logger.error(` Erro ao criar fornecedor:`, error.message);
            throw error;
        }
    }
    async findAll(req, search, queryCompanyId) {
        try {
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            this.logger.log(`📥 GET /suppliers`);
            this.logger.log(`👤 User: ${req.user?.email} (${req.user?.role})`);
            this.logger.log(`🔍 Search: ${search || 'none'}`);
            const companyId = req.user.role === client_1.Role.SUPER_ADMIN
                ? queryCompanyId
                : req.user.companyId;
            if (!companyId && req.user.role !== client_1.Role.SUPER_ADMIN) {
                this.logger.error(' CompanyId não encontrado no user');
                throw new common_1.HttpException('CompanyId não encontrado', common_1.HttpStatus.BAD_REQUEST);
            }
            this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
            const result = await this.suppliersService.findAll(companyId, search);
            this.logger.log(` ${result?.length || 0} fornecedores retornados`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            return result;
        }
        catch (error) {
            this.logger.error(` ERRO no GET /suppliers`);
            this.logger.error(`Message: ${error.message}`);
            throw error;
        }
    }
    findByVehicle(vehicleId, req) {
        this.logger.log(`📥 GET /suppliers/by-vehicle/${vehicleId}`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN
            ? undefined
            : req.user.companyId;
        return this.suppliersService.findByVehicle(vehicleId, companyId);
    }
    findOne(id, req) {
        this.logger.log(`📥 GET /suppliers/${id}`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN
            ? undefined
            : req.user.companyId;
        return this.suppliersService.findOne(id, companyId);
    }
    findWithProducts(id, req) {
        this.logger.log(`📥 GET /suppliers/${id}/products`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN
            ? undefined
            : req.user.companyId;
        return this.suppliersService.findWithProducts(id, companyId);
    }
    async update(id, updateSupplierDto, req) {
        this.logger.log(`📥 PATCH /suppliers/${id}`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN
            ? undefined
            : req.user.companyId;
        return this.suppliersService.update(id, updateSupplierDto, companyId);
    }
    remove(id, req) {
        this.logger.log(`🗑️ DELETE /suppliers/${id}`);
        this.logger.log(`👤 User: ${req.user.email} (${req.user.role})`);
        const companyId = req.user.role === client_1.Role.SUPER_ADMIN
            ? undefined
            : req.user.companyId;
        return this.suppliersService.remove(id, companyId);
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo fornecedor' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDto, Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os fornecedores' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Buscar por nome ou NIF' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'Filtrar por empresa (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-vehicle/:vehicleId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar fornecedores por veículo' }),
    __param(0, (0, common_1.Param)('vehicleId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "findByVehicle", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obter fornecedor por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/products'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obter fornecedor com produtos' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "findWithProducts", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar fornecedor' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_supplier_dto_1.UpdateSupplierDto, Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar fornecedor' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "remove", null);
exports.SuppliersController = SuppliersController = SuppliersController_1 = __decorate([
    (0, swagger_1.ApiTags)('Suppliers'),
    (0, common_1.Controller)('suppliers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [suppliers_service_1.SuppliersService])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map