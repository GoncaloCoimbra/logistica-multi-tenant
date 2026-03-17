import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// SERIALIZATION FIX (BigInt/Date)

(BigInt.prototype as any).toJSON = function () {
  const int = Number(this.toString());
  return int > Number.MAX_SAFE_INTEGER ? this.toString() : int;
};

(Date.prototype as any).toJSON = function () {
  return this.toISOString();
};

export async function createApp(): Promise<NestExpressApplication> {
  const logger = new Logger('Bootstrap');

  // ensure required env vars
  if (!process.env.DATABASE_URL) {
    logger.error(
      '✖ DATABASE_URL is not set. copy .env.example and configure the database connection.',
    );
    throw new Error('Missing DATABASE_URL');
  }

  // CREATE NEST APPLICATION
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // GLOBAL PREFIX (/api)

  app.setGlobalPrefix('api');
  logger.log('📌 Prefixo global configurado: /api');

  // VALIDATION PIPE

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  logger.log(' Validation Pipe configurado');

  // CORS CONFIGURATION

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';

  app.enableCors({
    origin: [
      corsOrigin,
      'http://localhost:3000',
      'http://localhost:5173', // Vite
      'http://localhost:3001', // Create React App
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  });
  logger.log('🌐 CORS enabled for:', corsOrigin);

  // SWAGGER / OPENAPI DOCUMENTATION
  const config = new DocumentBuilder()
    .setTitle('Logistics Multi-Tenant API')
    .setDescription(
      'Complete API documentation for multi-tenant logistics management',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'x-tenant-id' },
      'tenant-id',
    )
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addTag('Users', 'User management')
    .addTag('Products', 'Product management')
    .addTag('Vehicles', 'Vehicle management')
    .addTag('Transports', 'Transport management')
    .addTag('Companies', 'Company management')
    .addTag('Audit', 'Logs de auditoria')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  logger.log('📖 Swagger/OpenAPI available at: /api/docs');

  // STATIC ASSETS (Uploads)

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  logger.log('📁 Pasta de uploads configurada: /uploads/');

  // INITIALIZATION LOGS (just information — `listen` is controlled by the caller)
  logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.log('✅ NestJS application ready (no listener).');
  logger.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return app;
}

// Only start the server when not in test environment.
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    const app = await createApp();
    const port = process.env.PORT || 3000;
    await app.listen(port);
  })();
}
