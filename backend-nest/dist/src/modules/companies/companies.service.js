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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const company_repository_1 = require("../../database/repositories/company.repository");
let CompaniesService = class CompaniesService {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async create(createCompanyDto) {
        const existingNif = await this.companyRepository.findByNif(createCompanyDto.nif);
        if (existingNif) {
            throw new common_1.ConflictException('NIF já está em uso');
        }
        const existingEmail = await this.companyRepository.findByEmail(createCompanyDto.email);
        if (existingEmail) {
            throw new common_1.ConflictException('Email já está em uso');
        }
        return this.companyRepository.create(createCompanyDto);
    }
    async findAll() {
        return this.companyRepository.findAll();
    }
    async findOne(id) {
        const company = await this.companyRepository.findOne(id);
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada');
        }
        return company;
    }
    async findWithUsers(id) {
        const company = await this.companyRepository.findWithUsers(id);
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada');
        }
        return company;
    }
    async findWithStats(id) {
        const company = await this.companyRepository.findWithStats(id);
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada');
        }
        return company;
    }
    async update(id, updateCompanyDto) {
        await this.findOne(id);
        return this.companyRepository.update(id, updateCompanyDto);
    }
    async remove(id) {
        await this.findOne(id);
        await this.companyRepository.delete(id);
        return { message: 'Empresa eliminada com sucesso' };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [company_repository_1.CompanyRepository])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map