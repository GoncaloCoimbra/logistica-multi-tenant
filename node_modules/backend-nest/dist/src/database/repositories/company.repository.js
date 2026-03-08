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
exports.CompanyRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const base_repository_1 = require("./base.repository");
let CompanyRepository = class CompanyRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'company');
    }
    async findWithUsers(id) {
        return this.prisma.company.findUnique({
            where: { id },
            include: {
                users: true,
                products: true,
                vehicles: true,
            },
        });
    }
    async findByTenant(tenant) {
        return this.prisma.company.findFirst({
            where: {
                OR: [
                    { name: { contains: tenant, mode: 'insensitive' } },
                    { id: tenant },
                ],
            },
        });
    }
    async findByNif(nif) {
        return this.prisma.company.findUnique({ where: { nif } });
    }
    async findByEmail(email) {
        return this.prisma.company.findFirst({ where: { email } });
    }
    async findWithStats(id) {
        return this.prisma.company.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        users: true,
                        products: true,
                        vehicles: true,
                    },
                },
            },
        });
    }
};
exports.CompanyRepository = CompanyRepository;
exports.CompanyRepository = CompanyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyRepository);
//# sourceMappingURL=company.repository.js.map