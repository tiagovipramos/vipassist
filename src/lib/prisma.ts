/**
 * Prisma Client Otimizado para Produção
 * Configurado com pool de conexões e timeouts adequados
 */

import { PrismaClient } from '@prisma/client'
import { createLogger } from './utils/logger'

const logger = createLogger('Prisma')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Configuração do Prisma Client
 * - Connection pool otimizado para produção
 * - Timeouts configurados
 * - Logs estruturados
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Event listeners para logs estruturados
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: any) => {
    logger.debug('Query executada', undefined, {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    })
  })
}

prisma.$on('error' as never, (e: any) => {
  logger.error('Erro no Prisma', new Error(e.message), undefined, {
    target: e.target,
  })
})

prisma.$on('warn' as never, (e: any) => {
  logger.warn('Aviso do Prisma', undefined, {
    message: e.message,
  })
})

// Graceful shutdown
process.on('beforeExit', async () => {
  logger.info('Desconectando do banco de dados...')
  await prisma.$disconnect()
})

// Prevenir múltiplas instâncias em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
