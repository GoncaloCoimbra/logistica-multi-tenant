"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesModule = void 0;
const common_1 = require("@nestjs/common");
const companies_service_1 = require("../modules/companies/companies.service");
const companies_controller_1 = require("../modules/companies/controllers/companies.controller");
const company_repository_1 = require("../database/repositories/company.repository");
let CompaniesModule = class CompaniesModule {
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        controllers: [companies_controller_1.CompaniesController],
        providers: [companies_service_1.CompaniesService, company_repository_1.CompanyRepository],
        exports: [companies_service_1.CompaniesService, company_repository_1.CompanyRepository],
    })
], CompaniesModule);
//# sourceMappingURL=companies.module.js.map