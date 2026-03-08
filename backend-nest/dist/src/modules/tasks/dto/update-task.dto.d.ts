import { TaskStatus, TaskPriority } from '@prisma/client';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    assignedTo?: string;
}
export declare class UpdateTaskStatusDto {
    status: TaskStatus;
}
