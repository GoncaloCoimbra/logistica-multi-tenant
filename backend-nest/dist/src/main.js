"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
BigInt.prototype.toJSON = function () {
    const int = Number(this.toString());
    return int > Number.MAX_SAFE_INTEGER ? this.toString() : int;
};
Date.prototype.toJSON = function () {
    return this.toISOString();
};
async function createApp() {
    const logger = new common_1.Logger('Bootstrap');
    if (!process.env.DATABASE_URL) {
        logger.error('✖ DATABASE_URL is not set. copy .env.example and configure the database connection.');
        throw new Error('Missing DATABASE_URL');
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    app.setGlobalPrefix('api');
    logger.log('📌 Prefixo global configurado: /api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    logger.log(' Validation Pipe configurado');
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';
    app.enableCors({
        origin: [
            corsOrigin,
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:3001',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
    });
    logger.log('🌐 CORS enabled for:', corsOrigin);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Logistics Multi-Tenant API')
        .setDescription('Complete API documentation for multi-tenant logistics management')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addApiKey({ type: 'apiKey', in: 'header', name: 'x-tenant-id' }, 'tenant-id')
        .addTag('Auth', 'Authentication and authorization endpoints')
        .addTag('Users', 'User management')
        .addTag('Products', 'Product management')
        .addTag('Vehicles', 'Vehicle management')
        .addTag('Transports', 'Transport management')
        .addTag('Companies', 'Company management')
        .addTag('Audit', 'Logs de auditoria')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    logger.log('📖 Swagger/OpenAPI available at: /api/docs');
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    logger.log('📁 Pasta de uploads configurada: /uploads/');
    logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.log('✅ Aplicação Nest pronta (sem listener).');
    logger.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return app;
}
if (process.env.NODE_ENV !== 'test') {
    (async () => {
        const app = await createApp();
        const port = process.env.PORT || 3000;
        await app.listen(port);
    })();
}
//# sourceMappingURL=main.js.map