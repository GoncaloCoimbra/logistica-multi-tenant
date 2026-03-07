// src/modules/suppliers/controllers/suppliers.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  Logger,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SuppliersService } from '../suppliers.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { TenantGuard } from '../../auth/guards/tenant.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Suppliers')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@ApiBearerAuth()
export class SuppliersController {
  private readonly logger = new Logger(SuppliersController.name);

  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Criar novo fornecedor' })
  async create(@Body() createSupplierDto: CreateSupplierDto, @Request() req) {
    try {
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      this.logger.log(`📥 POST /suppliers`);
      this.logger.log(`👤 User: ${req.user?.email} (${req.user?.role})`);
      this.logger.log(`🏢 CompanyId: ${req.user?.companyId || 'SUPER_ADMIN - sem empresa'}`);
      
      const companyId = createSupplierDto.companyId || req.user.companyId;
      
      if (!companyId) {
        this.logger.error(' CompanyId não encontrado');
        throw new HttpException('CompanyId obrigatório', HttpStatus.BAD_REQUEST);
      }
      
      const result = await this.suppliersService.create(createSupplierDto, companyId);
      this.logger.log(` Fornecedor criado: ${result.id}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return result;
    } catch (error) {
      this.logger.error(` Erro ao criar fornecedor:`, error.message);
      throw error;
    }
  }

  @Get()
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Listar todos os fornecedores' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome ou NIF' })
  @ApiQuery({ name: 'companyId', required: false, description: 'Filtrar por empresa (SUPER_ADMIN)' })
  async findAll(
    @Request() req,
    @Query('search') search?: string,
    @Query('companyId') queryCompanyId?: string,
  ) {
    try {
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      this.logger.log(`📥 GET /suppliers`);
      this.logger.log(`👤 User: ${req.user?.email} (${req.user?.role})`);
      this.logger.log(`🔍 Search: ${search || 'none'}`);
      
      const companyId = req.user.role === Role.SUPER_ADMIN 
        ? queryCompanyId 
        : req.user.companyId;
      
      if (!companyId && req.user.role !== Role.SUPER_ADMIN) {
        this.logger.error(' CompanyId não encontrado no user');
        throw new HttpException('CompanyId não encontrado', HttpStatus.BAD_REQUEST);
      }
      
      this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
      
      const result = await this.suppliersService.findAll(companyId, search);
      
      this.logger.log(` ${result?.length || 0} fornecedores retornados`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      
      return result;
      
    } catch (error) {
      this.logger.error(` ERRO no GET /suppliers`);
      this.logger.error(`Message: ${error.message}`);
      throw error;
    }
  }

  @Get('by-vehicle/:vehicleId')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Buscar fornecedores por veículo' })
  findByVehicle(@Param('vehicleId') vehicleId: string, @Request() req) {
    this.logger.log(`📥 GET /suppliers/by-vehicle/${vehicleId}`);
    
    const companyId = req.user.role === Role.SUPER_ADMIN 
      ? undefined 
      : req.user.companyId;
    
    return this.suppliersService.findByVehicle(vehicleId, companyId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obter fornecedor por ID' })
  findOne(@Param('id') id: string, @Request() req) {
    this.logger.log(`📥 GET /suppliers/${id}`);
    
    const companyId = req.user.role === Role.SUPER_ADMIN 
      ? undefined 
      : req.user.companyId;
    
    return this.suppliersService.findOne(id, companyId);
  }

  @Get(':id/products')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obter fornecedor com produtos' })
  findWithProducts(@Param('id') id: string, @Request() req) {
    this.logger.log(`📥 GET /suppliers/${id}/products`);
    
    const companyId = req.user.role === Role.SUPER_ADMIN 
      ? undefined 
      : req.user.companyId;
    
    return this.suppliersService.findWithProducts(id, companyId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Atualizar fornecedor' })
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Request() req,
  ) {
    this.logger.log(`📥 PATCH /suppliers/${id}`);
    
    const companyId = req.user.role === Role.SUPER_ADMIN 
      ? undefined 
      : req.user.companyId;
    
    return this.suppliersService.update(id, updateSupplierDto, companyId);
  }

  //  CORRIGIDO: Adicionado Role.OPERATOR
  @Delete(':id')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Eliminar fornecedor' })
  remove(@Param('id') id: string, @Request() req) {
    this.logger.log(`🗑️ DELETE /suppliers/${id}`);
    this.logger.log(`👤 User: ${req.user.email} (${req.user.role})`);
    
    const companyId = req.user.role === Role.SUPER_ADMIN 
      ? undefined 
      : req.user.companyId;
    
    return this.suppliersService.remove(id, companyId);
  }
}