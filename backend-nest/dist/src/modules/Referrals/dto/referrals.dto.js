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
exports.ReferralStatsDto = exports.ReferralResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class ReferralResponseDto {
    id;
    clientName;
    contactInfo;
    referralSource;
    status;
    projectType;
    estimatedValue;
    referralDate;
    notes;
    referredBy;
    commission;
    createdAt;
    updatedAt;
    companyId;
}
exports.ReferralResponseDto = ReferralResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único da referência',
        example: 'uuid-da-referencia',
    }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome do cliente', example: 'Empresa Alpha' }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Informações de contacto',
        example: 'alpha@example.com | +351 912 345 678',
    }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "contactInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fonte da referência', example: 'Website' }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "referralSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da referência',
        enum: client_1.ReferralStatus,
        example: client_1.ReferralStatus.NEW,
    }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de projeto',
        example: 'FREIGHT',
    }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "projectType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor estimado', example: 1200 }),
    __metadata("design:type", Number)
], ReferralResponseDto.prototype, "estimatedValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data da referência',
        example: '2026-01-07T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], ReferralResponseDto.prototype, "referralDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionais',
        example: 'Cliente potencial',
        nullable: true,
    }),
    __metadata("design:type", Object)
], ReferralResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome de quem referenciou',
        example: 'João Silva',
    }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "referredBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Comissão', example: 60, nullable: true }),
    __metadata("design:type", Object)
], ReferralResponseDto.prototype, "commission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de criação',
        example: '2026-01-06T10:00:00.000Z',
    }),
    __metadata("design:type", Date)
], ReferralResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data da última atualização',
        example: '2026-01-06T10:00:00.000Z',
    }),
    __metadata("design:type", Date)
], ReferralResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID da empresa', example: 'uuid-da-empresa' }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "companyId", void 0);
class ReferralStatsDto {
    total;
    new;
    contacted;
    converted;
    lost;
    totalEstimatedValue;
    totalCommission;
    conversionRate;
}
exports.ReferralStatsDto = ReferralStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de referências', example: 42 }),
    __metadata("design:type", Number)
], ReferralStatsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referências novas', example: 15 }),
    __metadata("design:type", Number)
], ReferralStatsDto.prototype, "new", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referências contactadas', example: 10 }),
    __metadata("design:type", Number)
], ReferralStatsDto.prototype, "contacted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referências convertidas', example: 12 }),
    __metadata("design:type", Number)
], ReferralStatsDto.prototype, "converted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referências perdidas', example: 5 }),
    __metadata("design:type", Number)
], ReferralStatsDto.prototype, "lost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor total estimado', example: 50000 }),
    __metadata("design:type", Number)
], ReferralStatsDto.prototype, "totalEstimatedValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de comissões', example: 2500 }),
    __metadata("design:type", Number)
], ReferralStatsDto.prototype, "totalCommission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Taxa de conversão (%)', example: 28.5 }),
    __metadata("design:type", Number)
], ReferralStatsDto.prototype, "conversionRate", void 0);
//# sourceMappingURL=referrals.dto.js.map