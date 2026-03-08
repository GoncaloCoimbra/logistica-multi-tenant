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
exports.CreateProductDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateProductDto {
    internalCode;
    description;
    quantity;
    unit;
    totalWeight;
    totalVolume;
    currentLocation;
    supplierId;
    status;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PROD-001' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Código interno é obrigatório' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "internalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Produto de teste' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Descrição é obrigatória' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Quantidade é obrigatória' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'kg' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Unidade é obrigatória' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50.5, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "totalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2.5, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "totalVolume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Armazém A', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "currentLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do fornecedor', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Fornecedor é obrigatório' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID do fornecedor inválido' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ProductStatus,
        example: client_1.ProductStatus.RECEIVED,
        required: false,
        description: 'Status do produto (padrão: RECEIVED)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ProductStatus, { message: 'Status inválido' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "status", void 0);
//# sourceMappingURL=create-product.dto.js.map