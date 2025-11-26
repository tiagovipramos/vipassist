/**
 * Utilitários para validação de dados com Zod
 * Centraliza a lógica de validação e tratamento de erros
 */

import { ZodSchema, ZodError } from 'zod'
import { NextResponse } from 'next/server'

/**
 * Valida dados usando um schema Zod
 * Retorna os dados validados ou lança erro
 */
export function validateData<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error.issues)
    }
    throw error
  }
}

/**
 * Valida dados de forma assíncrona
 */
export async function validateDataAsync<T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error.issues)
    }
    throw error
  }
}

/**
 * Valida query params de URL
 */
export function validateQueryParams<T>(
  schema: ZodSchema<T>,
  searchParams: URLSearchParams
): T {
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return validateData(schema, params)
}

/**
 * Classe de erro customizada para validação
 */
export class ValidationError extends Error {
  public errors: Array<{
    path: string[]
    message: string
  }>

  constructor(zodErrors: ZodError['issues']) {
    super('Erro de validação')
    this.name = 'ValidationError'
    this.errors = zodErrors.map((err: any) => ({
      path: err.path.map(String),
      message: err.message,
    }))
  }
}

/**
 * Cria uma resposta de erro de validação padronizada
 */
export function validationErrorResponse(error: ValidationError) {
  return NextResponse.json(
    {
      success: false,
      error: 'Erro de validação',
      details: error.errors,
    },
    { status: 400 }
  )
}

/**
 * Wrapper para handlers de API com validação automática
 */
export function withValidation<TBody, TQuery = unknown>(config: {
  bodySchema?: ZodSchema<TBody>
  querySchema?: ZodSchema<TQuery>
  handler: (data: {
    body?: TBody
    query?: TQuery
    request: Request
  }) => Promise<NextResponse>
}) {
  return async (request: Request) => {
    try {
      let body: TBody | undefined
      let query: TQuery | undefined

      // Validar body se schema fornecido
      if (config.bodySchema) {
        const rawBody = await request.json()
        body = validateData(config.bodySchema, rawBody)
      }

      // Validar query params se schema fornecido
      if (config.querySchema) {
        const url = new URL(request.url)
        query = validateQueryParams(config.querySchema, url.searchParams)
      }

      // Executar handler com dados validados
      return await config.handler({ body, query, request })
    } catch (error) {
      if (error instanceof ValidationError) {
        return validationErrorResponse(error)
      }
      
      // Outros erros
      console.error('[API Error]', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Erro interno do servidor',
        },
        { status: 500 }
      )
    }
  }
}
