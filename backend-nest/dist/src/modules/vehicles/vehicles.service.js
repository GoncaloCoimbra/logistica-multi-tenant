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
var VehiclesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let VehiclesService = VehiclesService_1 = class VehiclesService {
    prisma;
    logger = new common_1.Logger(VehiclesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(date, companyId) {
        try {
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            this.logger.log(`📝 Creating vehicle for company: ${companyId}`);
            this.logger.log(`📋 Received date: ${JSON.stringify(date)}`);
            if (!date.licensePlate) {
                throw new common_1.BadRequestException('License plate is required');
            }
            if (!date.model) {
                throw new common_1.BadRequestException('Model is required');
            }
            if (!date.brand) {
                throw new common_1.BadRequestException('Brand is required');
            }
            if (!date.type) {
                throw new common_1.BadRequestException('Type is required');
            }
            if (!date.capacity && date.capacity !== 0) {
                throw new common_1.BadRequestException('Capacity is required');
            }
            if (!date.year) {
                throw new common_1.BadRequestException('Year is required');
            }
            const normalizedPlate = date.licensePlate.trim().toUpperCase();
            this.logger.log(`🔤 License plate normalized: ${normalizedPlate}`);
            const existing = await this.prisma.vehicle.findFirst({
                where: {
                    licensePlate: normalizedPlate,
                    companyId,
                },
            });
            if (existing) {
                this.logger.error(` License plate ${normalizedPlate} already exists`);
                throw new common_1.ConflictException('A vehicle with this license plate already exists');
            }
            let capacity;
            let year;
            try {
                capacity = Number(date.capacity);
                if (isNaN(capacity) || capacity < 0) {
                    throw new Error('Invalid capacity');
                }
            }
            catch (error) {
                this.logger.error(`❌ Invalid capacity: ${date.capacity}`);
                throw new common_1.BadRequestException('Capacity must be a valid number greater than or equal to 0');
            }
            try {
                year = Number(date.year);
                if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
                    throw new Error('Invalid year');
                }
            }
            catch (error) {
                this.logger.error(`❌ Invalid year: ${date.year}`);
                throw new common_1.BadRequestException(`Year must be between 1900 and ${new Date().getFullYear() + 1}`);
            }
            let status = client_1.VehicleStatus.available;
            if (date.status) {
                const validStatuses = Object.values(client_1.VehicleStatus);
                if (!validStatuses.includes(date.status)) {
                    this.logger.error(`❌ Invalid status: ${date.status}`);
                    throw new common_1.BadRequestException(`Invalid status. Allowed values: ${validStatuses.join(', ')}`);
                }
                status = date.status;
            }
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
            this.logger.log(`📝 Formatted date for creation: ${JSON.stringify(vehicleData)}`);
            const vehicle = await this.prisma.vehicle.create({ data: vehicleData,
                include: {
                    company: true,
                },
            });
            this.logger.log(`✓ Vehicle created successfully: ${vehicle.licensePlate} (${vehicle.id})`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            return vehicle;
        }
        catch (error) {
            this.logger.error(`❌ ERROR creating vehicle: ${error.message}`);
            this.logger.error(`Stack: ${error.stack}`);
            throw error;
        }
    }
    async findAll(companyId, filters) {
        const where = {};
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
    async findAvailable(companyId) {
        const where = {
            status: client_1.VehicleStatus.available,
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
    async findOne(id, companyId) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`🔍 Searching for vehicle ${id}`);
        this.logger.log(`🏢 CompanyId: ${companyId || 'ALL (SUPER_ADMIN)'}`);
        const where = { id };
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
            throw new common_1.NotFoundException('Vehicle not found');
        }
        this.logger.log(`✓ Vehicle found: ${vehicle.licensePlate}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return vehicle;
    }
    async update(id, data, companyId) {
        try {
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            this.logger.log(`📝 Updating vehicle ${id}`);
            this.logger.log(`🏢 CompanyId: ${companyId || 'ALL (SUPER_ADMIN)'}`);
            this.logger.log(`📋 Date received: ${JSON.stringify(date)}`);
            const vehicle = await this.findOne(id, companyId);
            this.logger.log(`✓ Vehicle found: ${vehicle.licensePlate}`);
            const updateData = {};
            if (date.licensePlate) {
                const normalizedPlate = date.licensePlate.trim().toUpperCase();
                if (normalizedPlate !== vehicle.licensePlate) {
                    this.logger.log(`🔍 Checking if license plate ${normalizedPlate} already exists...`);
                    const where = {
                        licensePlate: normalizedPlate,
                        NOT: { id },
                    };
                    if (companyId) {
                        where.companyId = companyId;
                    }
                    const existing = await this.prisma.vehicle.findFirst({ where });
                    if (existing) {
                        this.logger.error(` License plate ${normalizedPlate} already exists`);
                        throw new common_1.ConflictException('Matrícula already exists');
                    }
                    this.logger.log(` License plate disponível`);
                    updateData.licensePlate = normalizedPlate;
                }
            }
            if (date.model)
                updateData.model = date.model.trim();
            if (date.brand)
                updateData.brand = date.brand.trim();
            if (date.type)
                updateData.type = date.type.trim();
            if (date.capacity !== undefined) {
                const capacity = Number(date.capacity);
                if (isNaN(capacity) || capacity < 0) {
                    throw new common_1.BadRequestException('Capacity must be a valid number greater than or equal to 0');
                }
                updateData.capacity = capacity;
            }
            if (date.year !== undefined) {
                const year = Number(date.year);
                if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
                    throw new common_1.BadRequestException(`Year deve ser entre 1900 e ${new Date().getFullYear() + 1}`);
                }
                updateData.year = year;
            }
            if (date.status) {
                const validStatuses = Object.values(client_1.VehicleStatus);
                if (!validStatuses.includes(date.status)) {
                    throw new common_1.BadRequestException(`Invalid status. Valores permitidos: ${validStatuses.join(', ')}`);
                }
                updateData.status = date.status;
            }
            this.logger.log(`📝 Dados para atualização: ${JSON.stringify(updateData)}`);
            const updated = await this.prisma.vehicle.update({
                where: { id }, data: updateData,
                include: {
                    company: true,
                },
            });
            this.logger.log(` Veículo ${id} atualizado com success`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            return updated;
        }
        catch (error) {
            this.logger.error(` ERRO ao update veículo: ${error.message}`);
            throw error;
        }
    }
    async updateStatus(id, status, companyId) {
        await this.findOne(id, companyId);
        const validStatuses = Object.values(client_1.VehicleStatus);
        if (!validStatuses.includes(status)) {
            throw new common_1.ConflictException(`Invalid status. Valores permitidos: ${validStatuses.join(', ')}`);
        }
        return this.prisma.vehicle.update({
            where: { id }, data: { status },
            include: {
                company: true,
            },
        });
    }
    async remove(id, companyId) {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        this.logger.log(`🗑️ Tentando remove veículo ${id}`);
        this.logger.log(`🏢 CompanyId: ${companyId || 'ALL (SUPER_ADMIN)'}`);
        try {
            const vehicle = await this.findOne(id, companyId);
            this.logger.log(` Veículo encontrado: ${vehicle.licensePlate}`);
            const activeTransports = await this.prisma.transport.findMany({
                where: {
                    vehicleId: id,
                    status: {
                        in: [client_1.TransportStatus.PENDING, client_1.TransportStatus.IN_TRANSIT],
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
            if (activeTransports.length > 0) {
                this.logger.warn(`⚠️ BLOQUEADO - Veículo tem ${activeTransports.length} transport(s) active(s)`);
                const transportsList = activeTransports
                    .map((t) => `${t.internalCode} (${t.origin} → ${t.destination}) - Status: ${t.status}`)
                    .join(', ');
                throw new common_1.ConflictException(` This vehicle cannot be deleted as it is being used in active transport(s).\n\n` +
                    `📦 Active transports (${activeTransports.length}):\n${transportsList}${activeTransports.length > 5 ? '...' : ''}\n\n` +
                    `💡 Pode delete o veículo quando:\n` +
                    `  • Finalizar ou cancelar estes transportes\n` +
                    `  • Atribuir outro veículo a estes transportes`);
            }
            const finishedTransportsCount = await this.prisma.transport.count({
                where: {
                    vehicleId: id,
                    status: {
                        in: [client_1.TransportStatus.DELIVERED, client_1.TransportStatus.CANCELED],
                    },
                },
            });
            this.logger.log(` Transportes finalizados: ${finishedTransportsCount}`);
            if (finishedTransportsCount > 0) {
                this.logger.log(`ℹ️ O veículo tem ${finishedTransportsCount} transport(s) finalizado(s), mas pode ser eliminado`);
            }
            else {
                this.logger.log(` No associated transport - proceeding with deletion`);
            }
            await this.prisma.vehicle.delete({
                where: { id },
            });
            this.logger.log(` Vehicle "${vehicle.licensePlate}" (${id}) eliminado com success`);
            this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            return {
                message: ` Vehicle "${vehicle.licensePlate}" deleted successfully`,
                finishedTransports: finishedTransportsCount,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(` Error inesperado ao delete veículo ${id}`);
            this.logger.error(`Mensagem: ${error.message}`);
            this.logger.error(`Stack: ${error.stack}`);
            throw new common_1.InternalServerErrorException(`Error ao delete veículo: ${error.message}`);
        }
    }
    async getStats(companyId) {
        const where = {};
        if (companyId) {
            where.companyId = companyId;
        }
        const [total, available, inUse, inMaintenance, retired] = await Promise.all([
            this.prisma.vehicle.count({ where }),
            this.prisma.vehicle.count({
                where: { ...where, status: client_1.VehicleStatus.available },
            }),
            this.prisma.vehicle.count({
                where: { ...where, status: client_1.VehicleStatus.in_use },
            }),
            this.prisma.vehicle.count({
                where: { ...where, status: client_1.VehicleStatus.in_maintenance },
            }),
            this.prisma.vehicle.count({
                where: { ...where, status: client_1.VehicleStatus.retired },
            }),
        ]);
        return {
            total,
            available,
            inUse,
            inMaintenance,
            retired,
        };
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = VehiclesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map