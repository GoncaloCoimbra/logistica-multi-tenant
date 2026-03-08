import { TaskStatus, TaskPriority } from '@prisma/client';
export { TaskStatus, TaskPriority };
export declare class CreateTaskDto {
    title: string;
    description: string;
    status?: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    assignedTo?: string;
    companyId?: string;
}
