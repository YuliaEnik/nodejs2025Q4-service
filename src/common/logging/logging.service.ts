import { Injectable, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LogLevel } from './log-level.enum';

@Injectable({ scope: Scope.DEFAULT })
export class LoggingService {
  private logLevel: LogLevel;
  private maxFileSizeKB: number;
  private errorLogPath: string;
  private combinedLogPath: string;

  constructor() {
    this.logLevel = this.getLogLevelFromEnv();
    this.maxFileSizeKB = parseInt(process.env.LOG_MAX_FILE_SIZE_KB) || 10240;
    this.errorLogPath = process.env.LOG_ERROR_FILE_PATH || 'logs/errors.log';
    this.combinedLogPath =
      process.env.LOG_COMBINED_FILE_PATH || 'logs/combined.log';

    this.ensureLogDirectory();
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase();
    switch (level) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.LOG;
      case 'DEBUG':
        return LogLevel.DEBUG;
      case 'VERBOSE':
        return LogLevel.VERBOSE;
      default:
        return LogLevel.LOG;
    }
  }

  private ensureLogDirectory(): void {
    const errorDir = path.dirname(this.errorLogPath);
    const combinedDir = path.dirname(this.combinedLogPath);

    [errorDir, combinedDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private rotateFileIfNeeded(filePath: string): void {
    if (!fs.existsSync(filePath)) return;

    const stats = fs.statSync(filePath);
    const fileSizeInKB = stats.size / 1024;

    if (fileSizeInKB >= this.maxFileSizeKB) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedPath = `${filePath}.${timestamp}`;
      fs.renameSync(filePath, rotatedPath);
    }
  }

  private writeLog(filePath: string, message: string): void {
    this.rotateFileIfNeeded(filePath);
    fs.appendFileSync(filePath, message + '\n', 'utf8');
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    return `[${timestamp}] ${level}${contextStr}: ${message}`;
  }

  error(message: string, trace?: string, context?: string): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const formatted = this.formatMessage('ERROR', message, context);
    console.error(formatted);
    if (trace) console.error(trace);

    this.writeLog(this.errorLogPath, formatted);
    if (trace) this.writeLog(this.errorLogPath, `Trace: ${trace}`);

    this.writeLog(this.combinedLogPath, formatted);
  }

  warn(message: string, context?: string): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const formatted = this.formatMessage('WARN', message, context);
    console.warn(formatted);
    this.writeLog(this.combinedLogPath, formatted);
  }

  log(message: string, context?: string): void {
    if (!this.shouldLog(LogLevel.LOG)) return;

    const formatted = this.formatMessage('INFO', message, context);
    console.log(formatted);
    this.writeLog(this.combinedLogPath, formatted);
  }

  debug(message: string, context?: string): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formatted = this.formatMessage('DEBUG', message, context);
    console.debug(formatted);
    this.writeLog(this.combinedLogPath, formatted);
  }

  verbose(message: string, context?: string): void {
    if (!this.shouldLog(LogLevel.VERBOSE)) return;

    const formatted = this.formatMessage('VERBOSE', message, context);
    console.log(formatted);
    this.writeLog(this.combinedLogPath, formatted);
  }
}
