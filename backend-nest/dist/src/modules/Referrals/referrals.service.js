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
exports.ReferralsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let ReferralsService = class ReferralsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createReferralDto, userId, userRole, userCompanyId) {
        let companyId = userCompanyId;
        if (userRole === 'SUPER_ADMIN') {
            if (!createReferralDto.companyId) {
                throw new common_1.BadRequestException('SUPER_ADMIN deve especificar o ID da company');
            }
            companyId = createReferralDto.companyId;
            const companyExists = await this.prisma.company.findUnique({
                where: { id: companyId },
            });
            if (!companyExists) {
                throw new common_1.NotFoundException('Company não encontrada');
            }
        }
        const referralDate = new Date(createReferralDto.referralDate);
        const commission = createReferralDto.commission !== undefined
            ? createReferralDto.commission
            : createReferralDto.estimatedValue * 0.05;
        const referral = await this.prisma.referral.create({ data: {
                clientName: createReferralDto.clientName,
                contactInfo: createReferralDto.contactInfo,
                referralSource: createReferralDto.referralSource || '',
                status: createReferralDto.status || client_1.ReferralStatus.NEW,
                projectType: createReferralDto.projectType,
                estimatedValue: createReferralDto.estimatedValue,
                referralDate: referralDate,
                notes: createReferralDto.notes || null,
                referredBy: createReferralDto.referredBy,
                commission: commission,
                companyId: companyId,
            },
        });
        return referral;
    }
    async findAll(filterDto, userId, userRole, userCompanyId) {
        const where = {};
        if (userRole === 'SUPER_ADMIN') {
            if (filterDto.companyId) {
                where.companyId = filterDto.companyId;
            }
        }
        else {
            where.companyId = userCompanyId;
        }
        if (filterDto.status) {
            where.status = filterDto.status;
        }
        if (filterDto.projectType) {
            where.projectType = filterDto.projectType;
        }
        if (filterDto.referralSource) {
            where.referralSource = {
                contains: filterDto.referralSource,
                mode: 'insensitive',
            };
        }
        if (filterDto.referredBy) {
            where.referredBy = {
                contains: filterDto.referredBy,
                mode: 'insensitive',
            };
        }
        if (filterDto.referralDateBefore || filterDto.referralDateAfter) {
            where.referralDate = {};
            if (filterDto.referralDateBefore) {
                where.referralDate.lte = new Date(filterDto.referralDateBefore);
            }
            if (filterDto.referralDateAfter) {
                where.referralDate.gte = new Date(filterDto.referralDateAfter);
            }
        }
        if (filterDto.search) {
            where.OR = [
                { clientName: { contains: filterDto.search, mode: 'insensitive' } },
                { notes: { contains: filterDto.search, mode: 'insensitive' } },
            ];
        }
        const referrals = await this.prisma.referral.findMany({
            where,
            orderBy: [{ referralDate: 'desc' }],
        });
        return referrals;
    }
    async findOne(id, userId, userRole, userCompanyId) {
        const referral = await this.prisma.referral.findUnique({
            where: { id },
        });
        if (!referral) {
            throw new common_1.NotFoundException('Referência não encontrada');
        }
        if (userRole !== 'SUPER_ADMIN' && referral.companyId !== userCompanyId) {
            throw new common_1.ForbiddenException('Você não tem permissão para visualizar esta referência');
        }
        return referral;
    }
    async update(id, updateReferralDto, userId, userRole, userCompanyId) {
        const referral = await this.findOne(id, userId, userRole, userCompanyId);
        const updateData = {};
        if (updateReferralDto.clientName !== undefined) {
            updateData.clientName = updateReferralDto.clientName;
        }
        if (updateReferralDto.contactInfo !== undefined) {
            updateData.contactInfo = updateReferralDto.contactInfo;
        }
        if (updateReferralDto.referralSource !== undefined) {
            updateData.referralSource = updateReferralDto.referralSource;
        }
        if (updateReferralDto.status !== undefined) {
            updateData.status = updateReferralDto.status;
        }
        if (updateReferralDto.projectType !== undefined) {
            updateData.projectType = updateReferralDto.projectType;
        }
        if (updateReferralDto.estimatedValue !== undefined) {
            updateData.estimatedValue = updateReferralDto.estimatedValue;
        }
        if (updateReferralDto.referralDate !== undefined) {
            updateData.referralDate = new Date(updateReferralDto.referralDate);
        }
        if (updateReferralDto.notes !== undefined) {
            updateData.notes = updateReferralDto.notes || null;
        }
        if (updateReferralDto.referredBy !== undefined) {
            updateData.referredBy = updateReferralDto.referredBy;
        }
        if (updateReferralDto.commission !== undefined) {
            updateData.commission = updateReferralDto.commission;
        }
        const updatedReferral = await this.prisma.referral.update({
            where: { id }, data: updateData,
        });
        return updatedReferral;
    }
    async updateStatus(id, updateStatusDto, userId, userRole, userCompanyId) {
        const referral = await this.findOne(id, userId, userRole, userCompanyId);
        const updatedReferral = await this.prisma.referral.update({
            where: { id }, data: {
                status: updateStatusDto.status,
            },
        });
        return updatedReferral;
    }
    async remove(id, userId, userRole, userCompanyId) {
        const referral = await this.findOne(id, userId, userRole, userCompanyId);
        await this.prisma.referral.delete({
            where: { id },
        });
        return { message: 'Referência excluída com success' };
    }
    async getStats(userId, userRole, userCompanyId, companyId) {
        const where = {};
        if (userRole === 'SUPER_ADMIN' && companyId) {
            where.companyId = companyId;
        }
        else if (userRole !== 'SUPER_ADMIN') {
            where.companyId = userCompanyId;
        }
        const [total, newReferrals, contacted, converted, lost] = await Promise.all([
            this.prisma.referral.count({ where }),
            this.prisma.referral.count({
                where: { ...where, status: client_1.ReferralStatus.NEW },
            }),
            this.prisma.referral.count({
                where: { ...where, status: client_1.ReferralStatus.CONTACTED },
            }),
            this.prisma.referral.count({
                where: { ...where, status: client_1.ReferralStatus.CONVERTED },
            }),
            this.prisma.referral.count({
                where: { ...where, status: client_1.ReferralStatus.LOST },
            }),
        ]);
        const allReferrals = await this.prisma.referral.findMany({
            where,
            select: {
                estimatedValue: true,
                commission: true,
            },
        });
        const totalEstimatedValue = allReferrals.reduce((sum, ref) => sum + ref.estimatedValue, 0);
        const totalCommission = allReferrals.reduce((sum, ref) => sum + (ref.commission || 0), 0);
        const conversionRate = total > 0 ? (converted / total) * 100 : 0;
        return {
            total,
            new: newReferrals,
            contacted,
            converted,
            lost,
            totalEstimatedValue,
            totalCommission,
            conversionRate: Number(conversionRate.toFixed(2)),
        };
    }
};
exports.ReferralsService = ReferralsService;
exports.ReferralsService = ReferralsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReferralsService);
//# sourceMappingURL=referrals.service.js.map