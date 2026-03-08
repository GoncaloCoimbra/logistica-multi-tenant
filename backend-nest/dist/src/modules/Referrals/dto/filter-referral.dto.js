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
exports.FilterReferralDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class FilterReferralDto {
    status;
    projectType;
    referralSource;
    referredBy;
    referralDateBefore;
    referralDateAfter;
    search;
    companyId;
}
exports.FilterReferralDto = FilterReferralDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filtrar por status',
        enum: client_1.ReferralStatus,
        required: false
    }),
    (0, class_validator_1.IsEnum)(client_1.ReferralStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterReferralDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filtrar por tipo de projeto',
        example: 'FREIGHT',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterReferralDto.prototype, "projectType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filtrar por fonte',
        example: 'Website',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterReferralDto.prototype, "referralSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filtrar por quem referenciou',
        example: 'João Silva',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterReferralDto.prototype, "referredBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de referência antes de',
        example: '2026-01-31',
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterReferralDto.prototype, "referralDateBefore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de referência depois de',
        example: '2026-01-01',
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterReferralDto.prototype, "referralDateAfter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Buscar no nome do cliente ou notas',
        example: 'empresa',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterReferralDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID da empresa (apenas SUPER_ADMIN)',
        example: 'uuid-da-empresa',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterReferralDto.prototype, "companyId", void 0);
//# sourceMappingURL=filter-referral.dto.js.map