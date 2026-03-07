// src/modules/suppliers/dto/create-supplier.dto.ts

import { 
  IsNotEmpty, 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsUUID,
  MinLength,
  MaxLength 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
 
  // 🏢 INFORMAÇÕES BÁSICAS
 
  @ApiProperty({ 
    example: 'Fornecedor ABC Lda',
    description: 'Nome do fornecedor'
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({ 
    example: '123456789',
    description: 'NIF/NIPC do fornecedor (Portugal) - 8 ou 9 dígitos'
  })
  @IsNotEmpty({ message: 'NIF é obrigatório' })
  @IsString()
  @MinLength(8, { message: 'NIF deve ter no mínimo 8 dígitos' })
  @MaxLength(9, { message: 'NIF deve ter no máximo 9 dígitos' })
  nif: string;

 
  // 📧 CONTACTOS
 
  @ApiProperty({ 
    example: 'fornecedor@exemplo.com',
    description: 'Email de contacto'
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ 
    example: '+351 912 345 678',
    description: 'Telefone de contacto'
  })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @IsString()
  @MinLength(9, { message: 'Telefone inválido' })
  phone: string;

 
  // 📍 MORADA (Opcional)
 
  @ApiProperty({ 
    example: 'Rua Exemplo, 123',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ 
    example: 'Porto',
    required: false
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ 
    example: 'Portugal',
    required: false
  })
  @IsOptional()
  @IsString()
  state?: string;

 
  // 🏢 COMPANY ID (Injetado pelo TenantGuard)
 
  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID da empresa (injetado automaticamente pelo TenantGuard)',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'CompanyId inválido' })
  companyId?: string;
}