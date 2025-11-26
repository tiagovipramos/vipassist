/**
 * Health Check Endpoint
 * Verifica saúde da aplicação e dependências
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  checks: {
    database: {
      status: 'connected' | 'disconnected'
      responseTime?: number
      error?: string
    }
    memory: {
      used: number
      total: number
      percentage: number
    }
    environment: {
      nodeVersion: string
      platform: string
      env: string
    }
  }
}

export async function GET() {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  
  // Verificar banco de dados
  let databaseStatus: HealthStatus['checks']['database'] = {
    status: 'disconnected'
  }
  
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbEnd = Date.now()
    
    databaseStatus = {
      status: 'connected',
      responseTime: dbEnd - dbStart
    }
  } catch (error) {
    databaseStatus = {
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
  
  // Verificar memória
  const memoryUsage = process.memoryUsage()
  const totalMemory = memoryUsage.heapTotal
  const usedMemory = memoryUsage.heapUsed
  const memoryPercentage = (usedMemory / totalMemory) * 100
  
  // Informações do ambiente
  const environment = {
    nodeVersion: process.version,
    platform: process.platform,
    env: process.env.NODE_ENV || 'development'
  }
  
  // Determinar status geral
  let overallStatus: HealthStatus['status'] = 'healthy'
  
  if (databaseStatus.status === 'disconnected') {
    overallStatus = 'unhealthy'
  } else if (memoryPercentage > 90) {
    overallStatus = 'degraded'
  }
  
  const healthStatus: HealthStatus = {
    status: overallStatus,
    timestamp,
    uptime: process.uptime(),
    checks: {
      database: databaseStatus,
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round(memoryPercentage)
      },
      environment
    }
  }
  
  // Retornar status apropriado
  const statusCode = overallStatus === 'healthy' ? 200 : 
                     overallStatus === 'degraded' ? 200 : 503
  
  return NextResponse.json(healthStatus, { status: statusCode })
}
