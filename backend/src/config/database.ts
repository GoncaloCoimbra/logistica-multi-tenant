import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error: any) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('📤 Database disconnected');
});

export default prisma;