import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { loadConfig } from './config/config.loader';

async function bootstrap() {
  const config = loadConfig();
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: config.logging?.level
      ? [config.logging.level, 'error', 'warn']
      : ['log', 'error', 'warn'],
  });

  // Global prefix
  const basePath = config.server.basePath ?? '/api/v1';
  app.setGlobalPrefix(basePath, { exclude: ['health', 'health/ready'] });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  if (config.server.cors?.enabled) {
    app.enableCors({
      origin: config.server.cors.origins,
    });
  }

  // Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Devic OS Module')
    .setDescription('Auto-generated API documentation')
    .setVersion(process.env.npm_package_version ?? '0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${basePath}/docs`, app, document);

  // Start
  const port = config.server.port ?? 3100;
  await app.listen(port);

  logger.log(`Service running on port ${port}`);
  logger.log(`API docs: http://localhost:${port}${basePath}/docs`);

  if (config.extensions.properties.length > 0) {
    const extNames = config.extensions.properties.map((e) => e.name).join(', ');
    logger.log(`Entity extensions active: ${extNames}`);
  } else {
    logger.log('No entity extensions configured (standalone mode)');
  }
}

bootstrap();
