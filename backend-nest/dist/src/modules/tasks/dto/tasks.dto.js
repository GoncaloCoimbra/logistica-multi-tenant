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
exports.TaskStatsDto = exports.TaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_task_dto_1 = require("./create-task.dto");
class TaskResponseDto {
    id;
    title;
    description;
    status;
    priority;
    dueDate;
    assignedTo;
    createdAt;
    updatedAt;
    companyId;
    createdById;
}
exports.TaskResponseDto = TaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único da tarefa', example: 'uuid-da-tarefa' }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Título da tarefa',
        example: 'Implementar  new recurso',
    }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descrição da tarefa',
        example: 'Implementar sistema de notificações',
    }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da tarefa',
        enum: create_task_dto_1.TaskStatus,
        example: create_task_dto_1.TaskStatus.PENDING,
    }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority da tarefa',
        enum: create_task_dto_1.TaskPriority,
        example: create_task_dto_1.TaskPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de vencimento',
        example: '2026-01-15T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], TaskResponseDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name do responsável',
        example: 'João Silva',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TaskResponseDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de criação',
        example: '2026-01-06T10:00:00.000Z',
    }),
    __metadata("design:type", Date)
], TaskResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date da última atualização',
        example: '2026-01-06T10:00:00.000Z',
    }),
    __metadata("design:type", Date)
], TaskResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company ID', example: 'uuid-company' }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the user who created the task',
        example: 'uuid-user',
    }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "createdById", void 0);
class TaskStatsDto {
    total;
    pending;
    inProgress;
    completed;
    cancelled;
    urgent;
    overdue;
}
exports.TaskStatsDto = TaskStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de tarefas', example: 42 }),
    __metadata("design:type", Number)
], TaskStatsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tarefas pendentes', example: 15 }),
    __metadata("design:type", Number)
], TaskStatsDto.prototype, "pending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tarefas em progresso', example: 10 }),
    __metadata("design:type", Number)
], TaskStatsDto.prototype, "inProgress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tarefas concluídas', example: 15 }),
    __metadata("design:type", Number)
], TaskStatsDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tarefas canceladas', example: 2 }),
    __metadata("design:type", Number)
], TaskStatsDto.prototype, "cancelled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tarefas urgentes', example: 5 }),
    __metadata("design:type", Number)
], TaskStatsDto.prototype, "urgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tarefas atrasadas', example: 3 }),
    __metadata("design:type", Number)
], TaskStatsDto.prototype, "overdue", void 0);
//# sourceMappingURL=tasks.dto.js.map