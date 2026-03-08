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
exports.SuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const superadmin_service_1 = require("../superadmin.service");
let SuperAdminController = class SuperAdminController {
    superadminService;
    constructor(superadminService) {
        this.superadminService = superadminService;
    }
    async getGlobalStats() {
        return this.superadminService.getGlobalStats();
    }
    async getAllCompanies() {
        return this.superadminService.getAllCompanies();
    }
    async getCompany(id) {
        return this.superadminService.getCompany(id);
    }
    async getCompanyStats(id) {
        return this.superadminService.getCompanyStats(id);
    }
    async createCompany(data) {
        return this.superadminService.createCompany(data);
    }
    async updateCompany(id, data) {
        return this.superadminService.updateCompany(id, data);
    }
    async toggleCompanyStatus(id, isActive) {
        return this.superadminService.toggleCompanyStatus(id, isActive);
    }
    async deleteCompany(id) {
        return this.superadminService.deleteCompany(id);
    }
};
exports.SuperAdminController = SuperAdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getGlobalStats", null);
__decorate([
    (0, common_1.Get)('companies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getAllCompanies", null);
__decorate([
    (0, common_1.Get)('companies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getCompany", null);
__decorate([
    (0, common_1.Get)('companies/:id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getCompanyStats", null);
__decorate([
    (0, common_1.Post)('companies'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "createCompany", null);
__decorate([
    (0, common_1.Patch)('companies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "updateCompany", null);
__decorate([
    (0, common_1.Patch)('companies/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "toggleCompanyStatus", null);
__decorate([
    (0, common_1.Delete)('companies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "deleteCompany", null);
exports.SuperAdminController = SuperAdminController = __decorate([
    (0, common_1.Controller)('superadmin'),
    __metadata("design:paramtypes", [superadmin_service_1.SuperadminService])
], SuperAdminController);
//# sourceMappingURL=superadmin.controller.js.map