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
exports.CreateTransportDto = exports.TransportProductDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class TransportProductDto {
    productId;
    quantity;
}
exports.TransportProductDto = TransportProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'Product ID',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Product ID is required' }),
    (0, class_validator_1.IsUUID)('4', { message: 'Invalid product ID' }),
    __metadata("design:type", String)
], TransportProductDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Quantity to transport',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Quantity is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Quantity must be a number' }),
    __metadata("design:type", Number)
], TransportProductDto.prototype, "quantity", void 0);
class CreateTransportDto {
    vehicleId;
    origin;
    destination;
    departureDate;
    estimatedArrival;
    totalWeight;
    notes;
    status;
    companyId;
    products;
}
exports.CreateTransportDto = CreateTransportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'Vehicle ID (UUID)',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Vehicle is required' }),
    (0, class_validator_1.IsUUID)('4', { message: 'Invalid vehicle ID' }),
    __metadata("design:type", String)
], CreateTransportDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Lisbon',
        description: 'City/Origin location',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Origin is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransportDto.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Porto',
        description: 'City/Destination location',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Destination is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransportDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-01',
        description: 'Departure date (YYYY-MM-DD)',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Departure date is required' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid departure date' }),
    __metadata("design:type", String)
], CreateTransportDto.prototype, "departureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-05',
        description: 'Estimated arrival date (YYYY-MM-DD)',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Arrival date is required' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid arrival date' }),
    __metadata("design:type", String)
], CreateTransportDto.prototype, "estimatedArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1500.5,
        description: 'Total load weight in kg',
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Total weight is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Weight must be a number' }),
    __metadata("design:type", Number)
], CreateTransportDto.prototype, "totalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Fragile cargo - handle with care',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransportDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.TransportStatus,
        example: client_1.TransportStatus.PENDING,
        required: false,
        default: client_1.TransportStatus.PENDING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TransportStatus, { message: 'Invalid status' }),
    __metadata("design:type", String)
], CreateTransportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'Company ID (automatically injected)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateTransportDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [TransportProductDto],
        required: false,
        description: 'Products to transport with their quantities',
        example: [
            { productId: 'uuid-1', quantity: 50 },
            { productId: 'uuid-2', quantity: 30 },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TransportProductDto),
    __metadata("design:type", Array)
], CreateTransportDto.prototype, "products", void 0);
//# sourceMappingURL=create-transport.dto.js.map