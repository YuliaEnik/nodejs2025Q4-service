import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logLevel: number;

  constructor(context?: string) {
    super(context);
    this.setLogLevelFromEnv();
  }

  private setLogLevelFromEnv(): void {
    const level = process.env.LOG_LEVEL?.toUpperCase();
    switch (level) {
      case 'ERROR':
        this.logLevel = 0;
        break;
      case 'WARN':
        this.logLevel = 1;
        break;
      case 'INFO':
        this.logLevel = 2;
        break;
      case 'DEBUG':
        this.logLevel = 3;
        break;
      case 'VERBOSE':
        this.logLevel = 4;
        break;
      default:
        this.logLevel = 2; // default INFO
    }
  }

  private shouldLog(level: number): boolean {
    return level <= this.logLevel;
  }

  error(message: any, trace?: string, context?: string): void {
    if (this.shouldLog(0)) {
      super.error(message, trace, context);
    }
  }

  warn(message: any, context?: string): void {
    if (this.shouldLog(1)) {
      super.warn(message, context);
    }
  }

  log(message: any, context?: string): void {
    if (this.shouldLog(2)) {
      super.log(message, context);
    }
  }

  debug(message: any, context?: string): void {
    if (this.shouldLog(3)) {
      super.debug(message, context);
    }
  }

  verbose(message: any, context?: string): void {
    if (this.shouldLog(4)) {
      super.verbose(message, context);
    }
  }
}
