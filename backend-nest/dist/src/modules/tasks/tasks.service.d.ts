import { PrismaService } from '../../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatsDto } from './dto/tasks.dto';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTaskDto: CreateTaskDto, userId: string, userRole: string, userCompanyId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string;
        status: import(".prisma/client").$Enums.TaskStatus;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueDate: Date;
        assignedTo: string | null;
        createdById: string;
    }>;
    findAll(filterDto: FilterTaskDto, userId: string, userRole: string, userCompanyId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string;
        status: import(".prisma/client").$Enums.TaskStatus;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueDate: Date;
        assignedTo: string | null;
        createdById: string;
    }[]>;
    findOne(id: string, userId: string, userRole: string, userCompanyId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string;
        status: import(".prisma/client").$Enums.TaskStatus;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueDate: Date;
        assignedTo: string | null;
        createdById: string;
    }>;
    update(id: string, updateTaskDto: UpdateTaskDto, userId: string, userRole: string, userCompanyId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string;
        status: import(".prisma/client").$Enums.TaskStatus;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueDate: Date;
        assignedTo: string | null;
        createdById: string;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateTaskStatusDto, userId: string, userRole: string, userCompanyId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string;
        status: import(".prisma/client").$Enums.TaskStatus;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueDate: Date;
        assignedTo: string | null;
        createdById: string;
    }>;
    remove(id: string, userId: string, userRole: string, userCompanyId: string): Promise<{
        message: string;
    }>;
    getStats(userId: string, userRole: string, userCompanyId: string, companyId?: string): Promise<TaskStatsDto>;
}
