import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskResponseDto, TaskStatsDto } from './dto/tasks.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, req: any): Promise<TaskResponseDto>;
    findAll(filterDto: FilterTaskDto, req: any): Promise<TaskResponseDto[]>;
    getStats(companyId: string, req: any): Promise<TaskStatsDto>;
    findOne(id: string, req: any): Promise<TaskResponseDto>;
    update(id: string, updateTaskDto: UpdateTaskDto, req: any): Promise<TaskResponseDto>;
    updateStatus(id: string, updateStatusDto: UpdateTaskStatusDto, req: any): Promise<TaskResponseDto>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
