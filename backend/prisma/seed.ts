import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...\n');


  // 1️⃣ SUPER ADMIN (SEM EMPRESA)
  
  console.log('👑 Creating Super Admin...');
  
  const superAdminPassword = await bcrypt.hash('superadmin123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@sistema.com' },
    update: {},
    create: {
      name: 'Super Administrador',
      email: 'superadmin@sistema.com',
      password: superAdminPassword,
      role: Role.SUPER_ADMIN,
      companyId: null, // Super admin não pertence a nenhuma empresa
    },
  });

  console.log(' Super Admin created:', superAdmin.email);

  
  // 2️⃣ EMPRESA 1 - Logística Demo
 
  console.log('\n🏢 Creating Company 1...');

  const company1 = await prisma.company.upsert({
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

  console.log(' Company created:', company1.name);

  // Admin da Empresa 1
  const admin1Password = await bcrypt.hash('admin123', 10);

  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@logistica.com' },
    update: {},
    create: {
      name: 'Admin Demo',
      email: 'admin@logistica.com',
      password: admin1Password,
      role: Role.ADMIN,
      companyId: company1.id,
    },
  });

  console.log(' Admin user created:', admin1.email);

  // Operador da Empresa 1
  const operator1Password = await bcrypt.hash('operator123', 10);

  const operator1 = await prisma.user.upsert({
    where: { email: 'operador@logistica.com' },
    update: {},
    create: {
      name: 'Operador Demo',
      email: 'operador@logistica.com',
      password: operator1Password,
      role: Role.OPERATOR,
      companyId: company1.id,
    },
  });

  console.log(' Operator user created:', operator1.email);

  // Fornecedor da Empresa 1
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Fornecedor Teste Lda',
      nif: '501000000',
      email: 'fornecedor@teste.com',
      phone: '+351 220 100 000',
      address: 'Rua Fornecedor, 456, Lisboa',
      city: 'Lisboa',
      state: 'Lisboa',
      companyId: company1.id,
    },
  });

  console.log(' Supplier created:', supplier1.name);

  // Veículo da Empresa 1
  const vehicle1 = await prisma.vehicle.create({
    data: {
      licensePlate: 'AB-12-CD',
      type: 'Camião',
      model: 'Mercedes Actros',
      brand: 'Mercedes',
      capacity: 10000,
      year: 2022,
      status: 'available',
      companyId: company1.id,
    },
  });

  console.log(' Vehicle created:', vehicle1.licensePlate);

  // Produtos da Empresa 1
  const products1 = await Promise.all([
    prisma.product.create({
      data: {
        internalCode: 'PROD-001',
        description: 'Produto Teste A - Eletrónica',
        quantity: 100,
        unit: 'UN',
        totalWeight: 50.5,
        totalVolume: 2.5,
        currentLocation: 'Armazém A - Prateleira 1',
        status: ProductStatus.IN_STORAGE,
        supplierId: supplier1.id,
        companyId: company1.id,
      },
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
        status: ProductStatus.RECEIVED,
        supplierId: supplier1.id,
        companyId: company1.id,
      },
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
        status: ProductStatus.IN_ANALYSIS,
        supplierId: supplier1.id,
        companyId: company1.id,
      },
    }),
  ]);

  console.log(` ${products1.length} products created for Company 1`);

  // Movimento de produto
  await prisma.productMovement.create({
    data: {
      productId: products1[0].id,
      previousStatus: ProductStatus.RECEIVED,
      newStatus: ProductStatus.IN_STORAGE,
      quantity: 100,
      location: 'Armazém A - Prateleira 1',
      reason: 'Produto aprovado e armazenado',
      userId: operator1.id,
    },
  });

  console.log(' Product movement created');

  
  // 3️⃣ EMPRESA 2 - TransPorto Express
  
  console.log('\n🏢 Creating Company 2...');

  const company2 = await prisma.company.upsert({
    where: { email: 'admin@transporte.com' },
    update: {},
    create: {
      name: 'TransPorto Express Lda',
      nif: '500111000',
      email: 'admin@transporte.com',
      phone: '+351 220 111 111',
      address: 'Avenida dos Transportes, 789, Porto',
    },
  });

  console.log(' Company created:', company2.name);

  // Admin da Empresa 2
  const admin2Password = await bcrypt.hash('admin456', 10);

  const admin2 = await prisma.user.create({
    data: {
      name: 'Carlos Silva',
      email: 'carlos@transporte.com',
      password: admin2Password,
      role: Role.ADMIN,
      companyId: company2.id,
    },
  });

  console.log(' Admin user created:', admin2.email);

  // Operador da Empresa 2
  const operator2Password = await bcrypt.hash('operator456', 10);

  const operator2 = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@transporte.com',
      password: operator2Password,
      role: Role.OPERATOR,
      companyId: company2.id,
    },
  });

  console.log(' Operator user created:', operator2.email);

  // Fornecedor da Empresa 2
  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Fornecedor Norte Lda',
      nif: '502000000',
      email: 'norte@fornecedor.com',
      phone: '+351 220 200 000',
      address: 'Rua do Norte, 321, Porto',
      city: 'Porto',
      state: 'Porto',
      companyId: company2.id,
    },
  });

  console.log(' Supplier created:', supplier2.name);

  // Veículo da Empresa 2
  const vehicle2 = await prisma.vehicle.create({
    data: {
      licensePlate: 'XY-34-ZW',
      type: 'Carrinha',
      model: 'Sprinter',
      brand: 'Mercedes',
      capacity: 3500,
      year: 2023,
      status: 'available',
      companyId: company2.id,
    },
  });

  console.log(' Vehicle created:', vehicle2.licensePlate);

  // Produtos da Empresa 2
  const products2 = await Promise.all([
    prisma.product.create({
      data: {
        internalCode: 'TRANS-001',
        description: 'Material de Embalagem',
        quantity: 1000,
        unit: 'UN',
        totalWeight: 200.0,
        totalVolume: 15.0,
        currentLocation: 'Armazém Principal',
        status: ProductStatus.IN_STORAGE,
        supplierId: supplier2.id,
        companyId: company2.id,
      },
    }),
    prisma.product.create({
      data: {
        internalCode: 'TRANS-002',
        description: 'Paletes de Madeira',
        quantity: 50,
        unit: 'UN',
        totalWeight: 1000.0,
        totalVolume: 25.0,
        currentLocation: 'Zona Exterior',
        status: ProductStatus.APPROVED,
        supplierId: supplier2.id,
        companyId: company2.id,
      },
    }),
  ]);

  console.log(` ${products2.length} products created for Company 2`);

  
  console.log('\n📝 Creating audit logs...');

  await prisma.auditLog.createMany({
    data: [
      {
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: admin1.id,
        userId: admin1.id,
        companyId: company1.id,
        ipAddress: '192.168.1.100',
      },
      {
        action: 'PRODUCT_CREATED',
        entity: 'Product',
        entityId: products1[0].id,
        userId: admin1.id,
        companyId: company1.id,
        ipAddress: '192.168.1.100',
      },
      {
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: admin2.id,
        userId: admin2.id,
        companyId: company2.id,
        ipAddress: '192.168.1.101',
      },
    ],
  });

  console.log(' Audit logs created');

  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Seed completed successfully!');
  console.log('='.repeat(50));
  
  console.log('\n👑 SUPER ADMIN:');
  console.log('   Email: superadmin@sistema.com');
  console.log('   Password: superadmin123');
  console.log('   Role: SUPER_ADMIN');
  console.log('   Company: (sem empresa - acesso global)');

  console.log('\n🏢 EMPRESA 1 - Logística Demo Lda');
  console.log('   📧 Admin: superadmin@sistema.com /superadmin123');
  console.log('   📧 Admin: admin@logistica.com / admin123');
  console.log('   👤 Operador: operador@logistica.com / operator123');
  console.log(`   📦 Produtos: ${products1.length}`);
  console.log(`   🚚 Veículos: 1`);
  console.log(`   🏭 Fornecedores: 1`);

  console.log('\n🏢 EMPRESA 2 - TransPorto Express Lda');
  console.log('   📧 Admin: carlos@transporte.com / admin456');
  console.log('   👤 Operador: maria@transporte.com / operator456');
  console.log(`   📦 Produtos: ${products2.length}`);
  console.log(`   🚚 Veículos: 1`);
  console.log(`   🏭 Fornecedores: 1`);

  console.log('\n' + '='.repeat(50));
  console.log('💡 TIP: Use o Super Admin para gerenciar todas as empresas!');
  console.log('='.repeat(50) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });