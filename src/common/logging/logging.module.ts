import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { LoggingMiddleware } from './logging.middleware';
import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
  providers: [
    LoggingService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [LoggingService],
})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
