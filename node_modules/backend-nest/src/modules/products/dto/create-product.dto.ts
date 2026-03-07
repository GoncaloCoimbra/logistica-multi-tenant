import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'PROD-001' })
  @IsNotEmpty({ message: 'Código interno é obrigatório' })
  @IsString()
  internalCode: string;

  @ApiProperty({ example: 'Produto de teste' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString()
  description: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'kg' })
  @IsNotEmpty({ message: 'Unidade é obrigatória' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 50.5, required: false })
  @IsOptional()
  @IsNumber()
  totalWeight?: number;

  @ApiProperty({ example: 2.5, required: false })
  @IsOptional()
  @IsNumber()
  totalVolume?: number;

  @ApiProperty({ example: 'Armazém A', required: false })
  @IsOptional()
  @IsString()
  currentLocation?: string;

  @ApiProperty({ description: 'ID do fornecedor', required: true })
  @IsNotEmpty({ message: 'Fornecedor é obrigatório' })
  @IsUUID('4', { message: 'ID do fornecedor inválido' })
  supplierId: string;

  @ApiProperty({ 
    enum: ProductStatus, 
    example: ProductStatus.RECEIVED,
    required: false,
    description: 'Status do produto (padrão: RECEIVED)'
  })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Status inválido' })
  status?: ProductStatus;
}