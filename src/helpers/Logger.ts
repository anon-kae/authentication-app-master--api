import environment from '@/configs/environment';
import * as formats from '@/configs/logFormat';
import * as winston from 'winston';
import contextStorage from '@/configs/contextStorage';
import { LoggingWinston as StackdriverLogging } from '@google-cloud/logging-winston';
import * as packageJson from '../../package.json';

/**
 * Logger
 */
class Logger {
  private static masterLogger: winston.Logger;
  private static project: string = packageJson.name;
  private static version: string = packageJson.version;
  private readonly _label: string | null = null;

  /**
   * Constructor
   * @param {string|null} label Log label
   */
  public constructor(label: string | null = null) {
    this._label = label;
  }

  /**
   * Initialize the default logger
   * @returns {void} Nothing
   */
  public static initialize() {
    if (this.masterLogger) return;

    const transports: winston.transport[] = [];

    const consoleTransport = new winston.transports.Console({
      level: environment.LOG_LEVEL ?? 'debug',
      format: formats.plain,
    });

    transports.push(consoleTransport);

    if (environment.LOG_STACKDRIVER_CREDENTIALS) {
      const stackdriverLogging = new StackdriverLogging({
        keyFilename: environment.LOG_STACKDRIVER_CREDENTIALS,
        serviceContext: {
          service: `${String(environment.NODE_ENV).toLowerCase()}-${
            this.project
          }`,
          version: this.version,
        },
        logName: `${String(environment.NODE_ENV).toLowerCase()}-${
          this.project
        }`,
        resource: {
          type: 'global',
          labels: {},
        },
        labels: {}, // labels can be added later via log metadata
        levels: winston.config.syslog.levels,
        level: 'debug', // set to debug to send all log to GCP, filter later in GCP logging
        format: formats.json,
      });

      transports.push(stackdriverLogging);
    }

    this.masterLogger = winston.createLogger({
      levels: winston.config.syslog.levels,
      format: formats.default, // as default
      transports,
    });
  }

  /**
   * Create a new logger based on specified log label
   * @param {string} label Log label
   * @returns {Logger} Logger instance
   */
  public label(label: string): Logger {
    return new Logger(label);
  }

  /**
   * Format log metadata
   * @param {*} metadata Log metadata
   * @returns {*} Formatted log metadata
   * @private
   */
  private formatLogMetadata(metadata: any) {
    const requestId = contextStorage.get('requestId') || '<--- no request --->';
    const userId = contextStorage.get('userId') || -1;
    const label = this._label ?? this.getAutomaticLabel();

    return {
      project: Logger.project,
      label: label,
      action: label,
      requestId,
      userId,
      [label]: metadata,
    };
  }

  /**
   * Get automatic logLabel
   * @return {string} Automatic logLabel
   */
  getAutomaticLabel(): string {
    /*
     * Stack trace looks like this:
     * Error
     *    at Logger.getAutomaticLabel (C:\Users\user\Documents\GitHub\firebase-functions-typescript\client-api\src\helpers\Logger.ts:100:23)
     *    at Logger.formatLogMetadata (C:\Users\user\Documents\GitHub\firebase-functions-typescript\client-api\src\helpers\Logger.ts:81:22)
     *    at Logger.debug (C:\Users\user\Documents\GitHub\firebase-functions-typescript\client-api\src\helpers\Logger.ts:26:16)
     *    at ClientRepository.findById (C:\Users\user\Documents\GitHub\firebase-functions-typescript\client-api\src\repositories\ClientRepository.ts:50:13)
     *    ...
     *
     * So we split the stack trace by new line, and get the 5th line (index 4)
     */
    const [, , , , stackTrace]: Array<string> = String(new Error().stack).split(
      '\n',
    );
    const matches = stackTrace.match(/[/\\]([a-zA-Z0-9-_.]+)\.[jt]s/);

    const [, label = 'Unknown'] = matches ?? [];

    return label;
  }

  /**
   * Debug Log
   * @param {string} message Log message
   * @param {Object.<string, any>} metadata Log metadata
   * @returns {void} Nothing
   */
  public debug(message: string, metadata: { [key: string]: any } = {}): void {
    Logger.masterLogger.debug(message, this.formatLogMetadata(metadata));
  }

  /**
   * Info Log
   * @param {string} message Log message
   * @param {Object.<string, any>} metadata Log metadata
   * @returns {void} Nothing
   */
  public info(message: string, metadata: { [key: string]: any } = {}): void {
    Logger.masterLogger.info(message, this.formatLogMetadata(metadata));
  }

  /**
   * Warning Log
   * @param {string} message Log message
   * @param {Object.<string, any>} metadata Log metadata
   * @returns {void} Nothing
   */
  public warning(message: string, metadata: { [key: string]: any } = {}): void {
    Logger.masterLogger.warning(message, this.formatLogMetadata(metadata));
  }

  /**
   * Error Log
   * @param {string} message Log message
   * @param {Object.<string, any>} metadata Log metadata
   * @returns {void} Nothing
   */
  public error(message: string, metadata: { [key: string]: any } = {}): void {
    Logger.masterLogger.error(message, this.formatLogMetadata(metadata));
  }

  /**
   * Morgan logger
   * @param {string} morganMessage JSON-based morgan message
   * @returns {void} Nothing
   */
  morgan(morganMessage: string) {
    try {
      const { message, httpRequest = {} } = JSON.parse(morganMessage);
      const logMetadata = this.formatLogMetadata({});

      this.info(message || 'http request', { ...logMetadata, httpRequest });
    } catch (error) {
      this.error(
        `Failed to parse morgan log message, logging as plain text instead. Message: ${morganMessage}`,
        {
          error,
          message: morganMessage,
        },
      );
    }
  }
}

Logger.initialize();

export default new Logger();
