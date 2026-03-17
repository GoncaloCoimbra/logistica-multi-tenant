// src/modules/vehicles/vehicles.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { VehicleStatus, TransportStatus } from '@prisma/client';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(private prisma: PrismaService) {}

  async create(date: any, companyId: string) {
    try {
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      this.logger.log(`📝 Creating vehicle for company: ${companyId}`);
      this.logger.log(`📋 Received date: ${JSON.stringify(date)}`);

      // Validate campos obrigatórios
      if (!date.licensePlate) {
        throw new BadRequestException('License plate is required');
      }
      if (!date.model) {
        throw new BadRequestException('Model is required');
      }
      if (!date.brand) {
        throw new BadRequestException('Brand is required');
      }
      if (!date.type) {
        throw new BadRequestException('Type is required');
      }
      if (!date.capacity && date.capacity !== 0) {
        throw new BadRequestException('Capacity is required');
      }
      if (!date.year) {
        throw new BadRequestException('Year is required');
      }

      // Normalizar matrícula (remove espaços, converter para maiúsculas)
      const normalizedPlate = date.licensePlate.trim().toUpperCase();
      this.logger.log(`🔤 License plate normalized: ${normalizedPlate}`);

      // Check se matrícula already exists
      const existing = await this.prisma.vehicle.findFirst({
        where: {
          licensePlate: normalizedPlate,
          companyId,
        },
      });

      if (existing) {
        this.logger.error(` License plate ${normalizedPlate} already exists`);
        throw new ConflictException(
          'A vehicle with this license plate already exists',
        );
      }

      // Converter e validate números
      let capacity: number;
      let year: number;

      try {
        capacity = Number(date.capacity);
        if (isNaN(capacity) || capacity < 0) {
          throw new Error('Invalid capacity');
        }
      } catch (error) {
        this.logger.error(`❌ Invalid capacity: ${date.capacity}`);
        throw new BadRequestException(
          'Capacity must be a valid number greater than or equal to 0',
        );
      }

      try {
        year = Number(date.year);
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
          throw new Error('Invalid year');
        }
      } catch (error) {
        this.logger.error(`❌ Invalid year: ${date.year}`);
        throw new BadRequestException(
          `Year must be between 1900 and ${new Date().getFullYear() + 1}`,
        );
      }

      // Validate and normalize status
      let status = VehicleStatus.available;
      if (date.status) {
        const validStatuses = Object.values(VehicleStatus);
        if (!validStatuses.includes(date.status)) {
          this.logger.error(`❌ Invalid status: ${date.status}`);
          throw new BadRequestException(
            `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
          );
        }
        status = date.status;
      }

      // Preparar dados para criação
      const vehicleData = {
        licensePlate: normalizedPlate,
        model: date.model.trim(),
        brand: date.brand.trim(),
        type: date.type.trim(),
        capacity,
        year,
        status,
        companyId,
      };

      this.logger.log(
        `📝 Formatted date for creation: ${JSON.stringify(vehicleData)}`,
      );

      // Create vehicle
      const vehicle = await this.prisma.vehicle.create({ data: vehicleData,
        include: {
          company: true,
        },
      });

      this.logger.log(
        `✓ Vehicle created successfully: ${vehicle.licensePlate} (${vehicle.id})`,
      );
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      return vehicle;
    } catch (error) {
      this.logger.error(`❌ ERROR creating vehicle: ${error.message}`);
      this.logger.error(`Stack: ${error.stack}`);
      throw error;
    }
  }

  async findAll(
    companyId?: string,
    filters?: {
      status?: VehicleStatus;
      type?: string;
    },
  ) {
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
    this.logger.log(`🔍 Searching for vehicle ${id}`);
    this.logger.log(`🏢 CompanyId: ${companyId || 'ALL (SUPER_ADMIN)'}`);

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
      this.logger.error(`❌ Vehicle ${id} not found`);
      throw new NotFoundException('Vehicle not found');
    }

    this.logger.log(`✓ Vehicle found: ${vehicle.licensePlate}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return vehicle;
  }

  async update(id: string, data: any, companyId?: string) {
    try {
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      this.logger.log(`📝 Updating vehicle ${id}`);
      this.logger.log(`🏢 CompanyId: ${companyId || 'ALL (SUPER_ADMIN)'}`);
      this.logger.log(`📋 Date received: ${JSON.stringify(date)}`);

      // Find the vehicle
      const vehicle = await this.findOne(id, companyId);
      this.logger.log(`✓ Vehicle found: ${vehicle.licensePlate}`);

      // Prepare update date
      const updateData: any = {};

      // Update license plate if provided
      if (date.licensePlate) {
        const normalizedPlate = date.licensePlate.trim().toUpperCase();

        // Check if different from current
        if (normalizedPlate !== vehicle.licensePlate) {
          this.logger.log(
            `🔍 Checking if license plate ${normalizedPlate} already exists...`,
          );

          const where: any = {
            licensePlate: normalizedPlate,
            NOT: { id },
          };

          if (companyId) {
            where.companyId = companyId;
          }

          const existing = await this.prisma.vehicle.findFirst({ where });

          if (existing) {
            this.logger.error(
              ` License plate ${normalizedPlate} already exists`,
            );
            throw new ConflictException('Matrícula already exists');
          }

          this.logger.log(` License plate disponível`);
          updateData.licensePlate = normalizedPlate;
        }
      }

      // Update outros campos
      if (date.model) updateData.model = date.model.trim();
      if (date.brand) updateData.brand = date.brand.trim();
      if (date.type) updateData.type = date.type.trim();

      // Converter números
      if (date.capacity !== undefined) {
        const capacity = Number(date.capacity);
        if (isNaN(capacity) || capacity < 0) {
          throw new BadRequestException(
            'Capacity must be a valid number greater than or equal to 0',
          );
        }
        updateData.capacity = capacity;
      }

      if (date.year !== undefined) {
        const year = Number(date.year);
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
          throw new BadRequestException(
            `Year deve ser entre 1900 e ${new Date().getFullYear() + 1}`,
          );
        }
        updateData.year = year;
      }

      // Validate status
      if (date.status) {
        const validStatuses = Object.values(VehicleStatus);
        if (!validStatuses.includes(date.status)) {
          throw new BadRequestException(
            `Invalid status. Valores permitidos: ${validStatuses.join(', ')}`,
          );
        }
        updateData.status = date.status;
      }

      this.logger.log(
        `📝 Dados para atualização: ${JSON.stringify(updateData)}`,
      );

      // Update veículo
      const updated = await this.prisma.vehicle.update({
        where: { id }, data: updateData,
        include: {
          company: true,
        },
      });

      this.logger.log(` Veículo ${id} atualizado com success`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      return updated;
    } catch (error) {
      this.logger.error(` ERRO ao update veículo: ${error.message}`);
      throw error;
    }
  }

  async updateStatus(id: string, status: VehicleStatus, companyId?: string) {
    await this.findOne(id, companyId);

    const validStatuses = Object.values(VehicleStatus);

    if (!validStatuses.includes(status)) {
      throw new ConflictException(
        `Invalid status. Valores permitidos: ${validStatuses.join(', ')}`,
      );
    }

    return this.prisma.vehicle.update({
      where: { id }, data: { status },
      include: {
        company: true,
      },
    });
  }

  async remove(id: string, companyId?: string) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`🗑️ Tentando remove veículo ${id}`);
    this.logger.log(`🏢 CompanyId: ${companyId || 'ALL (SUPER_ADMIN)'}`);

    try {
      // 1️⃣ Busca o veículo
      const vehicle = await this.findOne(id, companyId);
      this.logger.log(` Veículo encontrado: ${vehicle.licensePlate}`);

      // 2️⃣ Verifica transportes ATIVOS (PENDING ou IN_TRANSIT)
      const activeTransports = await this.prisma.transport.findMany({
        where: {
          vehicleId: id,
          status: {
            in: [TransportStatus.PENDING, TransportStatus.IN_TRANSIT],
          },
        },
        select: {
          internalCode: true,
          origin: true,
          destination: true,
          status: true,
        },
        take: 5,
      });

      this.logger.log(`🚛 Transportes ATIVOS: ${activeTransports.length}`);

      // ⚠️ SE TIVER TRANSPORTES ATIVOS → NÃO PODE ELIMINAR
      if (activeTransports.length > 0) {
        this.logger.warn(
          `⚠️ BLOQUEADO - Veículo tem ${activeTransports.length} transport(s) active(s)`,
        );

        const transportsList = activeTransports
          .map(
            (t) =>
              `${t.internalCode} (${t.origin} → ${t.destination}) - Status: ${t.status}`,
          )
          .join(', ');

        throw new ConflictException(
          ` This vehicle cannot be deleted as it is being used in active transport(s).\n\n` +
            `📦 Active transports (${activeTransports.length}):\n${transportsList}${activeTransports.length > 5 ? '...' : ''}\n\n` +
            `💡 Pode delete o veículo quando:\n` +
            `  • Finalizar ou cancelar estes transportes\n` +
            `  • Atribuir outro veículo a estes transportes`,
        );
      }

      // 3️⃣ Verifica se tem transportes finalizados (DELIVERED ou CANCELED)
      const finishedTransportsCount = await this.prisma.transport.count({
        where: {
          vehicleId: id,
          status: {
            in: [TransportStatus.DELIVERED, TransportStatus.CANCELED],
          },
        },
      });

      this.logger.log(` Transportes finalizados: ${finishedTransportsCount}`);

      //  SE NÃO TIVER TRANSPORTES ATIVOS → PODE ELIMINAR
      if (finishedTransportsCount > 0) {
        this.logger.log(
          `ℹ️ O veículo tem ${finishedTransportsCount} transport(s) finalizado(s), mas pode ser eliminado`,
        );
      } else {
        this.logger.log(` No associated transport - proceeding with deletion`);
      }

      // 4️⃣ Delete o veículo
      await this.prisma.vehicle.delete({
        where: { id },
      });

      this.logger.log(
        ` Vehicle "${vehicle.licensePlate}" (${id}) eliminado com success`,
      );
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      return {
        message: ` Vehicle "${vehicle.licensePlate}" deleted successfully`,
        finishedTransports: finishedTransportsCount,
      };
    } catch (error) {
      // Se já é uma exceção conhecida, propaga
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Log de error inesperado
      this.logger.error(` Error inesperado ao delete veículo ${id}`);
      this.logger.error(`Mensagem: ${error.message}`);
      this.logger.error(`Stack: ${error.stack}`);

      throw new InternalServerErrorException(
        `Error ao delete veículo: ${error.message}`,
      );
    }
  }

  async getStats(companyId?: string) {
    const where: any = {};

    if (companyId) {
      where.companyId = companyId;
    }

    const [total, available, inUse, inMaintenance, retired] = await Promise.all(
      [
        this.prisma.vehicle.count({ where }),
        this.prisma.vehicle.count({
          where: { ...where, status: VehicleStatus.available },
        }),
        this.prisma.vehicle.count({
          where: { ...where, status: VehicleStatus.in_use },
        }),
        this.prisma.vehicle.count({
          where: { ...where, status: VehicleStatus.in_maintenance },
        }),
        this.prisma.vehicle.count({
          where: { ...where, status: VehicleStatus.retired },
        }),
      ],
    );

    return {
      total,
      available,
      inUse,
      inMaintenance,
      retired,
    };
  }
}
