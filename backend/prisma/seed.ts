 //backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  
  const company = await prisma.company.upsert({
    where: { email: 'admin@logistica.com' },
    update: {},
    create: {
      name: 'Logística Demo Lda',
      nif: '500000000',
      email: 'admin@logistica.com',
      phone: '+351 220 000 000',
      address: 'Rua Demo, 123, Porto',
    },
  });

  console.log('✅ Company created:', company.name);

   
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@logistica.com' },
    update: {},
    create: {
      name: 'Admin Demo',
      email: 'admin@logistica.com',
      password: hashedPassword,
      
      role: 'ADMIN' as any,
      companyId: company.id,
    } as any,
  });

  console.log('✅ Admin user created:', admin.email);

  const operatorPassword = await bcrypt.hash('operator123', 10);

  const operator = await prisma.user.upsert({
    where: { email: 'operador@logistica.com' },
    update: {},
    create: {
      name: 'Operador Demo',
      email: 'operador@logistica.com',
      password: operatorPassword,
      role: 'OPERATOR' as any,
      companyId: company.id,
    } as any,
  });

  console.log('✅ Operator user created:', operator.email);


  const supplier = await prisma.supplier.create({
    data: {
      name: 'Fornecedor Teste Lda',
      nif: '501000000',
      email: 'fornecedor@teste.com',
      phone: '+351 220 100 000',
      address: 'Rua Fornecedor, 456, Lisboa',
      companyId: company.id,
    },
  });

  console.log('✅ Supplier created:', supplier.name);

  const vehicle = await prisma.vehicle.create({
    data: {
      licensePlate: 'AB-12-CD',
      type: 'Camião',
      capacity: 10000,
      year: 2022,
      companyId: company.id,
    },
  });

  console.log('✅ Vehicle created:', vehicle.licensePlate);

 
  const products = await Promise.all([
    prisma.product.create({
      data: {
        internalCode: 'PROD-001',
        description: 'Produto Teste A - Eletrónica',
        quantity: 100,
        unit: 'UN',
        totalWeight: 50.5,
        totalVolume: 2.5,
        currentLocation: 'Armazém A - Prateleira 1',
        status: ('IN_STORAGE' as any),
        supplierId: supplier.id,
        companyId: company.id,
      } as any,
    }),
    prisma.product.create({
      data: {
        internalCode: 'PROD-002',
        description: 'Produto Teste B - Têxtil',
        quantity: 250,
        unit: 'UN',
        totalWeight: 125.0,
        totalVolume: 5.0,
        currentLocation: 'Armazém B - Zona 2',
        status: ('RECEIVED' as any),
        supplierId: supplier.id,
        companyId: company.id,
      } as any,
    }),
    prisma.product.create({
      data: {
        internalCode: 'PROD-003',
        description: 'Produto Teste C - Alimentar',
        quantity: 500,
        unit: 'KG',
        totalWeight: 500.0,
        totalVolume: 10.0,
        currentLocation: 'Armazém C - Câmara Fria',
        status: ('IN_ANALYSIS' as any),
        supplierId: supplier.id,
        companyId: company.id,
      } as any,
    }),
  ]);

  console.log(`✅ ${products.length} products created`);

   
  await prisma.productMovement.create({
    data: {
      productId: products[0].id,
      previousStatus: ('RECEIVED' as any),
      newStatus: ('IN_STORAGE' as any),
      quantity: 100,
      location: 'Armazém A - Prateleira 1',
      reason: 'Produto aprovado e armazenado',
      userId: operator.id,
    } as any,
  });

  console.log('✅ Product movement created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Credenciais de acesso:');
  console.log('   Admin: admin@logistica.com / admin123');
  console.log('   Operador: operador@logistica.com / operator123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
