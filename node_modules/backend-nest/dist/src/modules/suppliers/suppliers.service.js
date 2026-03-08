"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SuppliersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let SuppliersService = SuppliersService_1 = class SuppliersService {
    prisma;
    logger = new common_1.Logger(SuppliersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSupplierDto, companyId) {
        try {
            this.logger.log(`📝 Criando fornecedor para company: ${companyId}`);
            const existing = await this.prisma.supplier.findFirst({
                where: {
                    nif: createSupplierDto.nif,
                    companyId,
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Já existe um fornecedor com este NIF');
            }
            const supplier = await this.prisma.supplier.create({
                data: {
                    name: createSupplierDto.name,
                    nif: createSupplierDto.nif,
                    email: createSupplierDto.email || null,
                    phone: createSupplierDto.phone || null,
                    address: createSupplierDto.address || null,
                    city: createSupplierDto.city || null,
                    state: createSupplierDto.state || null,
                    companyId,
                },
            });
            this.logger.log(` Fornecedor criado: ${supplier.name} (${supplier.id})`);
            return this.serialize(supplier);
        }
        catch (error) {
            this.logger.error(' Erro ao criar fornecedor:', error.message);
            throw error;
        }
    }
    async findAll(companyId, search) {
        try {
            this.logger.log(`🔍 [SERVICE] Buscando fornecedores`);
            this.logger.log(`🔍 [SERVICE] CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
            const where = {};
            if (companyId) {
                where.companyId = companyId;
            }
            if (search?.trim()) {
                const s = search.trim();
                where.OR = [
                    { name: { contains: s, mode: 'insensitive' } },
                    { nif: { contains: s, mode: 'insensitive' } },
                ];
            }
            const suppliers = await this.prisma.supplier.findMany({
                where,
                orderBy: { name: 'asc' },
            });
            this.logger.log(` [SERVICE] Encontrados: ${suppliers.length} fornecedores`);
            return suppliers.map(s => this.serialize(s));
        }
        catch (error) {
            this.logger.error(` [SERVICE] ERRO ao buscar fornecedores: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Erro ao buscar fornecedores: ${error.message}`);
        }
    }
    serialize(supplier) {
        try {
            return {
                id: supplier.id || '',
                name: supplier.name || '',
                nif: supplier.nif || '',
                email: supplier.email || null,
                phone: supplier.phone || null,
                address: supplier.address || null,
                city: supplier.city || null,
                state: supplier.state || null,
                companyId: supplier.companyId || '',
                createdAt: supplier.createdAt
                    ? (supplier.createdAt instanceof Date ? supplier.createdAt.toISOString() : String(supplier.createdAt))
                    : new Date().toISOString(),
                updatedAt: supplier.updatedAt
                    ? (supplier.updatedAt instanceof Date ? supplier.updatedAt.toISOString() : String(supplier.updatedAt))
                    : new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(` Erro ao serializar fornecedor ${supplier?.id}: ${error.message}`);
            throw error;
        }
    }
    async findOne(id, companyId) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`🔍 Buscando fornecedor ${id}`);
        this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
        const where = { id };
        if (companyId) {
            where.companyId = companyId;
        }
        this.logger.log(`📝 Query where: ${JSON.stringify(where)}`);
        const supplier = await this.prisma.supplier.findFirst({ where });
        if (!supplier) {
            this.logger.error(` Fornecedor ${id} não encontrado`);
            throw new common_1.NotFoundException('Fornecedor não encontrado');
        }
        this.logger.log(` Fornecedor encontrado: ${supplier.name}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return this.serialize(supplier);
    }
    async findByVehicle(vehicleId, companyId) {
        this.logger.log(`🔍 Buscando fornecedores por veículo ${vehicleId}`);
        const where = {};
        if (companyId) {
            where.companyId = companyId;
        }
        const suppliers = await this.prisma.supplier.findMany({
            where,
            orderBy: { name: 'asc' },
        });
        return suppliers.map(s => this.serialize(s));
    }
    async findWithProducts(id, companyId) {
        this.logger.log(`🔍 Buscando fornecedor ${id} com produtos`);
        const supplier = await this.findOne(id, companyId);
        const where = { supplierId: id };
        if (companyId) {
            where.companyId = companyId;
        }
        const products = await this.prisma.product.findMany({ where });
        return { ...supplier, products };
    }
    async update(id, updateSupplierDto, companyId) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`📝 Atualizando fornecedor ${id}`);
        this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
        this.logger.log(`📋 DTO: ${JSON.stringify(updateSupplierDto)}`);
        const supplier = await this.findOne(id, companyId);
        this.logger.log(` Fornecedor encontrado para atualização: ${supplier.name}`);
        if (updateSupplierDto.nif && updateSupplierDto.nif !== supplier.nif) {
            this.logger.log(`🔍 Verificando se NIF ${updateSupplierDto.nif} já existe...`);
            const where = {
                nif: updateSupplierDto.nif,
                NOT: { id },
            };
            if (companyId) {
                where.companyId = companyId;
            }
            const existing = await this.prisma.supplier.findFirst({ where });
            if (existing) {
                this.logger.error(` NIF ${updateSupplierDto.nif} já existe`);
                throw new common_1.ConflictException('Já existe um fornecedor com este NIF');
            }
            this.logger.log(` NIF disponível`);
        }
        const updateData = {};
        if (updateSupplierDto.name !== undefined)
            updateData.name = updateSupplierDto.name;
        if (updateSupplierDto.nif !== undefined)
            updateData.nif = updateSupplierDto.nif;
        if (updateSupplierDto.email !== undefined)
            updateData.email = updateSupplierDto.email;
        if (updateSupplierDto.phone !== undefined)
            updateData.phone = updateSupplierDto.phone;
        if (updateSupplierDto.address !== undefined)
            updateData.address = updateSupplierDto.address;
        if (updateSupplierDto.city !== undefined)
            updateData.city = updateSupplierDto.city;
        if (updateSupplierDto.state !== undefined)
            updateData.state = updateSupplierDto.state;
        this.logger.log(`📝 Dados para atualização: ${JSON.stringify(updateData)}`);
        const updated = await this.prisma.supplier.update({
            where: { id },
            data: updateData,
        });
        this.logger.log(` Fornecedor ${id} atualizado com sucesso`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return this.serialize(updated);
    }
    async remove(id, companyId) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`🗑️ Tentando remover fornecedor ${id}`);
        this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
        try {
            const supplier = await this.findOne(id, companyId);
            this.logger.log(` Fornecedor encontrado: ${supplier.name}`);
            const advancedProducts = await this.prisma.product.findMany({
                where: {
                    supplierId: id,
                    status: {
                        notIn: [client_1.ProductStatus.RECEIVED]
                    }
                },
                select: {
                    internalCode: true,
                    description: true,
                    status: true
                },
                take: 5,
            });
            this.logger.log(`📦 Produtos com status avançado: ${advancedProducts.length}`);
            if (advancedProducts.length > 0) {
                this.logger.warn(`⚠️ BLOQUEADO - Fornecedor tem ${advancedProducts.length} produto(s) em estado avançado`);
                const productsList = advancedProducts
                    .map(p => `${p.internalCode} - ${p.description} (Status: ${p.status})`)
                    .join(', ');
                throw new common_1.ConflictException(` Não é possível eliminar este fornecedor pois tem produtos em estados avançados.\n\n` +
                    `📦 Produtos em processo (${advancedProducts.length}):\n${productsList}${advancedProducts.length > 5 ? '...' : ''}\n\n` +
                    `💡 Pode eliminar o fornecedor quando:\n` +
                    `  • Todos os produtos estiverem com status RECEIVED\n` +
                    `  • Eliminar ou transferir os produtos para outro fornecedor`);
            }
            const receivedProductsCount = await this.prisma.product.count({
                where: {
                    supplierId: id,
                    status: client_1.ProductStatus.RECEIVED
                },
            });
            this.logger.log(`📦 Produtos apenas recebidos: ${receivedProductsCount}`);
            if (receivedProductsCount > 0) {
                this.logger.log(`ℹ️ O fornecedor tem ${receivedProductsCount} produto(s) apenas recebido(s), mas pode ser eliminado`);
                this.logger.log(`🔄 Estes produtos poderão ser reassociados a outro fornecedor se necessário`);
            }
            else {
                this.logger.log(` Nenhum produto associado - prosseguindo com eliminação`);
            }
            await this.prisma.supplier.delete({
                where: { id },
            });
            this.logger.log(` Fornecedor "${supplier.name}" (${id}) eliminado com sucesso`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            return {
                message: ` Fornecedor "${supplier.name}" eliminado com sucesso`,
                ...(receivedProductsCount > 0 && {
                    warning: `ℹ️ Existiam ${receivedProductsCount} produto(s) apenas recebido(s) que foram desassociados`
                })
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(` Erro inesperado ao eliminar fornecedor ${id}`);
            this.logger.error(`Mensagem: ${error.message}`);
            this.logger.error(`Stack: ${error.stack}`);
            throw new common_1.InternalServerErrorException(`Erro ao eliminar fornecedor: ${error.message}`);
        }
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = SuppliersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map