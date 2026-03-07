import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ 
    example: 'Nova movimentação de produto',
    description: 'Título da notificação'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'O produto XYZ foi movido para o armazém A',
    description: 'Conteúdo da notificação'
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class MarkAsReadDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da notificação'
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}