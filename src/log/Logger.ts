/* eslint-disable no-console */
type level = 'debug' | 'info' | 'warn' | 'error' | 'none';

const levels = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  none: 10,
}

export default class Logger {

  private loggerName: string;
  private static configuredLevel: level = (process?.env?.LOG_LEVEL as level) || 'error';

  private constructor(loggerName: string) {
    this.loggerName = loggerName;
  }

  public static configure(options: { level: level }): void {
    Logger.configuredLevel = options.level;
  }

  public static getLogger(loggerName: string): Logger {
    return new Logger(loggerName);
  }

  public subLogger(name: string): Logger {
    return new Logger(`${this.loggerName}.${name}`);
  }

  public debug(message: any, obj?: {}): void {
    if (this.allowLevel('debug'))
      console.debug(this.format(message), obj);
  }

  public info(message: any, ...optionalParams: any[]): void {
    if (this.allowLevel('info'))
      console.info(this.format(message), ...optionalParams);
  }

  public warn(message: any, obj?: {}): void {
    if (this.allowLevel('warn'))
      console.warn(this.format(message), obj);
  }

  public error(message: any, obj?: {}): void {
    if (this.allowLevel('error'))
      console.error(this.format(message), obj);
  }

  private format(message: any): string {
    return `${this.loggerName}: ${message}`;
  }

  private allowLevel(level: level): boolean {
    return levels[level] >= levels[Logger.configuredLevel];
  }
}
