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
        description: 'Vehicle ID (UUID)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Invalid VehicleId' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Lisboa',
        description: 'City/Origin location',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Porto',
        description: 'City/Destination location',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-01',
        description: 'Departure date (YYYY-MM-DD)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Date de partida inválida' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "departureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-05',
        description: 'Estimated arrival date (YYYY-MM-DD)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid arrival date' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "estimatedArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1500.5,
        description: 'Total load weight in kg',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Weight must be a number' }),
    __metadata("design:type", Number)
], UpdateTransportDto.prototype, "totalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Load frágil - manusear com cuidado',
        description: 'Notes about transport',
        required: false,
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
        description: `Transport status:
    - PENDING: Awaiting departure
    - IN_TRANSIT: In transit
    - ARRIVED: Arrived at destination (automatic on estimated date)
    - DELIVERED: Delivered after verification (products automatically change to APPROVED)
    - CANCELED: Canceled (products automatically return to stock)`,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TransportStatus, { message: 'Invalid status' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-05T14:30:00Z',
        description: 'Actual arrival date/time (filled in when verifying delivery)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid actual arrival date' }),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "actualArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'João Silva',
        description: 'Name of person who physically received the load',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "receivedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Load received in perfect condition. 2 pallets verified.',
        description: 'Notes about receipt',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransportDto.prototype, "receivingNotes", void 0);
//# sourceMappingURL=update-transport.dto.js.map