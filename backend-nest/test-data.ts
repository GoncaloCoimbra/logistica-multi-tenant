import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== VERIFICAÇÃO DE DADOS ===\n');

  // 1. Contar AuditLogs
  const auditLogCount = await prisma.auditLog.count();
  console.log(`📋 Total de registros de Histórico (AuditLog): ${auditLogCount}`);

  if (auditLogCount > 0) {
    const auditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true } },
        company: { select: { name: true } },
      },
    });
    console.log(' Últimos 5 registros de histórico:');
    auditLogs.forEach((log, idx) => {
      console.log(
        `  ${idx + 1}. [${log.action}] ${log.entity} by ${log.user.email} at ${log.createdAt}`
      );
    });
  } else {
    console.log('⚠️  Nenhum registro de histórico encontrado!');
  }

  console.log('\n---\n');

  // 2. Contar Notificações
  const notificationCount = await prisma.notification.count();
  console.log(`🔔 Total de Notificações: ${notificationCount}`);

  if (notificationCount > 0) {
    const notifications = await prisma.notification.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true } },
        company: { select: { name: true } },
      },
    });
    console.log(' Últimas 5 notificações:');
    notifications.forEach((notif, idx) => {
      console.log(
        `  ${idx + 1}. [${notif.isRead ? '📖' : '📬'}] ${notif.title} to ${notif.user.email} at ${notif.createdAt}`
      );
    });
  } else {
    console.log('⚠️  Nenhuma notificação encontrada!');
  }

  console.log('\n---\n');

  // 3. Contar ProductMovements
  const movementCount = await prisma.productMovement.count();
  console.log(` Total de Movimentações de Produtos: ${movementCount}`);

  if (movementCount > 0) {
    const movements = await prisma.productMovement.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { internalCode: true } },
        user: { select: { email: true } },
      },
    });
    console.log(' Últimas 5 movimentações:');
    movements.forEach((mov, idx) => {
      console.log(
        `  ${idx + 1}. Produto ${mov.product.internalCode}: ${mov.previousStatus} → ${mov.newStatus} at ${mov.createdAt}`
      );
    });
  } else {
    console.log('⚠️  Nenhuma movimentação encontrada!');
  }

  console.log('\n=== RESUMO ===');
  console.log(`✓ AuditLogs: ${auditLogCount}`);
  console.log(`✓ Notificações: ${notificationCount}`);
  console.log(`✓ Movimentações: ${movementCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
