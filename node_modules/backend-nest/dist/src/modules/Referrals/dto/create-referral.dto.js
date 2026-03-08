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
exports.CreateReferralDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateReferralDto {
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
    companyId;
}
exports.CreateReferralDto = CreateReferralDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome do cliente',
        example: 'Empresa Alpha'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Informações de contacto',
        example: 'alpha@example.com | +351 912 345 678'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "contactInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fonte da referência',
        example: 'Website',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "referralSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da referência',
        enum: client_1.ReferralStatus,
        example: client_1.ReferralStatus.NEW,
        required: false
    }),
    (0, class_validator_1.IsEnum)(client_1.ReferralStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de projeto',
        example: 'FREIGHT'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "projectType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor estimado do projeto',
        example: 1200
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateReferralDto.prototype, "estimatedValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data da referência',
        example: '2026-01-07'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "referralDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionais',
        example: 'Cliente potencial vindo do site',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome de quem fez a referência',
        example: 'João Silva'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "referredBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor da comissão',
        example: 60,
        required: false
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateReferralDto.prototype, "commission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID da empresa (apenas para SUPER_ADMIN)',
        example: 'uuid-da-empresa',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "companyId", void 0);
//# sourceMappingURL=create-referral.dto.js.map