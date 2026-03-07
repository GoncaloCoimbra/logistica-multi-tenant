import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  //  REGISTER 
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, role, companyId } = registerDto;

    this.logger.log(`🔵 Iniciando registro para: ${email}`);

    // Verificar se o email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      this.logger.warn(` Email já existe: ${email}`);
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  CORREÇÃO: Usar transação para garantir que tudo seja salvo
    const result = await this.prisma.$transaction(async (tx) => {
      let finalCompanyId = companyId;

      // Se não tem companyId e não é SUPER_ADMIN, criar empresa padrão
      if (!companyId && role !== Role.SUPER_ADMIN) {
        this.logger.log(` Criando empresa padrão para: ${name}`);
        
        const company = await tx.company.create({
          data: {
            name: `Empresa de ${name}`,
            nif: `TEMP-${Date.now()}`, // Gerar NIF temporário único
            email: email,
            phone: null,
            address: null,
            isActive: true,
          },
        });

        finalCompanyId = company.id;
        this.logger.log(` Empresa criada com ID: ${company.id}`);
      }

      // Criar o usuário
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || Role.OPERATOR,
          companyId: finalCompanyId || null,
        },
      });

      this.logger.log(` Usuário criado com ID: ${user.id}`);
      return user;
    });

    //  VERIFICAÇÃO: Confirmar que o usuário foi salvo
    const savedUser = await this.prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!savedUser) {
      this.logger.error(` ERRO CRÍTICO: Usuário não foi encontrado após criação: ${email}`);
      throw new Error('Erro ao criar usuário');
    }

    this.logger.log(`🔍 Usuário confirmado no banco: ${savedUser.id}`);
    this.logger.log(`🏢 Empresa associada: ${savedUser.companyId || 'Nenhuma'}`);

    const tokens = await this.generateTokens(savedUser.id, savedUser.email, savedUser.role);

    return {
      ...tokens,
      user: this.formatUser(savedUser),
    };
  }

  //  LOGIN 
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    this.logger.log(`🔵 Tentativa de login para: ${email}`);

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { company: true }, //  Incluir empresa nos dados
    });

    if (!user) {
      this.logger.warn(` LOGIN FALHADO: Email "${email}" não encontrado`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.log(`🔍 Usuário encontrado: ${user.id} | Role: ${user.role} | Ativo: ${user.isActive}`);

    if (!user.isActive) {
      this.logger.warn(` LOGIN FALHADO: Utilizador "${email}" está inativo`);
      throw new UnauthorizedException('Utilizador inativo');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      this.logger.warn(` LOGIN FALHADO: Password incorreta para "${email}"`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.log(` LOGIN SUCESSO: ${email} | Company: ${user.companyId || 'Nenhuma'}`);

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: this.formatUser(user),
    };
  }

  //  VALIDATE USER 
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.formatUser(user);
    }
    return null;
  }

  //  UPDATE PROFILE 
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { name, email } = updateProfileDto;

    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Este email já está em uso');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    this.logger.log(`Perfil atualizado: ${updatedUser.email}`);
    return { user: this.formatUser(updatedUser) };
  }

  //  CHANGE PASSWORD 
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilizador não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password atual incorreta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    this.logger.log(`Password alterada: ${user.email}`);
    return { message: 'Password alterada com sucesso' };
  }

  //  UPLOAD AVATAR 
  async uploadAvatar(userId: string, file: MulterFile) {
    if (!file) {
      throw new BadRequestException('Nenhum ficheiro enviado');
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExt = path.extname(file.originalname);
    const fileName = `${userId}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    }) as any;

    if (user?.avatarUrl) {
      const oldAvatarPath = path.join(process.cwd(), user.avatarUrl);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    const avatarUrl = `/uploads/avatars/${fileName}`;
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl } as any,
    });

    this.logger.log(`Avatar atualizado: ${updatedUser.email}`);
    return { user: this.formatUser(updatedUser) };
  }

  //  REFRESH TOKEN
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET || 'default-secret-key',
      });

      // Check if refresh token exists and is not revoked
      const tokens = await (this.prisma as any).refreshToken.findMany({
        where: {
          userId: payload.sub,
          revoked: false,
          expiresAt: { gt: new Date() },
        },
      });

      let validToken = false;
      for (const t of tokens) {
        if (await bcrypt.compare(refreshToken, t.tokenHash)) {
          validToken = true;
          // Revoke the used refresh token
          await (this.prisma as any).refreshToken.update({
            where: { id: t.id },
            data: { revoked: true },
          });
          break;
        }
      }

      if (!validToken) {
        throw new UnauthorizedException('Refresh token inválido ou expirado');
      }

      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { company: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Utilizador não encontrado ou inativo');
      }

      // Generate new tokens
      const newTokens = await this.generateTokens(user.id, user.email, user.role);

      return {
        ...newTokens,
        user: this.formatUser(user),
      };
    } catch (error) {
      this.logger.error('Erro ao renovar token:', error.message);
      throw new UnauthorizedException('Token de refresh inválido');
    }
  }

  //  REMOVE AVATAR
  async removeAvatar(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    }) as any;

    if (user?.avatarUrl) {
      const avatarPath = path.join(process.cwd(), user.avatarUrl);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null } as any,
    });

    this.logger.log(`Avatar removido: ${updatedUser.email}`);
    return { user: this.formatUser(updatedUser) };
  }

  //  PRIVATE METHODS 
  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'default-secret-key',
      expiresIn: '7d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'default-secret-key',
      expiresIn: '30d',
    });

    // Persist refresh token (hashed) for revocation support
    try {
      const hash = await bcrypt.hash(refreshToken, 10);
      const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000);
      await (this.prisma as any).refreshToken.create({
        data: {
          tokenHash: hash,
          userId,
          expiresAt,
        },
      });
    } catch (err) {
      this.logger.error('Erro ao gravar refresh token', err?.message || err);
    }

    return { token, refreshToken };
  }

  // Revoke a refresh token (find by comparing hashes)
  async revokeRefreshToken(refreshToken: string) {
    const tokens = await (this.prisma as any).refreshToken.findMany({ where: { revoked: false } });
    for (const t of tokens) {
      if (await bcrypt.compare(refreshToken, t.tokenHash)) {
        await (this.prisma as any).refreshToken.update({ where: { id: t.id }, data: { revoked: true } });
        return { revoked: true };
      }
    }
    return { revoked: false };
  }

  private formatUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId ?? null,
      isActive: user.isActive,
      avatarUrl: user.avatarUrl ?? null,
    };
  }
}