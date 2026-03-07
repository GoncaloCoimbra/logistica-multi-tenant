// src/modules/transports/dto/create-transport.dto.ts

import { 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsDateString, 
  IsNumber, 
  IsUUID, 
  IsArray,
  IsEnum,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransportStatus } from '@prisma/client';

//  CLASSE AUXILIAR para produtos
export class TransportProductDto {
  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID do produto'
  })
  @IsNotEmpty({ message: 'ID do produto é obrigatório' })
  @IsUUID('4', { message: 'ID do produto inválido' })
  productId: string;

  @ApiProperty({ 
    example: 50,
    description: 'Quantidade a transportar'
  })
  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  quantity: number;
}

export class CreateTransportDto {
 
  // 🚗 VEÍCULO
 
  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID do veículo (UUID)',
    required: true
  })
  @IsNotEmpty({ message: 'Veículo é obrigatório' })
  @IsUUID('4', { message: 'VehicleId inválido' })
  vehicleId: string;

 
  // 📍 ORIGEM E DESTINO
 
  @ApiProperty({ 
    example: 'Lisboa',
    description: 'Cidade/Local de origem'
  })
  @IsNotEmpty({ message: 'Origem é obrigatória' })
  @IsString()
  origin: string;

  @ApiProperty({ 
    example: 'Porto',
    description: 'Cidade/Local de destino'
  })
  @IsNotEmpty({ message: 'Destino é obrigatório' })
  @IsString()
  destination: string;

 
  // 📅 DATAS
 
  @ApiProperty({ 
    example: '2025-12-01',
    description: 'Data de partida (YYYY-MM-DD)',
    required: true
  })
  @IsNotEmpty({ message: 'Data de partida é obrigatória' })
  @IsDateString({}, { message: 'Data de partida inválida' })
  departureDate: string;

  @ApiProperty({ 
    example: '2025-12-05',
    description: 'Data estimada de chegada (YYYY-MM-DD)',
    required: true
  })
  @IsNotEmpty({ message: 'Data de chegada é obrigatória' })
  @IsDateString({}, { message: 'Data de chegada inválida' })
  estimatedArrival: string;

 
  // ⚖️ PESO E OBSERVAÇÕES
 
  @ApiProperty({ 
    example: 1500.50,
    description: 'Peso total da carga em kg',
    required: true
  })
  @IsNotEmpty({ message: 'Peso total é obrigatório' })
  @IsNumber({}, { message: 'Peso deve ser um número' })
  totalWeight: number;

  @ApiProperty({ 
    example: 'Carga frágil - manusear com cuidado',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;

 
  // 📊 STATUS
 
  @ApiProperty({ 
    enum: TransportStatus,
    example: TransportStatus.PENDING,
    required: false,
    default: TransportStatus.PENDING
  })
  @IsOptional()
  @IsEnum(TransportStatus, { message: 'Status inválido' })
  status?: TransportStatus;

 
  // 🏢 COMPANY ID
 
  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID da empresa (injetado automaticamente)',
    required: false
  })
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

 
  // 📦 PRODUTOS (NOVO - CORRETO)
 
  @ApiProperty({ 
    type: [TransportProductDto], 
    required: false,
    description: 'Produtos a transportar com suas quantidades',
    example: [
      { productId: 'uuid-1', quantity: 50 },
      { productId: 'uuid-2', quantity: 30 }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransportProductDto)
  products?: TransportProductDto[];
}