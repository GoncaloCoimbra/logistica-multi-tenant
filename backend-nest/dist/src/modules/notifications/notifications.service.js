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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            console.log('📨 [SVC-1] Criando notificação:', data);
            const user = await this.prisma.user.findUnique({
                where: { id: data.userId },
                select: { id: true, companyId: true, name: true },
            });
            console.log('📨 [SVC-2] User encontrado:', user);
            if (!user) {
                console.error(' [SVC-3] User não encontrado:', data.userId);
                throw new common_1.NotFoundException(`Utilizador com ID ${data.userId} não encontrado`);
            }
            if (user.companyId !== data.companyId) {
                console.error(' [SVC-4] CompanyId mismatch:', { user: user.companyId, req: data.companyId });
                throw new common_1.ForbiddenException('Utilizador não pertence a esta empresa');
            }
            console.log('📨 [SVC-5] Criando notificação na DB...');
            const notification = await this.prisma.notification.create({
                data: {
                    title: data.title,
                    content: data.message,
                    companyId: data.companyId,
                    userId: data.userId,
                    isRead: false,
                },
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            console.log('✅ [SVC-6] Notificação criada:', notification.id);
            return notification;
        }
        catch (error) {
            console.error(' [SVC-ERROR] Erro:', error.message, error?.meta);
            throw error;
        }
    }
    async findByCompany(companyId) {
        try {
            console.log('🔍 Finding notifications for companyId:', companyId);
            const whereClause = companyId ? { companyId } : {};
            const notifications = await this.prisma.notification.findMany({
                where: whereClause,
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            const formattedNotifications = notifications.map(n => ({
                id: n.id,
                type: 'info',
                title: n.title,
                message: n.content,
                entityType: 'product',
                entityId: n.id,
                createdAt: n.createdAt.toISOString(),
                priority: 'medium',
                read: n.isRead,
            }));
            const unreadCount = formattedNotifications.filter(n => !n.read).length;
            return {
                total: unreadCount,
                critical: 0,
                high: 0,
                medium: unreadCount,
                low: 0,
                notifications: formattedNotifications,
            };
        }
        catch (error) {
            console.error('Error finding notifications:', error);
            throw error;
        }
    }
    async findUnreadByCompany(companyId) {
        try {
            console.log('🔍 Finding unread notifications for companyId:', companyId);
            const whereClause = companyId
                ? { companyId, isRead: false }
                : { isRead: false };
            return await this.prisma.notification.findMany({
                where: whereClause,
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            console.error('Error finding unread notifications:', error);
            throw error;
        }
    }
    async markAsRead(id) {
        try {
            const notification = await this.prisma.notification.findUnique({
                where: { id },
            });
            if (!notification) {
                throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
            }
            return await this.prisma.notification.update({
                where: { id },
                data: { isRead: true },
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }
    async markAllAsRead(companyId) {
        try {
            const whereClause = companyId
                ? { companyId, isRead: false }
                : { isRead: false };
            return await this.prisma.notification.updateMany({
                where: whereClause,
                data: { isRead: true },
            });
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const notification = await this.prisma.notification.findUnique({
                where: { id },
            });
            if (!notification) {
                throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
            }
            return await this.prisma.notification.delete({
                where: { id },
            });
        }
        catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }
    async countUnread(companyId) {
        try {
            const whereClause = companyId
                ? { companyId, isRead: false }
                : { isRead: false };
            return await this.prisma.notification.count({
                where: whereClause,
            });
        }
        catch (error) {
            console.error('Error counting unread notifications:', error);
            throw error;
        }
    }
    async notifyTransportArrived(companyId, transportCode, origin, destination) {
        try {
            console.log(`📧 [ARRIVED] Notificando chegada do transporte ${transportCode}`);
            const operators = await this.prisma.user.findMany({
                where: {
                    companyId,
                    isActive: true,
                    role: { in: ['ADMIN', 'OPERATOR'] },
                },
                select: { id: true, name: true },
            });
            if (operators.length === 0) {
                console.warn(`⚠️ [ARRIVED] Nenhum operador encontrado para empresa ${companyId}`);
                return;
            }
            const notifications = operators.map(operator => ({
                title: '🚚 Transporte Chegou ao Destino',
                content: `O transporte ${transportCode} chegou de ${origin} para ${destination}. Aguardando conferência física dos produtos.`,
                companyId,
                userId: operator.id,
                isRead: false,
            }));
            await this.prisma.notification.createMany({
                data: notifications,
            });
            console.log(`✅ [ARRIVED] ${notifications.length} notificações criadas`);
        }
        catch (error) {
            console.error(` [ARRIVED] Erro ao notificar chegada:`, error.message);
        }
    }
    async notifyTransportDelivered(companyId, transportCode, receivedBy) {
        try {
            console.log(`📧 [DELIVERED] Notificando entrega do transporte ${transportCode}`);
            const admins = await this.prisma.user.findMany({
                where: {
                    companyId,
                    isActive: true,
                    role: 'ADMIN',
                },
                select: { id: true },
            });
            if (admins.length === 0) {
                console.warn(`⚠️ [DELIVERED] Nenhum admin encontrado para empresa ${companyId}`);
                return;
            }
            const notifications = admins.map(admin => ({
                title: '✅ Transporte Entregue',
                content: `O transporte ${transportCode} foi conferido e entregue por ${receivedBy}.`,
                companyId,
                userId: admin.id,
                isRead: false,
            }));
            await this.prisma.notification.createMany({
                data: notifications,
            });
            console.log(`✅ [DELIVERED] ${notifications.length} notificações criadas`);
        }
        catch (error) {
            console.error(` [DELIVERED] Erro ao notificar entrega:`, error.message);
        }
    }
    async notifyTransportError(companyId, title, message) {
        try {
            console.log(`📧 [ERROR] Notificando erro: ${title}`);
            const admins = await this.prisma.user.findMany({
                where: {
                    companyId,
                    isActive: true,
                    role: 'ADMIN',
                },
                select: { id: true },
            });
            if (admins.length === 0) {
                console.warn(`⚠️ [ERROR] Nenhum admin encontrado para empresa ${companyId}`);
                return;
            }
            const notifications = admins.map(admin => ({
                title: `⚠️ ${title}`,
                content: message,
                companyId,
                userId: admin.id,
                isRead: false,
            }));
            await this.prisma.notification.createMany({
                data: notifications,
            });
            console.log(` [ERROR] ${notifications.length} notificações de erro criadas`);
        }
        catch (error) {
            console.error(` [ERROR] Erro ao notificar erro:`, error.message);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map