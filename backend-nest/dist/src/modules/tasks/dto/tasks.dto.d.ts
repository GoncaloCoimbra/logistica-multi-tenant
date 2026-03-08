import { TaskStatus, TaskPriority } from './create-task.dto';
export declare class TaskResponseDto {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
    assignedTo: string | null;
    createdAt: Date;
    updatedAt: Date;
    companyId: string;
    createdById: string;
}
export declare class TaskStatsDto {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    urgent: number;
    overdue: number;
}
