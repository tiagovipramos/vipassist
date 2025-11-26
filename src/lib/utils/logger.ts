/**
 * Sistema de Logging Estruturado
 * Logs padronizados para toda a aplicação
 */

import { FEATURES } from '@/lib/config/features'

// Níveis de log
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

// Contexto do log
export interface LogContext {
  userId?: string
  requestId?: string
  ip?: string
  userAgent?: string
  [key: string]: any
}

// Estrutura do log
export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
  metadata?: Record<string, any>
}

/**
 * Classe principal de logging
 */
class Logger {
  private serviceName: string

  constructor(serviceName: string) {
    this.serviceName = serviceName
  }

  /**
   * Formata e registra um log
   */
  private log(level: LogLevel, message: string, context?: LogContext, error?: Error, metadata?: Record<string, any>) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: `[${this.serviceName}] ${message}`,
      context,
      metadata,
    }

    // Adicionar informações do erro se fornecido
    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: FEATURES.ENABLE_DEBUG_LOGS ? error.stack : undefined,
      }
    }

    // Em produção, enviar para serviço de logging (Sentry, CloudWatch, etc)
    // Em desenvolvimento, apenas console
    if (FEATURES.ENABLE_DEBUG_LOGS) {
      this.logToConsole(logEntry)
    }

    // TODO: Enviar para serviço de logging em produção
    // if (FEATURES.ENABLE_SENTRY) {
    //   this.logToSentry(logEntry)
    // }

    return logEntry
  }

  /**
   * Log para console (desenvolvimento)
   */
  private logToConsole(entry: LogEntry) {
    const color = this.getColorForLevel(entry.level)
    const prefix = `${color}[${entry.level}]${'\x1b[0m'}`
    
    console.log(`${prefix} ${entry.message}`)
    
    if (entry.context) {
      console.log('  Context:', entry.context)
    }
    
    if (entry.metadata) {
      console.log('  Metadata:', entry.metadata)
    }
    
    if (entry.error) {
      console.error('  Error:', entry.error.message)
      if (entry.error.stack) {
        console.error('  Stack:', entry.error.stack)
      }
    }
  }

  /**
   * Cores para cada nível de log
   */
  private getColorForLevel(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.FATAL]: '\x1b[35m', // Magenta
    }
    return colors[level] || '\x1b[0m'
  }

  /**
   * Métodos públicos de logging
   */
  debug(message: string, context?: LogContext, metadata?: Record<string, any>) {
    if (FEATURES.ENABLE_DEBUG_LOGS) {
      return this.log(LogLevel.DEBUG, message, context, undefined, metadata)
    }
  }

  info(message: string, context?: LogContext, metadata?: Record<string, any>) {
    return this.log(LogLevel.INFO, message, context, undefined, metadata)
  }

  warn(message: string, context?: LogContext, metadata?: Record<string, any>) {
    return this.log(LogLevel.WARN, message, context, undefined, metadata)
  }

  error(message: string, error?: Error, context?: LogContext, metadata?: Record<string, any>) {
    return this.log(LogLevel.ERROR, message, context, error, metadata)
  }

  fatal(message: string, error?: Error, context?: LogContext, metadata?: Record<string, any>) {
    return this.log(LogLevel.FATAL, message, context, error, metadata)
  }
}

/**
 * Factory para criar loggers
 */
export function createLogger(serviceName: string): Logger {
  return new Logger(serviceName)
}

/**
 * Logger padrão da aplicação
 */
export const logger = createLogger('VIP-ASSIST')
