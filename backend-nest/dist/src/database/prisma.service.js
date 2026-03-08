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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const tenant_context_service_1 = require("../common/tenant-context.service");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    tenantContext;
    logger = new common_1.Logger(PrismaService_1.name);
    constructor(tenantContext) {
        super();
        this.tenantContext = tenantContext;
    }
    async onModuleInit() {
        await this.$connect();
        this.logger.log(' Prisma connected to database');
        this.$use(async (params, next) => {
            const companyId = this.tenantContext.getCompanyId();
            if (companyId && this.shouldInjectCompanyId(params.model)) {
                if (params.action === 'findUnique' || params.action === 'findFirst') {
                    params.args.where = {
                        ...params.args.where,
                        companyId,
                    };
                }
                else if (params.action === 'findMany') {
                    params.args.where = {
                        ...params.args.where,
                        companyId,
                    };
                }
                else if (params.action === 'create') {
                    params.args.data = {
                        ...params.args.data,
                        companyId,
                    };
                }
                else if (params.action === 'update' || params.action === 'updateMany') {
                    params.args.where = {
                        ...params.args.where,
                        companyId,
                    };
                }
                else if (params.action === 'delete' || params.action === 'deleteMany') {
                    params.args.where = {
                        ...params.args.where,
                        companyId,
                    };
                }
            }
            return next(params);
        });
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log(' Prisma disconnected from database');
    }
    shouldInjectCompanyId(model) {
        const tenantModels = [
            'Company',
            'User',
            'Supplier',
            'Product',
            'Vehicle',
            'Transport',
            'TransportProduct',
            'AuditLog',
            'Settings',
            'Notification',
            'RefreshToken',
            'Task',
            'Referral',
        ];
        return model ? tenantModels.includes(model) : false;
    }
    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot clean database in production!');
        }
        const models = Reflect.ownKeys(this).filter((key) => typeof key === 'string' && key[0] !== '_' && key[0] !== '$');
        return Promise.all(models.map((modelKey) => {
            const model = this[modelKey];
            if (model && typeof model.deleteMany === 'function') {
                return model.deleteMany();
            }
        }));
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map