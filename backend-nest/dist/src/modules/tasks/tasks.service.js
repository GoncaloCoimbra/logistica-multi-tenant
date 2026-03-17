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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTaskDto, userId, userRole, userCompanyId) {
        let companyId = userCompanyId;
        if (userRole === 'SUPER_ADMIN') {
            if (!createTaskDto.companyId) {
                throw new common_1.BadRequestException('SUPER_ADMIN deve especificar o ID da company');
            }
            companyId = createTaskDto.companyId;
            const companyExists = await this.prisma.company.findUnique({
                where: { id: companyId },
            });
            if (!companyExists) {
                throw new common_1.NotFoundException('Company não encontrada');
            }
        }
        const dueDate = new Date(createTaskDto.dueDate);
        const task = await this.prisma.task.create({ data: {
                title: createTaskDto.title,
                description: createTaskDto.description,
                status: 'PENDING',
                priority: createTaskDto.priority,
                dueDate: dueDate,
                assignedTo: createTaskDto.assignedTo || null,
                companyId: companyId,
                createdById: userId,
            },
        });
        return task;
    }
    async findAll(filterDto, userId, userRole, userCompanyId) {
        const where = {};
        if (userRole === 'SUPER_ADMIN') {
            if (filterDto.companyId) {
                where.companyId = filterDto.companyId;
            }
        }
        else {
            where.companyId = userCompanyId;
        }
        if (filterDto.status) {
            where.status = filterDto.status;
        }
        if (filterDto.priority) {
            where.priority = filterDto.priority;
        }
        if (filterDto.assignedTo) {
            where.assignedTo = {
                contains: filterDto.assignedTo,
                mode: 'insensitive',
            };
        }
        if (filterDto.dueDateBefore || filterDto.dueDateAfter) {
            where.dueDate = {};
            if (filterDto.dueDateBefore) {
                where.dueDate.lte = new Date(filterDto.dueDateBefore);
            }
            if (filterDto.dueDateAfter) {
                where.dueDate.gte = new Date(filterDto.dueDateAfter);
            }
        }
        if (filterDto.search) {
            where.OR = [
                { title: { contains: filterDto.search, mode: 'insensitive' } },
                { description: { contains: filterDto.search, mode: 'insensitive' } },
            ];
        }
        const tasks = await this.prisma.task.findMany({
            where,
            orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
        });
        return tasks;
    }
    async findOne(id, userId, userRole, userCompanyId) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            throw new common_1.NotFoundException('Tarefa não encontrada');
        }
        if (userRole !== 'SUPER_ADMIN' && task.companyId !== userCompanyId) {
            throw new common_1.ForbiddenException('Você não tem permissão para visualizar esta tarefa');
        }
        return task;
    }
    async update(id, updateTaskDto, userId, userRole, userCompanyId) {
        const task = await this.findOne(id, userId, userRole, userCompanyId);
        const updateData = {};
        if (updateTaskDto.title !== undefined) {
            updateData.title = updateTaskDto.title;
        }
        if (updateTaskDto.description !== undefined) {
            updateData.description = updateTaskDto.description;
        }
        if (updateTaskDto.priority !== undefined) {
            updateData.priority = updateTaskDto.priority;
        }
        if (updateTaskDto.status !== undefined) {
            updateData.status = updateTaskDto.status;
        }
        if (updateTaskDto.dueDate !== undefined) {
            updateData.dueDate = new Date(updateTaskDto.dueDate);
        }
        if (updateTaskDto.assignedTo !== undefined) {
            updateData.assignedTo = updateTaskDto.assignedTo || null;
        }
        const updatedTask = await this.prisma.task.update({
            where: { id }, data: updateData,
        });
        return updatedTask;
    }
    async updateStatus(id, updateStatusDto, userId, userRole, userCompanyId) {
        const task = await this.findOne(id, userId, userRole, userCompanyId);
        const updatedTask = await this.prisma.task.update({
            where: { id }, data: {
                status: updateStatusDto.status,
            },
        });
        return updatedTask;
    }
    async remove(id, userId, userRole, userCompanyId) {
        const task = await this.findOne(id, userId, userRole, userCompanyId);
        await this.prisma.task.delete({
            where: { id },
        });
        return { message: 'Tarefa excluída com success' };
    }
    async getStats(userId, userRole, userCompanyId, companyId) {
        const where = {};
        if (userRole === 'SUPER_ADMIN' && companyId) {
            where.companyId = companyId;
        }
        else if (userRole !== 'SUPER_ADMIN') {
            where.companyId = userCompanyId;
        }
        const [total, pending, inProgress, completed, cancelled, urgent, overdue] = await Promise.all([
            this.prisma.task.count({ where }),
            this.prisma.task.count({ where: { ...where, status: 'PENDING' } }),
            this.prisma.task.count({ where: { ...where, status: 'IN_PROGRESS' } }),
            this.prisma.task.count({ where: { ...where, status: 'COMPLETED' } }),
            this.prisma.task.count({ where: { ...where, status: 'CANCELLED' } }),
            this.prisma.task.count({ where: { ...where, priority: 'URGENT' } }),
            this.prisma.task.count({
                where: {
                    ...where,
                    dueDate: { lt: new Date() },
                    status: { not: 'COMPLETED' },
                },
            }),
        ]);
        return {
            total,
            pending,
            inProgress,
            completed,
            cancelled,
            urgent,
            overdue,
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map