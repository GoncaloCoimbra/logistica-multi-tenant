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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("../notifications.service");
const create_notification_dto_1 = require("../dto/create-notification.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../database/prisma.service");
let NotificationsController = class NotificationsController {
    notificationsService;
    prisma;
    constructor(notificationsService, prisma) {
        this.notificationsService = notificationsService;
        this.prisma = prisma;
    }
    async create(createNotificationDto, user) {
        console.log('📨 POST /notifications called');
        console.log(' DTO received:', createNotificationDto);
        console.log('👤 User from token:', {
            id: user.id,
            email: user.email,
            companyId: user.companyId,
            role: user.role,
        });
        const userId = user.id;
        const companyId = user.companyId;
        if (!companyId) {
            throw new Error('SUPER_ADMIN cannot create notifications without specifying a company');
        }
        console.log('🎯 Creating notification for userId:', userId);
        console.log('🏢 Creating notification for companyId:', companyId);
        try {
            const result = await this.notificationsService.create({
                title: createNotificationDto.title,
                message: createNotificationDto.message,
                userId: userId,
                companyId: companyId,
            });
            console.log('Notification created successfully');
            return result;
        }
        catch (error) {
            console.error(' Error in controller:', error.message);
            throw error;
        }
    }
    async test(user) {
        return {
            message: 'Test endpoint working',
            user: {
                id: user.id,
                email: user.email,
                companyId: user.companyId,
                role: user.role,
            },
            timestamp: new Date(),
        };
    }
    async findAll(user) {
        return this.notificationsService.findByCompany(user.companyId);
    }
    async findUnread(user) {
        return this.notificationsService.findUnreadByCompany(user.companyId);
    }
    async countUnread(user) {
        const count = await this.notificationsService.countUnread(user.companyId);
        return { count };
    }
    async markAsRead(id) {
        return this.notificationsService.markAsRead(id);
    }
    async markAllAsRead(user) {
        return this.notificationsService.markAllAsRead(user.companyId);
    }
    async markAllAsReadAlias(user) {
        return this.notificationsService.markAllAsRead(user.companyId);
    }
    async removeAll(user) {
        const companyId = user.companyId;
        if (!companyId) {
            throw new Error('SUPER_ADMIN cannot delete all notifications without specifying a company');
        }
        const result = await this.prisma.notification.deleteMany({
            where: { companyId },
        });
        console.log(`🗑️  Deleted ${result.count} notifications for company ${companyId}`);
        return {
            success: true,
            deleted: result.count,
            message: `${result.count} notificações foram eliminadas`,
        };
    }
    async remove(id) {
        await this.notificationsService.delete(id);
        return {
            success: true,
            message: 'Notificação eliminada com sucesso',
            id,
        };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('test'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "test", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unread'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findUnread", null);
__decorate([
    (0, common_1.Get)('unread/count'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "countUnread", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('read-all'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Patch)('mark-all-read'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsReadAlias", null);
__decorate([
    (0, common_1.Delete)('all'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "removeAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "remove", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        prisma_service_1.PrismaService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map