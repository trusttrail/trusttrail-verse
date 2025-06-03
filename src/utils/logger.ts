type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment: boolean;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    };

    // Keep log history for debugging
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    return entry;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    // In production, only log warnings and errors
    return level === 'warn' || level === 'error';
  }

  debug(message: string, data?: any) {
    const entry = this.createLogEntry('debug', message, data);
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG] ${entry.timestamp}: ${message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${entry.timestamp}: ${message}`, data || '');
    }
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${entry.timestamp}: ${message}`, data || '');
    }
  }

  error(message: string, data?: any) {
    const entry = this.createLogEntry('error', message, data);
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${entry.timestamp}: ${message}`, data || '');
    }

    // In production, you could send errors to a monitoring service here
    // Example: sendToMonitoringService(entry);
  }

  // Get recent logs for debugging
  getRecentLogs(count: number = 10): LogEntry[] {
    return this.logHistory.slice(-count);
  }

  // Clear log history
  clearHistory() {
    this.logHistory = [];
  }
}

export const logger = new Logger();

// Convenience functions for easier migration from console.log
export const logDebug = (message: string, data?: any) => logger.debug(message, data);
export const logInfo = (message: string, data?: any) => logger.info(message, data);
export const logWarn = (message: string, data?: any) => logger.warn(message, data);
export const logError = (message: string, data?: any) => logger.error(message, data);
