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
exports.FilterTaskDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const create_task_dto_1 = require("./create-task.dto");
class FilterTaskDto {
    status;
    priority;
    companyId;
    assignedTo;
    dueDateBefore;
    dueDateAfter;
    search;
}
exports.FilterTaskDto = FilterTaskDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrar por status da tarefa',
        enum: create_task_dto_1.TaskStatus,
        example: create_task_dto_1.TaskStatus.PENDING
    }),
    (0, class_validator_1.IsEnum)(create_task_dto_1.TaskStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrar por prioridade da tarefa',
        enum: create_task_dto_1.TaskPriority,
        example: create_task_dto_1.TaskPriority.HIGH
    }),
    (0, class_validator_1.IsEnum)(create_task_dto_1.TaskPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterTaskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrar por ID da empresa (apenas SUPER_ADMIN)',
        example: 'uuid-da-empresa'
    }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterTaskDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrar por responsável',
        example: 'João Silva'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterTaskDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrar tarefas com vencimento até esta data',
        example: '2026-01-31'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterTaskDto.prototype, "dueDateBefore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrar tarefas com vencimento após esta data',
        example: '2026-01-01'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterTaskDto.prototype, "dueDateAfter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Buscar por texto no título ou descrição',
        example: 'implementar'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterTaskDto.prototype, "search", void 0);
//# sourceMappingURL=filter-task.dto.js.map