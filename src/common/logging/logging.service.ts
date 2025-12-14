import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private logLevels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];
  private currentLogLevel: LogLevel = 'log';
  private logDir = 'logs';
  private logFilePath: string;
  private errorLogFilePath: string;
  private maxFileSizeBytes: number;

  constructor() {
    this.setLogLevelFromEnv();
    this.setupFileLogging();
  }

  private setLogLevelFromEnv(): void {
    const level = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    if (level && this.logLevels.includes(level)) {
      this.currentLogLevel = level;
    }
  }

  private setupFileLogging(): void {
    const appLogDir = path.join(this.logDir, 'app');
    if (!fs.existsSync(appLogDir)) {
      fs.mkdirSync(appLogDir, { recursive: true });
    }

    this.logFilePath = path.join(appLogDir, 'app.log');
    this.errorLogFilePath = path.join(appLogDir, 'error.log');

    [this.logFilePath, this.errorLogFilePath].forEach((filePath) => {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        console.log(`Created log file: ${filePath}`);
      }
    });

    this.maxFileSizeBytes =
      (parseInt(process.env.LOG_MAX_FILE_SIZE_KB) || 10240) * 1024;
  }

  private shouldLog(level: LogLevel): boolean {
    const messageLevelIndex = this.logLevels.indexOf(level);
    const currentLevelIndex = this.logLevels.indexOf(this.currentLogLevel);
    return messageLevelIndex <= currentLevelIndex;
  }

  private rotateFileIfNeeded(filePath: string): void {
    if (!fs.existsSync(filePath)) return;

    try {
      const stats = fs.statSync(filePath);
      if (stats.size > this.maxFileSizeBytes) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const baseName = path.basename(filePath, ext);
        const newPath = path.join(dir, `${baseName}-${timestamp}${ext}`);

        fs.renameSync(filePath, newPath);
        console.log(`Log file rotated: ${filePath} -> ${newPath}`);
      }
    } catch (error) {
      console.error('File rotation error:', error);
    }
  }

  private writeToFile(
    message: string,
    filePath: string,
    isError = false,
  ): void {
    try {
      this.rotateFileIfNeeded(filePath);
      const formattedMessage = `${new Date().toISOString()} - ${message}\n`;
      fs.appendFileSync(filePath, formattedMessage);

      if (isError) {
        console.error(message);
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error(`Failed to write to file ${filePath}:`, error);
    }
  }

  private createLogMessage(
    level: string,
    message: any,
    context?: string,
  ): string {
    const msg =
      typeof message === 'object' ? JSON.stringify(message) : String(message);
    return `[${level.toUpperCase()}]${context ? ` [${context}]` : ''} ${msg}`;
  }

  log(message: any, context?: string): void {
    if (this.shouldLog('log')) {
      const logMessage = this.createLogMessage('INFO', message, context);
      this.writeToFile(logMessage, this.logFilePath);
    }
  }

  error(message: any, trace?: string, context?: string): void {
    if (this.shouldLog('error')) {
      const logMessage = this.createLogMessage('ERROR', message, context);
      const fullMessage = trace ? `${logMessage}\n${trace}` : logMessage;

      this.writeToFile(logMessage, this.logFilePath, true);

      this.writeToFile(fullMessage, this.errorLogFilePath, true);
    }
  }

  warn(message: any, context?: string): void {
    if (this.shouldLog('warn')) {
      const logMessage = this.createLogMessage('WARN', message, context);
      this.writeToFile(logMessage, this.logFilePath);
    }
  }

  debug(message: any, context?: string): void {
    if (this.shouldLog('debug')) {
      const logMessage = this.createLogMessage('DEBUG', message, context);
      this.writeToFile(logMessage, this.logFilePath);
    }
  }

  verbose(message: any, context?: string): void {
    if (this.shouldLog('verbose')) {
      const logMessage = this.createLogMessage('VERBOSE', message, context);
      this.writeToFile(logMessage, this.logFilePath);
    }
  }
}
