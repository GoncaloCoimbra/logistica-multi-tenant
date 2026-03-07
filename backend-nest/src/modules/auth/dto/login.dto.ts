import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin@logistica.com',
    description: 'Email do utilizador registado no sistema',
    type: String,
  })
  @IsEmail({}, { message: 'Email inválido. Por favor, insira um email válido.' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Password do utilizador (mínimo 6 caracteres)',
    minLength: 6,
    maxLength: 128,
    type: String,
  })
  @IsNotEmpty({ message: 'Password é obrigatória' })
  @MinLength(6, { message: 'Password deve ter no mínimo 6 caracteres' })
  @MaxLength(128, { message: 'Password não pode exceder 128 caracteres' })
  password: string;
}