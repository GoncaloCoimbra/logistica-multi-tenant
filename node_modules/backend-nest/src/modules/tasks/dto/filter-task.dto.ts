import { IsOptional, IsEnum, IsUUID, IsDateString, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from './create-task.dto';

export class FilterTaskDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING 
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ 
    description: 'Filtrar por prioridade da tarefa',
    enum: TaskPriority,
    example: TaskPriority.HIGH 
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({ 
    description: 'Filtrar por ID da empresa (apenas SUPER_ADMIN)',
    example: 'uuid-da-empresa' 
  })
  @IsUUID('4')
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por responsável',
    example: 'João Silva' 
  })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar tarefas com vencimento até esta data',
    example: '2026-01-31' 
  })
  @IsDateString()
  @IsOptional()
  dueDateBefore?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar tarefas com vencimento após esta data',
    example: '2026-01-01' 
  })
  @IsDateString()
  @IsOptional()
  dueDateAfter?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por texto no título ou descrição',
    example: 'implementar' 
  })
  @IsString()
  @IsOptional()
  search?: string;
}