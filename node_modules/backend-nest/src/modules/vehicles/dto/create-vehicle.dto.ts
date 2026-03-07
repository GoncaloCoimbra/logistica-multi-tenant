// src/modules/vehicles/dto/create-vehicle.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsInt, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @ApiProperty({ example: 'AB-12-CD' })
  @IsNotEmpty({ message: 'Matrícula é obrigatória' })
  @IsString()
  @Transform(({ value }) => value?.trim().toUpperCase())
  licensePlate: string;

  @ApiProperty({ example: 'Sprinter 415' })
  @IsNotEmpty({ message: 'Modelo é obrigatório' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  model: string;

  @ApiProperty({ example: 'Mercedes-Benz' })
  @IsNotEmpty({ message: 'Marca é obrigatória' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  brand: string;

  @ApiProperty({ 
    example: 'truck', 
    description: 'Tipo de veículo: truck, Carrinha, car, etc'
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  type: string;

  @ApiProperty({ example: 3500, description: 'Capacidade em kg' })
  @IsNotEmpty({ message: 'Capacidade é obrigatória' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Capacidade deve ser um número' })
  @Min(1, { message: 'Capacidade deve ser maior que 0' })
  capacity: number;

  @ApiProperty({ example: 2023 })
  @IsNotEmpty({ message: 'Ano é obrigatório' })
  @Type(() => Number)
  @IsInt({ message: 'Ano deve ser um número inteiro' })
  @Min(1900, { message: 'Ano deve ser no mínimo 1900' })
  @Max(new Date().getFullYear() + 1, { message: `Ano deve ser no máximo ${new Date().getFullYear() + 1}` })
  year: number;

  @ApiProperty({ 
    example: 'available', 
    enum: VehicleStatus,
    description: 'Status do veículo',
    required: false
  })
  @IsOptional()
  @IsEnum(VehicleStatus, {
    message: `Status deve ser: ${Object.values(VehicleStatus).join(', ')}`
  })
  status?: VehicleStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}