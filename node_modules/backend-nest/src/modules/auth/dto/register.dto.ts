import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do utilizador',
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do utilizador',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password do utilizador',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Password é obrigatória' })
  @MinLength(6, { message: 'Password deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'OPERATOR',
    description: 'Role do utilizador',
    enum: Role,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role inválida' })
  role?: Role;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614173000',
    description: 'ID da empresa (apenas para ADMIN criar utilizadores)',
    required: false,
  })
  @IsOptional()
  companyId?: string;
}
