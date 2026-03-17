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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const referrals_service_1 = require("./referrals.service");
const create_referral_dto_1 = require("./dto/create-referral.dto");
const update_referral_dto_1 = require("./dto/update-referral.dto");
const filter_referral_dto_1 = require("./dto/filter-referral.dto");
const referrals_dto_1 = require("./dto/referrals.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ReferralsController = class ReferralsController {
    referralsService;
    constructor(referralsService) {
        this.referralsService = referralsService;
    }
    async create(createReferralDto, req) {
        return this.referralsService.create(createReferralDto, req.user.id, req.user.role, req.user.companyId);
    }
    async findAll(filterDto, req) {
        return this.referralsService.findAll(filterDto, req.user.id, req.user.role, req.user.companyId);
    }
    async getStats(companyId, req) {
        return this.referralsService.getStats(req.user.id, req.user.role, req.user.companyId, companyId);
    }
    async findOne(id, req) {
        return this.referralsService.findOne(id, req.user.id, req.user.role, req.user.companyId);
    }
    async update(id, updateReferralDto, req) {
        return this.referralsService.update(id, updateReferralDto, req.user.id, req.user.role, req.user.companyId);
    }
    async updateStatus(id, updateStatusDto, req) {
        return this.referralsService.updateStatus(id, updateStatusDto, req.user.id, req.user.role, req.user.companyId);
    }
    async remove(id, req) {
        return this.referralsService.remove(id, req.user.id, req.user.role, req.user.companyId);
    }
};
exports.ReferralsController = ReferralsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create nova referência' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Referência criada com success',
        type: referrals_dto_1.ReferralResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_referral_dto_1.CreateReferralDto, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todas as referências com filtros opcionais',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de referências',
        type: [referrals_dto_1.ReferralResponseDto],
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_referral_dto_1.FilterReferralDto, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get estatísticas das referências' }),
    (0, swagger_1.ApiQuery)({
        name: 'companyId',
        required: false,
        description: 'ID da company (apenas SUPER_ADMIN)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estatísticas das referências',
        type: referrals_dto_1.ReferralStatsDto,
    }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Search referência por ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Referência encontrada',
        type: referrals_dto_1.ReferralResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Referência não encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update referência' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Referência atualizada com success',
        type: referrals_dto_1.ReferralResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Referência não encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_referral_dto_1.UpdateReferralDto, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update status da referência' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Status atualizado com success',
        type: referrals_dto_1.ReferralResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Referência não encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_referral_dto_1.UpdateReferralStatusDto, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir referência' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Referência excluída com success' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Referência não encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "remove", null);
exports.ReferralsController = ReferralsController = __decorate([
    (0, swagger_1.ApiTags)('Referrals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('referrals'),
    __metadata("design:paramtypes", [referrals_service_1.ReferralsService])
], ReferralsController);
//# sourceMappingURL=referrals.controller.js.map