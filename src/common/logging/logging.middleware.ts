import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, ip, body, query } = request;
    const startTime = Date.now();

    this.loggingService.debug(
      `Incoming Request: ${method} ${originalUrl} from IP: ${ip}`,
      'HTTP Request',
    );

    if (Object.keys(body).length > 0) {
      this.loggingService.verbose(
        `Request Body: ${JSON.stringify(body)}`,
        'HTTP Request',
      );
    }

    if (Object.keys(query).length > 0) {
      this.loggingService.verbose(
        `Query Params: ${JSON.stringify(query)}`,
        'HTTP Request',
      );
    }

    const originalSend = response.send;
    response.send = function (body: any): Response {
      const responseTime = Date.now() - startTime;
      const { statusCode } = response;

      const loggingService =
        (request as any).loggingService || new LoggingService();

      let logLevel = 'log';
      if (statusCode >= 500) {
        logLevel = 'error';
      } else if (statusCode >= 400) {
        logLevel = 'warn';
      }

      const logMessage = `Response: ${method} ${originalUrl} - Status: ${statusCode} - Time: ${responseTime}ms`;

      switch (logLevel) {
        case 'error':
          loggingService.error(logMessage, undefined, 'HTTP Response');
          break;
        case 'warn':
          loggingService.warn(logMessage, 'HTTP Response');
          break;
        default:
          loggingService.log(logMessage, 'HTTP Response');
      }

      return originalSend.call(this, body);
    };

    next();
  }
}
