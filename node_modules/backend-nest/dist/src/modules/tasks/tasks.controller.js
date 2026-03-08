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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const filter_task_dto_1 = require("./dto/filter-task.dto");
const tasks_dto_1 = require("./dto/tasks.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async create(createTaskDto, req) {
        return this.tasksService.create(createTaskDto, req.user.id, req.user.role, req.user.companyId);
    }
    async findAll(filterDto, req) {
        return this.tasksService.findAll(filterDto, req.user.id, req.user.role, req.user.companyId);
    }
    async getStats(companyId, req) {
        return this.tasksService.getStats(req.user.id, req.user.role, req.user.companyId, companyId);
    }
    async findOne(id, req) {
        return this.tasksService.findOne(id, req.user.id, req.user.role, req.user.companyId);
    }
    async update(id, updateTaskDto, req) {
        return this.tasksService.update(id, updateTaskDto, req.user.id, req.user.role, req.user.companyId);
    }
    async updateStatus(id, updateStatusDto, req) {
        return this.tasksService.updateStatus(id, updateStatusDto, req.user.id, req.user.role, req.user.companyId);
    }
    async remove(id, req) {
        return this.tasksService.remove(id, req.user.id, req.user.role, req.user.companyId);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova tarefa' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tarefa criada com sucesso',
        type: tasks_dto_1.TaskResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as tarefas com filtros opcionais' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de tarefas',
        type: [tasks_dto_1.TaskResponseDto]
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_task_dto_1.FilterTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas das tarefas' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'ID da empresa (apenas SUPER_ADMIN)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estatísticas das tarefas',
        type: tasks_dto_1.TaskStatsDto
    }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar tarefa por ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tarefa encontrada',
        type: tasks_dto_1.TaskResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarefa não encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar tarefa' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tarefa atualizada com sucesso',
        type: tasks_dto_1.TaskResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarefa não encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar status da tarefa' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Status atualizado com sucesso',
        type: tasks_dto_1.TaskResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarefa não encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskStatusDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir tarefa' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarefa excluída com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarefa não encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map