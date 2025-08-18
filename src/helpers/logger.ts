import { FastifyRequest } from "fastify";
import { env } from "@config";

enum Severity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

interface LogContext {
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  module?: string;
}

class Logger {
  private static formatMessage(
    severity: Severity,
    message: string,
    context?: LogContext,
    error?: unknown
  ): string {
    const timestamp = new Date().toISOString();
    const logData: any = {
      timestamp,
      level: severity,
      message,
      ...context,
    };

    if (error) {
      if (error instanceof Error) {
        logData.error = {
          name: error.name,
          message: error.message,
          stack: env.NODE_ENV === "development" ? error.stack : undefined,
        };
      } else if (typeof error === "string") {
        logData.error = { message: error };
      } else {
        logData.error = error;
      }
    }

    // In production, use structured JSON logging
    if (env.NODE_ENV === "production") {
      return JSON.stringify(logData);
    }

    // In development, use colored console output
    let logMessage = `\x1b[2m[${timestamp}]`;

    switch (severity) {
      case Severity.INFO:
        logMessage += `\x1b[34m [${severity}]\x1b[0m`;
        break;
      case Severity.WARNING:
        logMessage += `\x1b[33m [${severity}]\x1b[0m`;
        break;
      case Severity.ERROR:
        logMessage += `\x1b[31m [${severity}]\x1b[0m`;
        break;
      case Severity.DEBUG:
        logMessage += `\x1b[36m [${severity}]\x1b[0m`;
        break;
    }

    if (context?.module) {
      logMessage += `\x1b[36m [${context.module}]\x1b[0m`;
    }

    logMessage += ` ${message}`;

    if (error) {
      if (error instanceof Error) {
        logMessage += `\x1b[31m: ${error.message}\x1b[0m`;
      } else if (typeof error === "string") {
        logMessage += `\x1b[31m: ${error}\x1b[0m`;
      } else {
        logMessage += `\x1b[31m: ${JSON.stringify(error)}\x1b[0m`;
      }
    }

    return logMessage;
  }

  private static extractContext(request?: FastifyRequest): LogContext {
    if (!request) return {};

    return {
      requestId: request.id,
      userId: (request.user as any)?.id,
      ip: request.ip,
      userAgent: request.headers["user-agent"],
      method: request.method,
      url: request.url,
    };
  }

  private static log(
    severity: Severity,
    message: string,
    context?: LogContext,
    error?: unknown
  ): void {
    const logContext = {
      ...context,
      environment: env.NODE_ENV,
      service: "ems-backend",
    };

    const formattedMessage = this.formatMessage(
      severity,
      message,
      logContext,
      error
    );

    switch (severity) {
      case Severity.ERROR:
        console.error(formattedMessage);
        break;
      case Severity.WARNING:
        console.warn(formattedMessage);
        break;
      case Severity.DEBUG:
        if (env.NODE_ENV === "development") {
          console.debug(formattedMessage);
        }
        break;
      default:
        console.log(formattedMessage);
    }
  }

  static info(request: FastifyRequest, message: string, module?: string): void {
    const context = this.extractContext(request);
    if (module) context.module = module;
    this.log(Severity.INFO, message, context);
  }

  static warning(
    request: FastifyRequest,
    message: string,
    module?: string
  ): void {
    const context = this.extractContext(request);
    if (module) context.module = module;
    this.log(Severity.WARNING, message, context);
  }

  static error(
    request: FastifyRequest,
    message: string,
    error?: unknown,
    module?: string
  ): void {
    const context = this.extractContext(request);
    if (module) context.module = module;
    this.log(Severity.ERROR, message, context, error);
  }

  static debug(
    request: FastifyRequest,
    message: string,
    module?: string
  ): void {
    if (env.NODE_ENV === "development") {
      const context = this.extractContext(request);
      if (module) context.module = module;
      this.log(Severity.DEBUG, message, context);
    }
  }

  // Performance logging
  static performance(
    request: FastifyRequest,
    operation: string,
    duration: number,
    module?: string
  ): void {
    const context = this.extractContext(request);
    context.responseTime = duration;
    if (module) context.module = module;

    this.log(
      Severity.INFO,
      `Performance: ${operation} completed in ${duration}ms`,
      context
    );
  }

  // Security logging
  static security(
    request: FastifyRequest,
    event: string,
    details?: any,
    module?: string
  ): void {
    const context = this.extractContext(request);
    if (module) context.module = module;

    this.log(Severity.WARNING, `Security: ${event}`, context, details);
  }
}

export { Logger, LogContext };
