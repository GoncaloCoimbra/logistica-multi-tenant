import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client'; // ← IMPORTAR DO PRISMA

export { TaskStatus, TaskPriority }; // ← REEXPORTAR

export class CreateTaskDto {
  @ApiProperty({ 
    description: 'Título da tarefa', 
    example: 'Implementar novo recurso' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: 'Descrição detalhada da tarefa', 
    example: 'Implementar sistema de notificações em tempo real' 
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    required: false
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ 
    description: 'Prioridade da tarefa',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM
  })
  @IsEnum(TaskPriority)
  @IsNotEmpty()
  priority: TaskPriority;

  @ApiProperty({ 
    description: 'Data de vencimento da tarefa', 
    example: '2026-01-15T00:00:00.000Z' 
  })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({ 
    description: 'Nome do responsável pela tarefa', 
    example: 'João Silva',
    required: false 
  })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiProperty({ 
    description: 'ID da empresa (apenas para SUPER_ADMIN)', 
    example: 'uuid-da-empresa',
    required: false 
  })
  @IsString()
  @IsOptional()
  companyId?: string;
}