/**
 * API de Upload de Fotos
 * Com otimização, compressão e validação
 */

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { processBase64Image } from '@/lib/utils/imageOptimizer'
import { checkRateLimit, getRequestIdentifier } from '@/lib/utils/rateLimit'
import { handleError } from '@/lib/utils/errorHandler'
import { createLogger } from '@/lib/utils/logger'

const logger = createLogger('UploadFoto')

export async function POST(request: NextRequest) {
  try {
    // Rate limiting para uploads
    const identifier = getRequestIdentifier(request)
    const rateLimit = checkRateLimit(identifier, 'upload')
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Muitos uploads. Tente novamente mais tarde.',
          retryAfter: rateLimit.blockedUntil 
        },
        { status: 429 }
      )
    }
    
    const { protocolo, foto } = await request.json()

    // Validação de campos obrigatórios
    if (!protocolo || !foto) {
      return NextResponse.json(
        { success: false, error: 'Protocolo e foto são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar formato do protocolo
    if (!/^TKT-\d+$/.test(protocolo)) {
      return NextResponse.json(
        { success: false, error: 'Formato de protocolo inválido' },
        { status: 400 }
      )
    }

    logger.info('Processando upload de foto', { identifier }, { protocolo })

    // Processar e otimizar imagem
    const { buffer, originalSize, optimizedSize } = await processBase64Image(foto, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 80,
    })

    // Criar a pasta public/fotos se não existir
    const fotosDir = path.join(process.cwd(), 'public', 'fotos')
    if (!existsSync(fotosDir)) {
      await mkdir(fotosDir, { recursive: true })
    }

    // Salvar a foto otimizada
    const filename = `${protocolo}.jpg`
    const filepath = path.join(fotosDir, filename)
    await writeFile(filepath, buffer)

    // URL pública da foto
    const fotoUrl = `/fotos/${filename}`

    // Calcular redução de tamanho
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2)

    logger.info('Foto salva com sucesso', { identifier }, {
      protocolo,
      originalSize,
      optimizedSize,
      reduction: `${reduction}%`,
      filename,
    })

    return NextResponse.json({
      success: true,
      fotoUrl,
      message: 'Foto salva com sucesso',
      stats: {
        originalSize,
        optimizedSize,
        reduction: `${reduction}%`,
      },
    })
  } catch (error) {
    // Tratamento de erros específicos
    if (error instanceof Error) {
      if (error.message.includes('Formato')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        )
      }
      if (error.message.includes('muito grande')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 413 }
        )
      }
    }

    return handleError(error, {
      service: 'UploadFoto',
      operation: 'POST',
    })
  }
}
