import { 
  Injectable, 
  ConflictException, 
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

interface RegisterCompanyDto {
  companyName: string;
  companyNif: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  userName: string;
  userEmail: string;
  userPassword: string;
}

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerCompanyAndUser(data: RegisterCompanyDto) {
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log('📝 Iniciando registro de empresa + usuário');
    this.logger.log(`🏢 Empresa: ${data.companyName}`);
    this.logger.log(`👤 Usuário: ${data.userName} (${data.userEmail})`);
    
    // Log para verificar se Prisma está conectado
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.log(' Prisma conectado com sucesso');
    } catch (err: any) {
      this.logger.error(' ERRO: Prisma não está conectado!');
      this.logger.error('Error:', err.message);
      throw new InternalServerErrorException('Erro de conexão com banco de dados');
    }

    
    // 1. VALIDAÇÕES
    
    this.logger.log('🔍 Validando dados...');

    if (!data.companyName || !data.companyNif || !data.companyEmail) {
      throw new BadRequestException('Dados da empresa incompletos');
    }

    if (!data.userName || !data.userEmail || !data.userPassword) {
      throw new BadRequestException('Dados do usuário incompletos');
    }

    if (data.userPassword.length < 6) {
      throw new BadRequestException('Password deve ter no mínimo 6 caracteres');
    }

    
    // 2. VERIFICAR SE EMPRESA JÁ EXISTE
    
    this.logger.log('🔍 Verificando se empresa já existe...');

    const existingCompany = await this.prisma.company.findFirst({
      where: {
        OR: [
          { nif: data.companyNif },
          { email: data.companyEmail },
        ],
      },
    });

    if (existingCompany) {
      if (existingCompany.nif === data.companyNif) {
        this.logger.error(` NIF ${data.companyNif} já está em uso`);
        throw new ConflictException('Já existe uma empresa com este NIF');
      }
      if (existingCompany.email === data.companyEmail) {
        this.logger.error(` Email ${data.companyEmail} já está em uso`);
        throw new ConflictException('Já existe uma empresa com este email');
      }
    }

    
    // 3. VERIFICAR SE USUÁRIO JÁ EXISTE
    
    this.logger.log('🔍 Verificando se usuário já existe...');

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.userEmail },
    });

    if (existingUser) {
      this.logger.error(` Email de usuário ${data.userEmail} já está em uso`);
      throw new ConflictException('Este email já está em uso');
    }

    
    // 4. HASH DA PASSWORD
    
    this.logger.log('🔒 Gerando hash da password...');
    const hashedPassword = await bcrypt.hash(data.userPassword, 10);

    try {
      
      // 5. CRIAR EMPRESA E USUÁRIO (TRANSAÇÃO)
      
      this.logger.log('🔄 Iniciando transação...');
      const result = await this.prisma.$transaction(async (tx) => {
        this.logger.log('📍 DENTRO DA TRANSAÇÃO - iniciou');
        
        // 5.1 Criar a empresa
        this.logger.log(' Criando empresa...');
        const company = await tx.company.create({
          data: {
            name: data.companyName,
            nif: data.companyNif,
            email: data.companyEmail,
            phone: data.companyPhone || null,
            address: data.companyAddress || null,
            isActive: true,
          },
        });

        this.logger.log(` Empresa criada: ${company.id} - ${company.name}`);

        // 5.2 Criar o usuário ADMIN
        this.logger.log('👤 Criando usuário administrador...');
        const user = await tx.user.create({
          data: {
            name: data.userName,
            email: data.userEmail,
            password: hashedPassword,
            role: Role.ADMIN,
            companyId: company.id,
            isActive: true,
          },
        });

        this.logger.log(` Usuário criado: ${user.id} - ${user.name} (ADMIN)`);
        this.logger.log(`   Email armazenado: ${user.email}`);
        this.logger.log(`   isActive: ${user.isActive}`);

        // 5.3 Criar Configurations padrão
        this.logger.log('⚙️ Criando Configurations padrão...');
        await tx.settings.create({
          data: {
            companyId: company.id,
            taxRate: 0.23, // IVA padrão PT
          },
        });

        this.logger.log(' Configurations criadas');
        this.logger.log('📍 DENTRO DA TRANSAÇÃO - finalizando...');

        return { company, user };
      });
      
      this.logger.log('📍 TRANSAÇÃO CONCLUÍDA COM SUCESSO');

      
      // 6. VERIFICAR QUE O USUÁRIO FOI CRIADO
      
      this.logger.log('🔍 Verificando se usuário foi realmente criado no banco...');
      const userInDb = await this.prisma.user.findUnique({
        where: { email: result.user.email },
      });
      
      if (!userInDb) {
        this.logger.error(' CRÍTICO: Usuário NÃO foi encontrado no banco após transação!');
        this.logger.error(` Email procurado: ${result.user.email}`);
        throw new InternalServerErrorException('Falha na verificação: usuário não foi criado');
      }
      
      this.logger.log(' Verificação OK - usuário existe no banco de dados');

      
      // 7. GERAR TOKENS JWT
      
      this.logger.log('🔑 Gerando tokens JWT...');
      const tokens = await this.generateTokens(
        result.user.id,
        result.user.email,
        result.user.role,
      );

      this.logger.log(' Tokens gerados com sucesso');
      this.logger.log(' REGISTRO COMPLETO!');
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      
      // 8. RETORNAR RESPOSTA
      
      const responseData = {
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          companyId: result.user.companyId,
          companyName: result.company.name,
          isActive: result.user.isActive,
        },
      };
      
      this.logger.log('📤 Respondendo ao cliente com:');
      this.logger.log(`   - Token: ${tokens.token.substring(0, 20)}...`);
      this.logger.log(`   - User Email: ${responseData.user.email}`);
      this.logger.log(`   - User ID: ${responseData.user.id}`);
      this.logger.log(`   - Company ID: ${responseData.user.companyId}`);
      
      return responseData;
    } catch (error) {
      this.logger.error(' Erro ao criar empresa e usuário:', error.message);
      this.logger.error(error.stack);
      throw new InternalServerErrorException(
        'Erro ao processar registro. Tente novamente.',
      );
    }
  }

  
  // MÉTODO AUXILIAR: GERAR TOKENS
  
  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { 
      sub: userId, 
      email, 
      role 
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'default-secret-key',
      expiresIn: '7d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'default-secret-key',
      expiresIn: '30d',
    });

    return { token, refreshToken };
  }
}