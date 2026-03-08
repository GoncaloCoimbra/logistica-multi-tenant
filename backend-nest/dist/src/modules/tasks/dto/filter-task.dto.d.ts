import { TaskStatus, TaskPriority } from './create-task.dto';
export declare class FilterTaskDto {
    status?: TaskStatus;
    priority?: TaskPriority;
    companyId?: string;
    assignedTo?: string;
    dueDateBefore?: string;
    dueDateAfter?: string;
    search?: string;
}
