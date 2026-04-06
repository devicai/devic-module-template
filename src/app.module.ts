import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { loadConfig, CONFIG } from './config/config.loader';
import { EXTENSIONS_TOKEN, applyExtensions } from './providers/extensions.provider';
import { ExtensionScopeInterceptor } from './interceptors/extension-scope.interceptor';
import { HealthController } from './health/health.controller';
import { Example, ExampleSchema } from './schemas/example.schema';

// --- Load config at module evaluation time ---
const config = loadConfig();

// --- Apply extensions to schemas before model registration ---
applyExtensions(ExampleSchema, 'Example', config.extensions.properties);
// Add more: applyExtensions(OtherSchema, 'Other', config.extensions.properties);

@Module({
  imports: [
    MongooseModule.forRoot(config.database.uri ?? 'mongodb://localhost:27017/module'),
    MongooseModule.forFeature([{ name: Example.name, schema: ExampleSchema }]),
  ],
  controllers: [
    HealthController,
    // Add your controllers here
  ],
  providers: [
    // --- Config & extensions available for injection ---
    {
      provide: CONFIG,
      useValue: config,
    },
    {
      provide: EXTENSIONS_TOKEN,
      useValue: config.extensions.properties,
    },
    // --- Global interceptor: resolves extension scope from headers ---
    {
      provide: APP_INTERCEPTOR,
      useClass: ExtensionScopeInterceptor,
    },
    // Add your services and repositories here
  ],
})
export class AppModule {}
