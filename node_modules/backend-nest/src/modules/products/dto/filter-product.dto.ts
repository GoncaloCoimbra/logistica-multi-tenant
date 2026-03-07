import { IsOptional, IsEnum, IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class FilterProductDto {
  @ApiProperty({ required: false, enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({ required: false, description: 'ID do fornecedor' })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiProperty({ required: false, description: 'Busca por código ou descrição' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Nome do fornecedor' })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiProperty({ required: false, description: 'Localização atual do produto' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, description: 'Data inicial (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ required: false, description: 'Data final (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}