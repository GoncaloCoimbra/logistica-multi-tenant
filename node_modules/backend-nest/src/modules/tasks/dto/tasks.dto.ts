import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from './create-task.dto';

export class TaskResponseDto {
  @ApiProperty({ description: 'ID único da tarefa', example: 'uuid-da-tarefa' })
  id: string;

  @ApiProperty({ description: 'Título da tarefa', example: 'Implementar novo recurso' })
  title: string;

  @ApiProperty({ description: 'Descrição da tarefa', example: 'Implementar sistema de notificações' })
  description: string;

  @ApiProperty({ 
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING 
  })
  status: TaskStatus;

  @ApiProperty({ 
    description: 'Prioridade da tarefa',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM 
  })
  priority: TaskPriority;

  @ApiProperty({ description: 'Data de vencimento', example: '2026-01-15T00:00:00.000Z' })
  dueDate: Date;

  @ApiProperty({ description: 'Nome do responsável', example: 'João Silva', nullable: true })
  assignedTo: string | null;

  @ApiProperty({ description: 'Data de criação', example: '2026-01-06T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização', example: '2026-01-06T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'ID da empresa', example: 'uuid-da-empresa' })
  companyId: string;

  @ApiProperty({ description: 'ID do usuário que criou a tarefa', example: 'uuid-do-usuario' })
  createdById: string;
}

export class TaskStatsDto {
  @ApiProperty({ description: 'Total de tarefas', example: 42 })
  total: number;

  @ApiProperty({ description: 'Tarefas pendentes', example: 15 })
  pending: number;

  @ApiProperty({ description: 'Tarefas em progresso', example: 10 })
  inProgress: number;

  @ApiProperty({ description: 'Tarefas concluídas', example: 15 })
  completed: number;

  @ApiProperty({ description: 'Tarefas canceladas', example: 2 })
  cancelled: number;

  @ApiProperty({ description: 'Tarefas urgentes', example: 5 })
  urgent: number;

  @ApiProperty({ description: 'Tarefas atrasadas', example: 3 })
  overdue: number;
}
