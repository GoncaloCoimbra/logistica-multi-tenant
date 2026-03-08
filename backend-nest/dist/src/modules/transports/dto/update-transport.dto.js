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
exports.UpdateTransportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class UpdateTransportDto {
    vehicleId;
    origin;
    destination;
    departureDate;
    estimatedArrival;
    totalWeight;
    notes;
    status;
    actualArrival;
    receivedBy;
    receivingNotes;
}
exports.UpdateTransportDto = UpdateTransportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'ID do veículo (UUID)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'VehicleId inválido' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Lisboa',
        description: 'Cidade/Local de origem',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Porto',
        description: 'Cidade/Local de destino',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-01',
        description: 'Data de partida (YYYY-MM-DD)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de partida inválida' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "departureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-05',
        description: 'Data estimada de chegada (YYYY-MM-DD)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de chegada inválida' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "estimatedArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1500.50,
        description: 'Peso total da carga em kg',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Peso deve ser um número' }),
    __metadata("design:type", Number)
], UpdateTransportDto.prototype, "totalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Carga frágil - manusear com cuidado',
        description: 'Observações sobre o transporte',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.TransportStatus,
        example: client_1.TransportStatus.IN_TRANSIT,
        required: false,
        description: `Status do transporte:
    - PENDING: Aguardando partida
    - IN_TRANSIT: Em trânsito
    - ARRIVED: Chegou ao destino (automático na data estimada)
    - DELIVERED: Entregue após conferência (produtos mudam para APPROVED automaticamente)
    - CANCELED: Cancelado (produtos voltam ao stock automaticamente)`
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TransportStatus, { message: 'Status inválido' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-05T14:30:00Z',
        description: 'Data/hora real de chegada (preenchido ao conferir entrega)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de chegada real inválida' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "actualArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'João Silva',
        description: 'Nome de quem recebeu fisicamente a carga',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "receivedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Carga recebida em perfeitas condições. 2 paletes verificadas.',
        description: 'Observações sobre o recebimento',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "receivingNotes", void 0);
//# sourceMappingURL=update-transport.dto.js.map