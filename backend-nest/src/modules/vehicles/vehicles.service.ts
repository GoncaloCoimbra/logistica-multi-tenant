// src/modules/vehicles/vehicles.service.ts

import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  Logger, 
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { VehicleStatus, TransportStatus } from '@prisma/client';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: any, companyId: string) {
    try {
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      this.logger.log(`📝 Criando veículo para company: ${companyId}`);
      this.logger.log(`📋 Dados recebidos: ${JSON.stringify(data)}`);

      // Validar campos obrigatórios
      if (!data.licensePlate) {
        throw new BadRequestException('Matrícula é obrigatória');
      }
      if (!data.model) {
        throw new BadRequestException('Modelo é obrigatório');
      }
      if (!data.brand) {
        throw new BadRequestException('Marca é obrigatória');
      }
      if (!data.type) {
        throw new BadRequestException('Tipo é obrigatório');
      }
      if (!data.capacity && data.capacity !== 0) {
        throw new BadRequestException('Capacidade é obrigatória');
      }
      if (!data.year) {
        throw new BadRequestException('Ano é obrigatório');
      }

      // Normalizar matrícula (remover espaços, converter para maiúsculas)
      const normalizedPlate = data.licensePlate.trim().toUpperCase();
      this.logger.log(`🔤 Matrícula normalizada: ${normalizedPlate}`);

      // Verificar se matrícula já existe
      const existing = await this.prisma.vehicle.findFirst({
        where: {
          licensePlate: normalizedPlate,
          companyId,
        },
      });

      if (existing) {
        this.logger.error(` Matrícula ${normalizedPlate} já existe`);
        throw new ConflictException('Já existe um veículo com esta matrícula');
      }

      // Converter e validar números
      let capacity: number;
      let year: number;

      try {
        capacity = Number(data.capacity);
        if (isNaN(capacity) || capacity < 0) {
          throw new Error('Capacidade inválida');
        }
      } catch (error) {
        this.logger.error(` Capacidade inválida: ${data.capacity}`);
        throw new BadRequestException('Capacidade deve ser um número válido maior ou igual a 0');
      }

      try {
        year = Number(data.year);
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
          throw new Error('Ano inválido');
        }
      } catch (error) {
        this.logger.error(` Ano inválido: ${data.year}`);
        throw new BadRequestException(`Ano deve ser entre 1900 e ${new Date().getFullYear() + 1}`);
      }

      // Validar e normalizar status
      let status = VehicleStatus.available;
      if (data.status) {
        const validStatuses = Object.values(VehicleStatus);
        if (!validStatuses.includes(data.status)) {
          this.logger.error(` Status inválido: ${data.status}`);
          throw new BadRequestException(
            `Status inválido. Valores permitidos: ${validStatuses.join(', ')}`
          );
        }
        status = data.status;
      }

      // Preparar dados para criação
      const vehicleData = {
        licensePlate: normalizedPlate,
        model: data.model.trim(),
        brand: data.brand.trim(),
        type: data.type.trim(),
        capacity,
        year,
        status,
        companyId,
      };

      this.logger.log(`📝 Dados formatados para criação: ${JSON.stringify(vehicleData)}`);

      // Criar veículo
      const vehicle = await this.prisma.vehicle.create({
        data: vehicleData,
        include: {
          company: true,
        },
      });

      this.logger.log(` Veículo criado com sucesso: ${vehicle.licensePlate} (${vehicle.id})`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      return vehicle;

    } catch (error) {
      this.logger.error(` ERRO ao criar veículo: ${error.message}`);
      this.logger.error(`Stack: ${error.stack}`);
      throw error;
    }
  }

  async findAll(companyId?: string, filters?: {
    status?: VehicleStatus;
    type?: string;
  }) {
    const where: any = {};

    if (companyId) {
      where.companyId = companyId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    return this.prisma.vehicle.findMany({
      where,
      include: {
        company: true,
        transports: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAvailable(companyId?: string) {
    const where: any = {
      status: VehicleStatus.available,
    };

    if (companyId) {
      where.companyId = companyId;
    }

    return this.prisma.vehicle.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: { licensePlate: 'asc' },
    });
  }

  async findOne(id: string, companyId?: string) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`🔍 Buscando veículo ${id}`);
    this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
    
    const where: any = { id };
    
    if (companyId) {
      where.companyId = companyId;
    }

    this.logger.log(`📝 Query where: ${JSON.stringify(where)}`);

    const vehicle = await this.prisma.vehicle.findFirst({
      where,
      include: {
        company: true,
        transports: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!vehicle) {
      this.logger.error(` Veículo ${id} não encontrado`);
      throw new NotFoundException('Veículo não encontrado');
    }

    this.logger.log(` Veículo encontrado: ${vehicle.licensePlate}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return vehicle;
  }

  async update(id: string, data: any, companyId?: string) {
    try {
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      this.logger.log(`📝 Atualizando veículo ${id}`);
      this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
      this.logger.log(`📋 Dados recebidos: ${JSON.stringify(data)}`);

      // Busca o veículo
      const vehicle = await this.findOne(id, companyId);
      this.logger.log(` Veículo encontrado: ${vehicle.licensePlate}`);

      // Preparar dados de atualização
      const updateData: any = {};

      // Atualizar matrícula se fornecida
      if (data.licensePlate) {
        const normalizedPlate = data.licensePlate.trim().toUpperCase();
        
        // Verificar se é diferente da atual
        if (normalizedPlate !== vehicle.licensePlate) {
          this.logger.log(`🔍 Verificando se matrícula ${normalizedPlate} já existe...`);
          
          const where: any = {
            licensePlate: normalizedPlate,
            NOT: { id },
          };
          
          if (companyId) {
            where.companyId = companyId;
          }

          const existing = await this.prisma.vehicle.findFirst({ where });

          if (existing) {
            this.logger.error(` Matrícula ${normalizedPlate} já existe`);
            throw new ConflictException('Matrícula já existe');
          }
          
          this.logger.log(` Matrícula disponível`);
          updateData.licensePlate = normalizedPlate;
        }
      }

      // Atualizar outros campos
      if (data.model) updateData.model = data.model.trim();
      if (data.brand) updateData.brand = data.brand.trim();
      if (data.type) updateData.type = data.type.trim();
      
      // Converter números
      if (data.capacity !== undefined) {
        const capacity = Number(data.capacity);
        if (isNaN(capacity) || capacity < 0) {
          throw new BadRequestException('Capacidade deve ser um número válido maior ou igual a 0');
        }
        updateData.capacity = capacity;
      }
      
      if (data.year !== undefined) {
        const year = Number(data.year);
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
          throw new BadRequestException(`Ano deve ser entre 1900 e ${new Date().getFullYear() + 1}`);
        }
        updateData.year = year;
      }

      // Validar status
      if (data.status) {
        const validStatuses = Object.values(VehicleStatus);
        if (!validStatuses.includes(data.status)) {
          throw new BadRequestException(
            `Status inválido. Valores permitidos: ${validStatuses.join(', ')}`
          );
        }
        updateData.status = data.status;
      }

      this.logger.log(`📝 Dados para atualização: ${JSON.stringify(updateData)}`);

      // Atualizar veículo
      const updated = await this.prisma.vehicle.update({
        where: { id },
        data: updateData,
        include: {
          company: true,
        },
      });

      this.logger.log(` Veículo ${id} atualizado com sucesso`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      return updated;

    } catch (error) {
      this.logger.error(` ERRO ao atualizar veículo: ${error.message}`);
      throw error;
    }
  }

  async updateStatus(id: string, status: VehicleStatus, companyId?: string) {
    await this.findOne(id, companyId);

    const validStatuses = Object.values(VehicleStatus);
    
    if (!validStatuses.includes(status)) {
      throw new ConflictException(
        `Status inválido. Valores permitidos: ${validStatuses.join(', ')}`
      );
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: { status },
      include: {
        company: true,
      },
    });
  }

  async remove(id: string, companyId?: string) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`🗑️ Tentando remover veículo ${id}`);
    this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
    
    try {
      // 1️⃣ Busca o veículo
      const vehicle = await this.findOne(id, companyId);
      this.logger.log(` Veículo encontrado: ${vehicle.licensePlate}`);

      // 2️⃣ Verifica transportes ATIVOS (PENDING ou IN_TRANSIT)
      const activeTransports = await this.prisma.transport.findMany({
        where: { 
          vehicleId: id,
          status: {
            in: [TransportStatus.PENDING, TransportStatus.IN_TRANSIT]
          }
        },
        select: { 
          internalCode: true, 
          origin: true,
          destination: true,
          status: true
        },
        take: 5,
      });

      this.logger.log(`🚛 Transportes ATIVOS: ${activeTransports.length}`);

      // ⚠️ SE TIVER TRANSPORTES ATIVOS → NÃO PODE ELIMINAR
      if (activeTransports.length > 0) {
        this.logger.warn(`⚠️ BLOQUEADO - Veículo tem ${activeTransports.length} transporte(s) ativo(s)`);
        
        const transportsList = activeTransports
          .map(t => `${t.internalCode} (${t.origin} → ${t.destination}) - Status: ${t.status}`)
          .join(', ');

        throw new ConflictException(
          ` Não é possível eliminar este veículo pois está a ser usado em transporte(s) ativo(s).\n\n` +
          `📦 Transportes ativos (${activeTransports.length}):\n${transportsList}${activeTransports.length > 5 ? '...' : ''}\n\n` +
          `💡 Pode eliminar o veículo quando:\n` +
          `  • Finalizar ou cancelar estes transportes\n` +
          `  • Atribuir outro veículo a estes transportes`
        );
      }

      // 3️⃣ Verifica se tem transportes finalizados (DELIVERED ou CANCELED)
      const finishedTransportsCount = await this.prisma.transport.count({
        where: { 
          vehicleId: id,
          status: {
            in: [TransportStatus.DELIVERED, TransportStatus.CANCELED]
          }
        },
      });

      this.logger.log(` Transportes finalizados: ${finishedTransportsCount}`);

      //  SE NÃO TIVER TRANSPORTES ATIVOS → PODE ELIMINAR
      if (finishedTransportsCount > 0) {
        this.logger.log(`ℹ️ O veículo tem ${finishedTransportsCount} transporte(s) finalizado(s), mas pode ser eliminado`);
      } else {
        this.logger.log(` Nenhum transporte associado - prosseguindo com eliminação`);
      }

      // 4️⃣ Eliminar o veículo
      await this.prisma.vehicle.delete({
        where: { id },
      });

      this.logger.log(` Veículo "${vehicle.licensePlate}" (${id}) eliminado com sucesso`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      return { 
        message: ` Veículo "${vehicle.licensePlate}" eliminado com sucesso`,
        finishedTransports: finishedTransportsCount
      };

    } catch (error) {
      // Se já é uma exceção conhecida, propaga
      if (error instanceof NotFoundException || 
          error instanceof ConflictException || 
          error instanceof BadRequestException) {
        throw error;
      }

      // Log de erro inesperado
      this.logger.error(` Erro inesperado ao eliminar veículo ${id}`);
      this.logger.error(`Mensagem: ${error.message}`);
      this.logger.error(`Stack: ${error.stack}`);
      
      throw new InternalServerErrorException(
        `Erro ao eliminar veículo: ${error.message}`
      );
    }
  }

  async getStats(companyId?: string) {
    const where: any = {};
    
    if (companyId) {
      where.companyId = companyId;
    }

    const [total, available, inUse, inMaintenance, retired] = await Promise.all([
      this.prisma.vehicle.count({ where }),
      this.prisma.vehicle.count({ where: { ...where, status: VehicleStatus.available } }),
      this.prisma.vehicle.count({ where: { ...where, status: VehicleStatus.in_use } }),
      this.prisma.vehicle.count({ where: { ...where, status: VehicleStatus.in_maintenance } }),
      this.prisma.vehicle.count({ where: { ...where, status: VehicleStatus.retired } }),
    ]);

    return {
      total,
      available,
      inUse,
      inMaintenance,
      retired,
    };
  }
}