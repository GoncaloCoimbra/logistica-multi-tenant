import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from '../companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { TenantGuard } from '../../auth/guards/tenant.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

/**
 * 🏢 COMPANIES CONTROLLER
 * 
 * Rotas para gestão de empresas:
 * - SUPER_ADMIN: Acesso total a todas as rotas (NÃO USA TenantGuard)
 * - ADMIN: Acesso limitado apenas à SUA empresa (USA TenantGuard)
 * - PUBLIC: Endpoint /companies/public para registro de operadores
 */
@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompaniesController {
  private readonly logger = new Logger(CompaniesController.name);

  constructor(private readonly companiesService: CompaniesService) {}

  /**
   * 🌍 GET /companies/public
   * ROTA PÚBLICA - Para operadores escolherem empresa durante registro
   * Retorna apenas: id, name, nif (sem dados sensíveis)
   */
  @Public()
  @Get('public')
  @ApiOperation({ 
    summary: 'Listar empresas ativas (público - para registro)',
    description: 'Endpoint público que retorna lista básica de empresas para seleção durante registro de operador'
  })
  async findPublic() {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`🌍 GET /companies/public (PÚBLICO)`);

    const companies = await this.companiesService.findAll();
    
    // Filtrar apenas empresas ativas e retornar dados básicos
    const publicCompanies = companies
      .filter(company => company.isActive)
      .map(company => ({
        id: company.id,
        name: company.name,
        nif: company.nif,
      }));

    this.logger.log(`✅ ${publicCompanies.length} empresas ativas retornadas (público)`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return publicCompanies;
  }

  /**
   * ➕ POST /companies
   * Criar nova empresa (APENAS SUPER_ADMIN)
   */
  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Criar nova empresa (SUPER_ADMIN)' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`➕ POST /companies`);
    this.logger.log(`📝 Dados: ${JSON.stringify(createCompanyDto)}`);
    
    const result = this.companiesService.create(createCompanyDto);
    
    this.logger.log(`✅ Empresa criada com sucesso`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    return result;
  }

  /**
   * 📋 GET /companies
   * Listar empresas:
   * - SUPER_ADMIN: Todas as empresas
   * - ADMIN: Apenas a sua empresa
   */
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard) // 🔒 Filtra automaticamente por empresa para ADMIN
  @ApiOperation({ summary: 'Listar empresas' })
  async findAll(@Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`📋 GET /companies - User: ${req.user.email} (${req.user.role})`);

    // SUPER_ADMIN vê todas
    if (req.user.role === Role.SUPER_ADMIN) {
      this.logger.log(`🌍 SUPER_ADMIN - Retornando TODAS as empresas`);
      const companies = await this.companiesService.findAll();
      this.logger.log(`✅ ${companies.length} empresas retornadas`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return companies;
    }

    // ADMIN vê apenas a sua
    if (!req.user.companyId) {
      this.logger.error(`❌ ADMIN sem companyId`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Utilizador sem empresa associada');
    }

    this.logger.log(`🏢 ADMIN - Retornando apenas empresa: ${req.user.companyId}`);
    const company = await this.companiesService.findOne(req.user.companyId);
    this.logger.log(`✅ Empresa retornada: ${company.name}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    return [company]; // Retorna como array para consistência
  }

  /**
   * 🔍 GET /companies/:id
   * Obter empresa por ID:
   * - SUPER_ADMIN: Qualquer empresa
   * - ADMIN: Apenas a sua empresa
   */
  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard) // 🔒 Valida se ADMIN está acessando sua própria empresa
  @ApiOperation({ summary: 'Obter empresa por ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`🔍 GET /companies/${id} - User: ${req.user.email} (${req.user.role})`);

    // ADMIN só pode ver a sua empresa
    if (req.user.role === Role.ADMIN && req.user.companyId !== id) {
      this.logger.error(`❌ ADMIN ${req.user.email} tentou aceder empresa ${id}`);
      this.logger.error(`   🏢 Empresa do ADMIN: ${req.user.companyId}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Não pode aceder dados de outra empresa');
    }

    const company = await this.companiesService.findOne(id);
    
    this.logger.log(`✅ Empresa retornada: ${company.name}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    return company;
  }

  /**
   * ℹ️ GET /companies/info
   * Obter informações da empresa do utilizador atual (ADMIN apenas)
   */
  @Get('info')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obter informações da empresa atual (ADMIN)' })
  async getCompanyInfo(@Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`ℹ️ GET /companies/info - User: ${req.user.email} (${req.user.role})`);

    if (!req.user.companyId) {
      this.logger.error(`❌ ADMIN sem companyId`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Utilizador sem empresa associada');
    }

    const company = await this.companiesService.findOne(req.user.companyId);
    
    this.logger.log(`✅ Informações da empresa retornadas: ${company.name}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    return company;
  }

  /**
   * 👥 GET /companies/:id/users
   * Obter utilizadores da empresa:
   * - SUPER_ADMIN: Utilizadores de qualquer empresa
   * - ADMIN: Apenas utilizadores da sua empresa
   */
  @Get(':id/users')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Obter empresa com utilizadores' })
  async findWithUsers(@Param('id') id: string, @Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`👥 GET /companies/${id}/users - User: ${req.user.email}`);

    // ADMIN só pode ver utilizadores da sua empresa
    if (req.user.role === Role.ADMIN && req.user.companyId !== id) {
      this.logger.error(`❌ ADMIN tentou aceder utilizadores de empresa ${id}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Não pode aceder dados de outra empresa');
    }

    const company = await this.companiesService.findWithUsers(id);
    
    this.logger.log(`✅ ${company.users?.length || 0} utilizadores retornados`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    return company;
  }

  /**
   * 📊 GET /companies/:id/stats
   * Obter estatísticas da empresa:
   * - SUPER_ADMIN: Stats de qualquer empresa
   * - ADMIN: Apenas stats da sua empresa
   */
  @Get(':id/stats')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Obter estatísticas da empresa' })
  async findWithStats(@Param('id') id: string, @Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`📊 GET /companies/${id}/stats - User: ${req.user.email}`);

    // ADMIN só pode ver stats da sua empresa
    if (req.user.role === Role.ADMIN && req.user.companyId !== id) {
      this.logger.error(`❌ ADMIN tentou aceder stats de empresa ${id}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Não pode aceder dados de outra empresa');
    }

    const stats = await this.companiesService.findWithStats(id);
    
    this.logger.log(`✅ Stats retornadas`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    return stats;
  }

  /**
   * 🔄 PATCH /companies/:id
   * Atualizar empresa:
   * - SUPER_ADMIN: Pode atualizar qualquer empresa
   * - ADMIN: Pode atualizar apenas a sua empresa
   */
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Atualizar empresa' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req,
  ) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`🔄 PATCH /companies/${id} - User: ${req.user.email}`);
    this.logger.log(`📝 Dados: ${JSON.stringify(updateCompanyDto)}`);

    // ADMIN só pode atualizar a sua empresa
    if (req.user.role === Role.ADMIN && req.user.companyId !== id) {
      this.logger.error(`❌ ADMIN tentou atualizar empresa ${id}`);
      this.logger.error(`   🏢 Empresa do ADMIN: ${req.user.companyId}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Não pode atualizar outra empresa');
    }

    const updated = await this.companiesService.update(id, updateCompanyDto);
    
    this.logger.log(`✅ Empresa atualizada: ${updated.name}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    return updated;
  }

  /**
   * 🗑️ DELETE /companies/:id
   * Eliminar empresa (APENAS SUPER_ADMIN)
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Eliminar empresa (SUPER_ADMIN)' })
  async remove(@Param('id') id: string) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`🗑️ DELETE /companies/${id}`);

    await this.companiesService.remove(id);

    this.logger.log(`✅ Empresa eliminada com sucesso`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return { message: 'Empresa eliminada com sucesso' };
  }
}