import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { ReferralStatus } from '@prisma/client';


export class FilterReferralDto {
  @ApiProperty({ 
    description: 'Filtrar por status',
    enum: ReferralStatus,
    required: false
  })
  @IsEnum(ReferralStatus)
  @IsOptional()
  status?: ReferralStatus;

  @ApiProperty({ 
    description: 'Filtrar por tipo de projeto',
    example: 'FREIGHT',
    required: false
  })
  @IsString()
  @IsOptional()
  projectType?: string; // ← MUDAR PARA STRING

  @ApiProperty({ 
    description: 'Filtrar por fonte',
    example: 'Website',
    required: false
  })
  @IsString()
  @IsOptional()
  referralSource?: string;

  @ApiProperty({ 
    description: 'Filtrar por quem referenciou',
    example: 'João Silva',
    required: false
  })
  @IsString()
  @IsOptional()
  referredBy?: string;

  @ApiProperty({ 
    description: 'Data de referência antes de',
    example: '2026-01-31',
    required: false
  })
  @IsDateString()
  @IsOptional()
  referralDateBefore?: string;

  @ApiProperty({ 
    description: 'Data de referência depois de',
    example: '2026-01-01',
    required: false
  })
  @IsDateString()
  @IsOptional()
  referralDateAfter?: string;

  @ApiProperty({ 
    description: 'Buscar no nome do cliente ou notas',
    example: 'empresa',
    required: false
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ 
    description: 'ID da empresa (apenas SUPER_ADMIN)',
    example: 'uuid-da-empresa',
    required: false
  })
  @IsString()
  @IsOptional()
  companyId?: string;
}