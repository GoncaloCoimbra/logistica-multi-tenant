"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const helmet = __importStar(require("helmet"));
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
    app.use(helmet());
    logger.log('🔒 Security headers configured with Helmet');
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
        res.removeHeader('X-Powered-By');
        next();
    });
    logger.log('🔐 Additional security headers configured');
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
    logger.log('✅ NestJS application ready (no listener).');
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