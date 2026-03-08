// src/modules/notifications/notifications.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    message: string;
    companyId: string;
    userId: string;
  }) {
    try {
      console.log('📨 [SVC-1] Criando notificação:', data);

      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
        select: { id: true, companyId: true, name: true },
      });

      console.log('📨 [SVC-2] User encontrado:', user);

      if (!user) {
        console.error(' [SVC-3] User não encontrado:', data.userId);
        throw new NotFoundException(`Utilizador com ID ${data.userId} não encontrado`);
      }

      if (user.companyId !== data.companyId) {
        console.error(' [SVC-4] CompanyId mismatch:', { user: user.companyId, req: data.companyId });
        throw new ForbiddenException('Utilizador não pertence a esta empresa');
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
    } catch (error: any) {
      console.error(' [SVC-ERROR] Erro:', error.message, error?.meta);
      throw error;
    }
  }

  async findByCompany(companyId: string | null | undefined) {
    try {
      console.log('🔍 Finding notifications for companyId:', companyId);

      // Se companyId for null/undefined (SUPER_ADMIN), retorna TODAS as notificações
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

      // Transformar para o formato que o frontend espera
      const formattedNotifications = notifications.map(n => ({
        id: n.id,
        type: 'info' as const,
        title: n.title,
        message: n.content,
        entityType: 'product' as const,
        entityId: n.id,
        createdAt: n.createdAt.toISOString(),
        priority: 'medium' as const,
        read: n.isRead,
      }));

      // Calcular contadores por prioridade
      const unreadCount = formattedNotifications.filter(n => !n.read).length;

      return {
        total: unreadCount,
        critical: 0,
        high: 0,
        medium: unreadCount,
        low: 0,
        notifications: formattedNotifications,
      };
    } catch (error) {
      console.error('Error finding notifications:', error);
      throw error;
    }
  }

  async findUnreadByCompany(companyId: string | null | undefined) {
    try {
      console.log('🔍 Finding unread notifications for companyId:', companyId);

      // Se companyId for null/undefined (SUPER_ADMIN), retorna TODAS não lidas
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
    } catch (error) {
      console.error('Error finding unread notifications:', error);
      throw error;
    }
  }

  async markAsRead(id: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
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
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(companyId: string | null | undefined) {
    try {
      // Se companyId for null/undefined (SUPER_ADMIN), marca TODAS como lidas
      const whereClause = companyId 
        ? { companyId, isRead: false } 
        : { isRead: false };

      return await this.prisma.notification.updateMany({
        where: whereClause,
        data: { isRead: true },
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      return await this.prisma.notification.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async countUnread(companyId: string | null | undefined) {
    try {
      // Se companyId for null/undefined (SUPER_ADMIN), conta TODAS não lidas
      const whereClause = companyId 
        ? { companyId, isRead: false } 
        : { isRead: false };

      return await this.prisma.notification.count({
        where: whereClause,
      });
    } catch (error) {
      console.error('Error counting unread notifications:', error);
      throw error;
    }
  }

  // =========
  // ✅ NOVOS MÉTODOS PARA SISTEMA ARRIVED
  // =========

  /**
   * 🚚 Notifies when transport arrives at destination (status ARRIVED)
   */
  async notifyTransportArrived(
    companyId: string,
    transportCode: string,
    origin: string,
    destination: string,
  ): Promise<void> {
    try {
      console.log(`📧 [ARRIVED] Notifying transport arrival ${transportCode}`);

      // Find all operators/admins of the company
      const operators = await this.prisma.user.findMany({
        where: {
          companyId,
          isActive: true,
          role: { in: ['ADMIN', 'OPERATOR'] },
        },
        select: { id: true, name: true },
      });

      if (operators.length === 0) {
        console.warn(`⚠️ [ARRIVED] No operator found for company ${companyId}`);
        return;
      }

      // Create notification for each operator
      const notifications = operators.map(operator => ({
        title: '🚚 Transport Arrived at Destination',
        content: `Transport ${transportCode} arrived from ${origin} to ${destination}. Awaiting physical verification of products.`,
        companyId,
        userId: operator.id,
        isRead: false,
      }));

      await this.prisma.notification.createMany({
        data: notifications,
      });

      console.log(`✅ [ARRIVED] ${notifications.length} notifications created`);
    } catch (error: any) {
      console.error(`❌ [ARRIVED] Error notifying arrival:`, error.message);
      // Does not throw error to avoid breaking main flow
    }
  }

  /**
   * ✅ Notifies when transport is delivered (status DELIVERED)
   */
  async notifyTransportDelivered(
    companyId: string,
    transportCode: string,
    receivedBy: string,
  ): Promise<void> {
    try {
      console.log(`📧 [DELIVERED] Notifying transport delivery ${transportCode}`);

      // Find company admins
      const admins = await this.prisma.user.findMany({
        where: {
          companyId,
          isActive: true,
          role: 'ADMIN',
        },
        select: { id: true },
      });

      if (admins.length === 0) {
        console.warn(`⚠️ [DELIVERED] No admin found for company ${companyId}`);
        return;
      }

      // Create notification for each admin
      const notifications = admins.map(admin => ({
        title: '✅ Transport Delivered',
        content: `Transport ${transportCode} was verified and delivered by ${receivedBy}.`,
        companyId,
        userId: admin.id,
        isRead: false,
      }));

      await this.prisma.notification.createMany({
        data: notifications,
      });

      console.log(`✅ [DELIVERED] ${notifications.length} notificações criadas`);
    } catch (error: any) {
      console.error(` [DELIVERED] Erro ao notificar entrega:`, error.message);
      // Não lança erro para não quebrar o fluxo principal
    }
  }

  /**
   * ⚠️ Notifica erro ou alerta relacionado a transporte
   */
  async notifyTransportError(
    companyId: string,
    title: string,
    message: string,
  ): Promise<void> {
    try {
      console.log(`📧 [ERROR] Notificando erro: ${title}`);

      // Busca admins da empresa
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

      // Cria notificação para cada admin
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
    } catch (error: any) {
      console.error(` [ERROR] Erro ao notificar erro:`, error.message);
    }
  }
}