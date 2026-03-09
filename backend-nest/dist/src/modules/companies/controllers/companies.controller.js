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
var CompaniesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const companies_service_1 = require("../companies.service");
const create_company_dto_1 = require("../dto/create-company.dto");
const update_company_dto_1 = require("../dto/update-company.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const tenant_guard_1 = require("../../auth/guards/tenant.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
const client_1 = require("@prisma/client");
let CompaniesController = CompaniesController_1 = class CompaniesController {
    companiesService;
    logger = new common_1.Logger(CompaniesController_1.name);
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    async findPublic() {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`GET /companies/public (PUBLIC)`);
        const companies = await this.companiesService.findAll();
        const publicCompanies = companies
            .filter((company) => company.isActive)
            .map((company) => ({
            id: company.id,
            name: company.name,
            nif: company.nif,
        }));
        this.logger.log(`✅ ${publicCompanies.length} active companies returned (public)`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return publicCompanies;
    }
    create(createCompanyDto) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`POST /companies`);
        this.logger.log(`Data: ${JSON.stringify(createCompanyDto)}`);
        const result = this.companiesService.create(createCompanyDto);
        this.logger.log(`✅ Company created successfully`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return result;
    }
    async findAll(req) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`GET /companies - User: ${req.user.email} (${req.user.role})`);
        if (req.user.role === client_1.Role.SUPER_ADMIN) {
            this.logger.log(`SUPER_ADMIN - Returning ALL companies`);
            const companies = await this.companiesService.findAll();
            this.logger.log(`✅ ${companies.length} companies returned`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            return companies;
        }
        if (!req.user.companyId) {
            this.logger.error(`❌ ADMIN without companyId`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            throw new common_1.BadRequestException('User has no associated company');
        }
        this.logger.log(`ADMIN - Returning only company: ${req.user.companyId}`);
        const company = await this.companiesService.findOne(req.user.companyId);
        this.logger.log(`✅ Company returned: ${company.name}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return [company];
    }
    async getCompanyInfo(req) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`GET /companies/info - User: ${req.user.email} (${req.user.role})`);
        if (!req.user.companyId) {
            this.logger.error(`❌ User has no companyId`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            throw new common_1.BadRequestException('User has no associated company');
        }
        const company = await this.companiesService.findOne(req.user.companyId);
        this.logger.log(`✅ Company info returned: ${company.name}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return company;
    }
    async findOne(id, req) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`GET /companies/${id} - User: ${req.user.email} (${req.user.role})`);
        if (req.user.role === client_1.Role.ADMIN && req.user.companyId !== id) {
            this.logger.error(`❌ ADMIN ${req.user.email} tried to access company ${id}`);
            this.logger.error(`   ADMIN's company: ${req.user.companyId}`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            throw new common_1.BadRequestException('Cannot access data from another company');
        }
        const company = await this.companiesService.findOne(id);
        this.logger.log(`✅ Company returned: ${company.name}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return company;
    }
    async findWithUsers(id, req) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`GET /companies/${id}/users - User: ${req.user.email}`);
        if (req.user.role === client_1.Role.ADMIN && req.user.companyId !== id) {
            this.logger.error(`❌ ADMIN tried to access users of company ${id}`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            throw new common_1.BadRequestException('Cannot access data from another company');
        }
        const company = await this.companiesService.findWithUsers(id);
        this.logger.log(`✅ ${company.users?.length || 0} users returned`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return company;
    }
    async findWithStats(id, req) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`GET /companies/${id}/stats - User: ${req.user.email}`);
        if (req.user.role === client_1.Role.ADMIN && req.user.companyId !== id) {
            this.logger.error(`❌ ADMIN tried to access stats of company ${id}`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            throw new common_1.BadRequestException('Cannot access data from another company');
        }
        const stats = await this.companiesService.findWithStats(id);
        this.logger.log(`✅ Stats returned`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return stats;
    }
    async update(id, updateCompanyDto, req) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`PATCH /companies/${id} - User: ${req.user.email}`);
        this.logger.log(`Data: ${JSON.stringify(updateCompanyDto)}`);
        if (req.user.role === client_1.Role.ADMIN && req.user.companyId !== id) {
            this.logger.error(`❌ ADMIN tried to update company ${id}`);
            this.logger.error(`   ADMIN's company: ${req.user.companyId}`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            throw new common_1.BadRequestException('Cannot update another company');
        }
        const updated = await this.companiesService.update(id, updateCompanyDto);
        this.logger.log(`✅ Company updated: ${updated.name}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return updated;
    }
    async remove(id) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`DELETE /companies/${id}`);
        await this.companiesService.remove(id);
        this.logger.log(`✅ Company deleted successfully`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return { message: 'Company deleted successfully' };
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({
        summary: 'List active companies (public - for registration)',
        description: 'Public endpoint returning basic company list for operator registration',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new company (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    (0, swagger_1.ApiOperation)({ summary: 'List companies' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('info'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get current company info (ADMIN, OPERATOR)' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "getCompanyInfo", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get company by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get company with users' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findWithUsers", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get company statistics' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findWithStats", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update company' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_dto_1.UpdateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete company (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "remove", null);
exports.CompaniesController = CompaniesController = CompaniesController_1 = __decorate([
    (0, swagger_1.ApiTags)('Companies'),
    (0, common_1.Controller)('companies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map