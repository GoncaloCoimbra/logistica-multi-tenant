"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...\n');
    console.log(' Creating Super Admin...');
    const superAdminPassword = await bcrypt_1.default.hash('superadmin123', 10);
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@sistema.com' },
        update: {},
        create: {
            name: 'Super Administrador',
            email: 'superadmin@sistema.com',
            password: superAdminPassword,
            role: client_1.Role.SUPER_ADMIN,
        },
    });
    console.log(' Super Admin created:', superAdmin.email);
    console.log('\n Creating Company 1...');
    const company1 = await prisma.company.upsert({
        where: { email: 'admin@logistica.com' },
        update: {},
        create: {
            name: 'Logistics Demo Ltd',
            nif: '500000000',
            email: 'admin@logistica.com',
            phone: '+351 220 000 000',
            address: 'Rua Demo, 123, Porto',
        },
    });
    console.log(' Company created:', company1.name);
    const admin1Password = await bcrypt_1.default.hash('admin123', 10);
    const admin1 = await prisma.user.upsert({
        where: { email: 'admin@logistica.com' },
        update: {},
        create: {
            name: 'Admin Demo',
            email: 'admin@logistica.com',
            password: admin1Password,
            role: client_1.Role.ADMIN,
            companyId: company1.id,
        },
    });
    console.log(' Admin user created:', admin1.email);
    const operator1Password = await bcrypt_1.default.hash('operator123', 10);
    const operator1 = await prisma.user.upsert({
        where: { email: 'operator@logistica.com' },
        update: {},
        create: {
            name: 'Operator Demo',
            email: 'operator@logistica.com',
            password: operator1Password,
            role: client_1.Role.OPERATOR,
            companyId: company1.id,
        },
    });
    console.log(' Operator user created:', operator1.email);
    const supplier1 = await prisma.supplier.create({
        data: {
            name: 'Supplier Test Ltd',
            nif: '501000000',
            email: 'supplier@test.com',
            phone: '+351 220 100 000',
            address: 'Supplier Street, 456, Lisbon',
            city: 'Lisboa',
            state: 'Lisboa',
            companyId: company1.id,
        },
    });
    console.log(' Supplier created:', supplier1.name);
    const vehicle1 = await prisma.vehicle.create({
        data: {
            licensePlate: 'AB-12-CD',
            type: 'Truck',
            model: 'Mercedes Actros',
            brand: 'Mercedes',
            capacity: 10000,
            year: 2022,
            status: 'available',
            companyId: company1.id,
        },
    });
    console.log(' Vehicle created:', vehicle1.licensePlate);
    const products1 = await Promise.all([
        prisma.product.create({
            data: {
                internalCode: 'PROD-001',
                description: 'Test Product A - Electronics',
                quantity: 100,
                unit: 'UN',
                totalWeight: 50.5,
                totalVolume: 2.5,
                currentLocation: 'Warehouse A - Shelf 1',
                status: client_1.ProductStatus.IN_STORAGE,
                supplierId: supplier1.id,
                companyId: company1.id,
            },
        }),
        prisma.product.create({
            data: {
                internalCode: 'PROD-002',
                description: 'Test Product B - Textile',
                quantity: 250,
                unit: 'UN',
                totalWeight: 125.0,
                totalVolume: 5.0,
                currentLocation: 'Warehouse B - Zone 2',
                status: client_1.ProductStatus.RECEIVED,
                supplierId: supplier1.id,
                companyId: company1.id,
            },
        }),
        prisma.product.create({
            data: {
                internalCode: 'PROD-003',
                description: 'Test Product C - Food',
                quantity: 500,
                unit: 'KG',
                totalWeight: 500.0,
                totalVolume: 10.0,
                currentLocation: 'Warehouse C - Cold Room',
                status: client_1.ProductStatus.IN_ANALYSIS,
                supplierId: supplier1.id,
                companyId: company1.id,
            },
        }),
    ]);
    console.log(` ${products1.length} products created for Company 1`);
    await prisma.productMovement.create({
        data: {
            productId: products1[0].id,
            previousStatus: client_1.ProductStatus.RECEIVED,
            newStatus: client_1.ProductStatus.IN_STORAGE,
            quantity: 100,
            location: 'Warehouse A - Shelf 1',
            reason: 'Product approved and stored',
            userId: operator1.id,
        },
    });
    console.log(' Product movement created');
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
    const admin2Password = await bcrypt_1.default.hash('admin456', 10);
    const admin2 = await prisma.user.create({
        data: {
            name: 'Carlos Silva',
            email: 'carlos@transporte.com',
            password: admin2Password,
            role: client_1.Role.ADMIN,
            companyId: company2.id,
        },
    });
    console.log(' Admin user created:', admin2.email);
    const operator2Password = await bcrypt_1.default.hash('operator456', 10);
    const operator2 = await prisma.user.create({
        data: {
            name: 'Maria Santos',
            email: 'maria@transporte.com',
            password: operator2Password,
            role: client_1.Role.OPERATOR,
            companyId: company2.id,
        },
    });
    console.log(' Operator user created:', operator2.email);
    const supplier2 = await prisma.supplier.create({
        data: {
            name: 'North Supplier Lda',
            nif: '502000000',
            email: 'norte@fornecedor.com',
            phone: '+351 220 200 000',
            address: 'North Street, 321, Porto',
            city: 'Porto',
            state: 'Porto',
            companyId: company2.id,
        },
    });
    console.log(' Supplier created:', supplier2.name);
    const vehicle2 = await prisma.vehicle.create({
        data: {
            licensePlate: 'XY-34-ZW',
            type: 'Van',
            model: 'Sprinter',
            brand: 'Mercedes',
            capacity: 3500,
            year: 2023,
            status: 'available',
            companyId: company2.id,
        },
    });
    console.log(' Vehicle created:', vehicle2.licensePlate);
    const products2 = await Promise.all([
        prisma.product.create({
            data: {
                internalCode: 'TRANS-001',
                description: 'Packaging Material',
                quantity: 1000,
                unit: 'UN',
                totalWeight: 200.0,
                totalVolume: 15.0,
                currentLocation: 'Main Warehouse',
                status: client_1.ProductStatus.IN_STORAGE,
                supplierId: supplier2.id,
                companyId: company2.id,
            },
        }),
        prisma.product.create({
            data: {
                internalCode: 'TRANS-002',
                description: 'Wooden Pallets',
                quantity: 50,
                unit: 'UN',
                totalWeight: 1000.0,
                totalVolume: 25.0,
                currentLocation: 'Zona Exterior',
                status: client_1.ProductStatus.APPROVED,
                supplierId: supplier2.id,
                companyId: company2.id,
            },
        }),
    ]);
    console.log(` ${products2.length} products created for Company 2`);
    console.log('\n Creating audit logs...');
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
    console.log('\n SUPER ADMIN:');
    console.log('   Email: superadmin@sistema.com');
    console.log('   Password: superadmin123');
    console.log('   Role: SUPER_ADMIN');
    console.log('   Company: (sem empresa - acesso global)');
    console.log('\n COMPANY 1 - Logistics Demo Ltd');
    console.log('    Admin: superadmin@sistema.com /superadmin123');
    console.log('    Admin: admin@logistica.com / admin123');
    console.log('   Operator: operador@logistica.com / operator123');
    console.log(`    Products: ${products1.length}`);
    console.log(`    Vehicles: 1`);
    console.log(`    Suppliers: 1`);
    console.log('\nCOMPANY 2 - TransPorto Express Ltd');
    console.log('    Admin: carlos@transporte.com / admin456');
    console.log('    Operator: maria@transporte.com / operator456');
    console.log(`    Products: ${products2.length}`);
    console.log(`    Vehicles: 1`);
    console.log(`    Suppliers: 1`);
    console.log('\n' + '='.repeat(50));
    console.log('💡 TIP: Use o Super Admin para gerenciar todas as empresas!');
    console.log('='.repeat(50) + '\n');
}
main()
    .catch((e) => {
    console.error(' Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map