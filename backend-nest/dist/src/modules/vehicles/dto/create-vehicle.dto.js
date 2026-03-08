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
exports.CreateVehicleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateVehicleDto {
    licensePlate;
    model;
    brand;
    type;
    capacity;
    year;
    status;
    companyId;
    userId;
}
exports.CreateVehicleDto = CreateVehicleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AB-12-CD' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Matrícula é obrigatória' }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toUpperCase()),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "licensePlate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sprinter 415' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Modelo é obrigatório' }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mercedes-Benz' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Marca é obrigatória' }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'truck',
        description: 'Tipo de veículo: truck, Carrinha, car, etc'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tipo é obrigatório' }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3500, description: 'Capacidade em kg' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Capacidade é obrigatória' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Capacidade deve ser um número' }),
    (0, class_validator_1.Min)(1, { message: 'Capacidade deve ser maior que 0' }),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2023 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Ano é obrigatório' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Ano deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1900, { message: 'Ano deve ser no mínimo 1900' }),
    (0, class_validator_1.Max)(new Date().getFullYear() + 1, { message: `Ano deve ser no máximo ${new Date().getFullYear() + 1}` }),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'available',
        enum: client_1.VehicleStatus,
        description: 'Status do veículo',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.VehicleStatus, {
        message: `Status deve ser: ${Object.values(client_1.VehicleStatus).join(', ')}`
    }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "userId", void 0);
//# sourceMappingURL=create-vehicle.dto.js.map