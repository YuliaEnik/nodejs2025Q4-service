import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingService } from './common/logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

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

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
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
