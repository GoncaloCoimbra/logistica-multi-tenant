// src/modules/transports/dto/update-transport.dto.ts

import { 
  IsOptional, 
  IsString, 
  IsDateString, 
  IsNumber, 
  IsUUID,
  IsEnum
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransportStatus } from '@prisma/client';

/**
 * DTO para atualização de transportes
 * 
 * ⚠️ REGRA IMPORTANTE: Produtos NÃO podem ser editados após criação do transporte
 * 
 * Campos editáveis:
 * - Veículo (vehicleId)
 * - Origem e Destino (origin, destination)
 * - Datas (departureDate, estimatedArrival)
 * - Peso e Observações (totalWeight, notes)
 * - Status (status) - com automações especiais para ARRIVED, DELIVERED e CANCELED
 * - Conferência (actualArrival, receivedBy, receivingNotes) - usado ao mudar ARRIVED → DELIVERED
 * 
 * Para alterar produtos:
 * 1. Cancele o transporte (produtos voltam ao stock)
 * 2. Crie um novo transporte com os produtos corretos
 */
export class UpdateTransportDto {
  
  // 🚗 VEÍCULO
  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID do veículo (UUID)',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'VehicleId inválido' })
  vehicleId?: string;

  // 📍 ORIGEM E DESTINO
  @ApiProperty({ 
    example: 'Lisboa',
    description: 'Cidade/Local de origem',
    required: false
  })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiProperty({ 
    example: 'Porto',
    description: 'Cidade/Local de destino',
    required: false
  })
  @IsOptional()
  @IsString()
  destination?: string;

  // 📅 DATAS
  @ApiProperty({ 
    example: '2025-12-01',
    description: 'Data de partida (YYYY-MM-DD)',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de partida inválida' })
  departureDate?: string;

  @ApiProperty({ 
    example: '2025-12-05',
    description: 'Data estimada de chegada (YYYY-MM-DD)',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de chegada inválida' })
  estimatedArrival?: string;

  // ⚖️ PESO E OBSERVAÇÕES
  @ApiProperty({ 
    example: 1500.50,
    description: 'Peso total da carga em kg',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Peso deve ser um número' })
  totalWeight?: number;

  @ApiProperty({ 
    example: 'Carga frágil - manusear com cuidado',
    description: 'Observações sobre o transporte',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // 📊 STATUS
  @ApiProperty({ 
    enum: TransportStatus,
    example: TransportStatus.IN_TRANSIT,
    required: false,
    description: `Status do transporte:
    - PENDING: Aguardando partida
    - IN_TRANSIT: Em trânsito
    - ARRIVED: Chegou ao destino (automático na data estimada)
    - DELIVERED: Entregue após conferência (produtos mudam para APPROVED automaticamente)
    - CANCELED: Cancelado (produtos voltam ao stock automaticamente)`
  })
  @IsOptional()
  @IsEnum(TransportStatus, { message: 'Status inválido' })
  status?: TransportStatus;

  //  NOVOS CAMPOS DE CONFERÊNCIA
  @ApiProperty({ 
    example: '2025-12-05T14:30:00Z',
    description: 'Data/hora real de chegada (preenchido ao conferir entrega)',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de chegada real inválida' })
  actualArrival?: string;

  @ApiProperty({ 
    example: 'João Silva',
    description: 'Nome de quem recebeu fisicamente a carga',
    required: false
  })
  @IsOptional()
  @IsString()
  receivedBy?: string;

  @ApiProperty({ 
    example: 'Carga recebida em perfeitas condições. 2 paletes verificadas.',
    description: 'Observações sobre o recebimento',
    required: false
  })
  @IsOptional()
  @IsString()
  receivingNotes?: string;
}