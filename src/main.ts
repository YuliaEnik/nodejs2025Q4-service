import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingService } from './common/logging/logging.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggingService = app.get(LoggingService);
  const reflector = app.get(Reflector);

  app.useLogger(loggingService);

  app.useGlobalGuards(new JwtAuthGuard(reflector));

  process.on('uncaughtException', (error: Error) => {
    loggingService.error(
      `Uncaught Exception: ${error.message}`,
      error.stack,
      'Process',
    );
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    loggingService.error(
      `Unhandled Rejection at: ${promise} - Reason: ${reason}`,
      new Error().stack,
      'Process',
    );
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);

  loggingService.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
}

bootstrap();
