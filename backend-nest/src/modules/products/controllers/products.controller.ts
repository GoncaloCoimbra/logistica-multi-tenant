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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from '../products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FilterProductDto } from '../dto/filter-product.dto';
import { UpdateProductStatusDto } from '../dto/update-product-status.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { TenantGuard } from '../../auth/guards/tenant.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Criar novo produto' })
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
    console.log('🔍 [CONTROLLER] Body recebido:', createProductDto);
    console.log('🔍 [CONTROLLER] User:', { id: user.id, companyId: user.companyId });
    
    return this.productsService.create(createProductDto, user.companyId, user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Listar todos os produtos' })
  findAll(@CurrentUser() user: any, @Query() filters: FilterProductDto) {
    return this.productsService.findAll(user.companyId, filters);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Estatísticas por estado' })
  getStats(@CurrentUser() user: any) {
    return this.productsService.getStatsByStatus(user.companyId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Obter produto por ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.findOne(id, user.companyId);
  }

  @Get(':id/movements')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Obter histórico de movimentos' })
  findWithMovements(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.findWithMovements(id, user.companyId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Atualizar produto' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: any,
  ) {
    return this.productsService.update(id, updateProductDto, user.companyId, user.id);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Atualizar estado do produto' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateProductStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.productsService.updateStatus(id, updateStatusDto, user.companyId, user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar produto' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.remove(id, user.companyId, user.id);
  }
}