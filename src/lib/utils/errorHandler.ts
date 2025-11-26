/**
 * Sistema de Tratamento de Erros Padronizado
 * Centraliza o tratamento de erros em toda a aplicação
 */

import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { createLogger } from './logger'
import { ValidationError } from './validation'
import { RateLimitError } from './rateLimit'

const logger = createLogger('ErrorHandler')

/**
 * Tipos de erro da aplicação
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
}

/**
 * Classe base para erros da aplicação
 */
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Erros específicos
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      ErrorType.NOT_FOUND,
      id ? `${resource} com ID ${id} não encontrado` : `${resource} não encontrado`,
      404
    )
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(ErrorType.UNAUTHORIZED, message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(ErrorType.FORBIDDEN, message, 403)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(ErrorType.CONFLICT, message, 409)
  }
}

/**
 * Identifica o tipo de erro
 */
function identifyError(error: unknown): {
  type: ErrorType
  message: string
  statusCode: number
  details?: any
} {
  // Erro da aplicação
  if (error instanceof AppError) {
    return {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    }
  }

  // Erro de rate limit
  if (error instanceof RateLimitError) {
    return {
      type: ErrorType.RATE_LIMIT,
      message: error.message,
      statusCode: 429,
      details: {
        retryAfter: error.retryAfter,
        resetAt: new Date(error.resetAt).toISOString(),
      },
    }
  }

  // Erro de validação (Zod)
  if (error instanceof ZodError) {
    return {
      type: ErrorType.VALIDATION,
      message: 'Erro de validação',
      statusCode: 400,
      details: error.issues.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    }
  }

  // Erro de validação customizado
  if (error instanceof ValidationError) {
    return {
      type: ErrorType.VALIDATION,
      message: 'Erro de validação',
      statusCode: 400,
      details: error.errors,
    }
  }

  // Erros do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return {
          type: ErrorType.CONFLICT,
          message: 'Registro duplicado',
          statusCode: 409,
          details: { field: error.meta?.target },
        }
      case 'P2025': // Record not found
        return {
          type: ErrorType.NOT_FOUND,
          message: 'Registro não encontrado',
          statusCode: 404,
        }
      case 'P2003': // Foreign key constraint
        return {
          type: ErrorType.CONFLICT,
          message: 'Violação de integridade referencial',
          statusCode: 409,
        }
      default:
        return {
          type: ErrorType.DATABASE,
          message: 'Erro no banco de dados',
          statusCode: 500,
        }
    }
  }

  // Erro genérico
  if (error instanceof Error) {
    return {
      type: ErrorType.INTERNAL,
      message: error.message || 'Erro interno do servidor',
      statusCode: 500,
    }
  }

  // Erro desconhecido
  return {
    type: ErrorType.INTERNAL,
    message: 'Erro desconhecido',
    statusCode: 500,
  }
}

/**
 * Trata erro e retorna resposta HTTP padronizada
 */
export function handleError(
  error: unknown,
  context?: {
    service?: string
    operation?: string
    userId?: string
    requestId?: string
  }
): NextResponse {
  const errorInfo = identifyError(error)

  // Log do erro
  const logContext = {
    userId: context?.userId,
    requestId: context?.requestId,
    service: context?.service,
    operation: context?.operation,
  }

  if (errorInfo.statusCode >= 500) {
    logger.error(
      `${context?.service || 'API'} - ${context?.operation || 'Operation'}: ${errorInfo.message}`,
      error instanceof Error ? error : undefined,
      logContext,
      { errorType: errorInfo.type, details: errorInfo.details }
    )
  } else {
    logger.warn(
      `${context?.service || 'API'} - ${context?.operation || 'Operation'}: ${errorInfo.message}`,
      logContext,
      { errorType: errorInfo.type, details: errorInfo.details }
    )
  }

  // Resposta HTTP
  const response = NextResponse.json(
    {
      success: false,
      error: errorInfo.message,
      type: errorInfo.type,
      ...(errorInfo.details && { details: errorInfo.details }),
      ...(context?.requestId && { requestId: context.requestId }),
    },
    { status: errorInfo.statusCode }
  )

  // Adicionar headers de rate limit se aplicável
  if (errorInfo.type === ErrorType.RATE_LIMIT && errorInfo.details) {
    response.headers.set('Retry-After', String(errorInfo.details.retryAfter))
    response.headers.set('X-RateLimit-Reset', errorInfo.details.resetAt)
  }

  return response
}

/**
 * Wrapper para handlers de API com tratamento de erro automático
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  context?: {
    service?: string
    operation?: string
  }
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleError(error, context)
    }
  }
}

/**
 * Trata erros assíncronos e retorna resultado ou erro
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    if (context) {
      logger.error(`${context}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, error instanceof Error ? error : undefined)
    }
    return [null, error instanceof Error ? error : new Error('Erro desconhecido')]
  }
}
