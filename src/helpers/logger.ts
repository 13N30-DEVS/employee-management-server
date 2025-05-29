import { FastifyRequest } from "fastify";

enum Severity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

class Logger {
  /**
   * Logs a message with the given severity. If request is provided, the log message
   * includes the request data. If error is provided, the log message includes the error
   * message.
   *
   * @param {Severity} severity - The severity of the log message.
   * @param {string} message - The log message.
   * @param {Error | false | any} [error] - The error to log.
   * @param {FastifyRequest} [request] - The request to log.
   * @param {string} [module] - The module name to log.
   */
  private static log(
    severity: Severity,
    message: string,
    error?: Error | false | any,
    request?: FastifyRequest,
    module?: string
  ) {
    const timestamp = new Date().toISOString();

    let logMessage = `\x1b[2m[${timestamp}]`;

    switch (severity) {
      case Severity.INFO:
        logMessage += `\x1b[34m [${severity}]`;
        break;
      case Severity.WARNING:
        logMessage += `\x1b[33m [${severity}]`;
        break;
      case Severity.ERROR:
        logMessage += `\x1b[31m [${severity}]`;
        break;
      default:
        logMessage += ` [${severity}]`;
    }

    if (module) {
      logMessage += `\x1b[36m [${module}]`;
    }

    const requestFormat: any = {
      url: request?.url,
      host: request?.ip,
      method: request?.method,
      hostname: request?.hostname,
      headers: request?.headers,
      body: request?.body,
      query: request?.query,
      params: request?.params,
      ip: request?.ip,
      "X-Forwarded-For": request?.ips,
      protocol: request?.protocol,
    };

    if (request) {
      logMessage += `\x1b[32m [Request: ${JSON.stringify(
        requestFormat,
        null,
        4
      )}]`;
    }

    logMessage += `\x1b[0m ${message}`;

    if (error) {
      logMessage += `\x1b[31m: ${error.message}\x1b[0m`;
    }

    console.log(logMessage);
  }

  /**
   * Logs an info message. If request is provided, the log message includes the request
   * data. If module is provided, the log message includes the module name.
   *
   * @param {FastifyRequest} request - The request to log.
   * @param {string} message - The log message.
   * @param {string} [module] - The module name to log.
   */
  static info(request: FastifyRequest, message: string, module?: string) {
    Logger.log(Severity.INFO, message, undefined, request, module);
  }

  /**
   * Logs a warning message. If request is provided, the log message includes the request
   * data. If module is provided, the log message includes the module name.
   *
   * @param {FastifyRequest} request - The request to log.
   * @param {string} message - The log message.
   * @param {string} [module] - The module name to log.
   */
  static warning(request: FastifyRequest, message: string, module?: string) {
    Logger.log(Severity.WARNING, message, undefined, request, module);
  }

  /**
   * Logs an error message. If request is provided, the log message includes the request
   * data. If module is provided, the log message includes the module name. If error is
   * provided, the log message includes the error message and stack trace.
   *
   * @param {FastifyRequest} request - The request to log.
   * @param {string} message - The log message.
   * @param {Error | false | any} [error] - The error to log. If false, the error is
   *   not logged.
   * @param {string} [module] - The module name to log.
   */
  static error(
    request: FastifyRequest,
    message: string,
    error?: Error | false | any,
    module?: string
  ) {
    Logger.log(Severity.ERROR, message, error, request, module);
  }
}

export { Logger };
