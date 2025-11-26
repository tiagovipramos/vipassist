/**
 * Otimizador de Imagens
 * Compressão, redimensionamento e validação de uploads
 */

import sharp from 'sharp'
import { createLogger } from './logger'

const logger = createLogger('ImageOptimizer')

// Configurações de otimização
export const IMAGE_CONFIG = {
  // Tamanhos máximos
  maxWidth: 1920,
  maxHeight: 1920,
  
  // Qualidade
  quality: 80,
  
  // Tamanho máximo do arquivo (5MB)
  maxFileSize: 5 * 1024 * 1024,
  
  // Formatos permitidos
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}

/**
 * Valida o tamanho do arquivo
 */
export function validateFileSize(buffer: Buffer): boolean {
  if (buffer.length > IMAGE_CONFIG.maxFileSize) {
    logger.warn('Arquivo muito grande', undefined, {
      size: buffer.length,
      maxSize: IMAGE_CONFIG.maxFileSize,
    })
    return false
  }
  return true
}

/**
 * Valida o formato da imagem
 */
export function validateImageFormat(mimeType: string): boolean {
  if (!IMAGE_CONFIG.allowedFormats.includes(mimeType)) {
    logger.warn('Formato não permitido', undefined, {
      mimeType,
      allowed: IMAGE_CONFIG.allowedFormats,
    })
    return false
  }
  return true
}

/**
 * Extrai o tipo MIME do base64
 */
export function extractMimeType(base64String: string): string | null {
  const match = base64String.match(/^data:([^;]+);base64,/)
  return match ? match[1] : null
}

/**
 * Otimiza uma imagem
 */
export async function optimizeImage(
  buffer: Buffer,
  options?: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
  }
): Promise<Buffer> {
  const startTime = Date.now()
  
  try {
    const image = sharp(buffer)
    const metadata = await image.metadata()
    
    logger.debug('Otimizando imagem', undefined, {
      originalSize: buffer.length,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    })
    
    // Configurar otimização
    let pipeline = image
    
    // Redimensionar se necessário
    const maxWidth = options?.maxWidth || IMAGE_CONFIG.maxWidth
    const maxHeight = options?.maxHeight || IMAGE_CONFIG.maxHeight
    
    if (metadata.width && metadata.width > maxWidth || metadata.height && metadata.height > maxHeight) {
      pipeline = pipeline.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }
    
    // Converter para JPEG e comprimir
    const optimized = await pipeline
      .jpeg({
        quality: options?.quality || IMAGE_CONFIG.quality,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer()
    
    const duration = Date.now() - startTime
    const reduction = ((buffer.length - optimized.length) / buffer.length * 100).toFixed(2)
    
    logger.info('Imagem otimizada', undefined, {
      originalSize: buffer.length,
      optimizedSize: optimized.length,
      reduction: `${reduction}%`,
      duration: `${duration}ms`,
    })
    
    return optimized
  } catch (error) {
    logger.error('Erro ao otimizar imagem', error instanceof Error ? error : undefined)
    throw new Error('Falha ao otimizar imagem')
  }
}

/**
 * Processa upload de imagem base64
 */
export async function processBase64Image(
  base64String: string,
  options?: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
  }
): Promise<{
  buffer: Buffer
  mimeType: string
  originalSize: number
  optimizedSize: number
}> {
  // Extrair tipo MIME
  const mimeType = extractMimeType(base64String)
  
  if (!mimeType) {
    throw new Error('Formato de imagem inválido')
  }
  
  // Validar formato
  if (!validateImageFormat(mimeType)) {
    throw new Error(`Formato não permitido. Use: ${IMAGE_CONFIG.allowedFormats.join(', ')}`)
  }
  
  // Remover prefixo data:image/...;base64,
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')
  const originalBuffer = Buffer.from(base64Data, 'base64')
  
  // Validar tamanho
  if (!validateFileSize(originalBuffer)) {
    throw new Error(`Arquivo muito grande. Máximo: ${IMAGE_CONFIG.maxFileSize / 1024 / 1024}MB`)
  }
  
  // Otimizar
  const optimizedBuffer = await optimizeImage(originalBuffer, options)
  
  return {
    buffer: optimizedBuffer,
    mimeType,
    originalSize: originalBuffer.length,
    optimizedSize: optimizedBuffer.length,
  }
}

/**
 * Gera thumbnail de uma imagem
 */
export async function generateThumbnail(
  buffer: Buffer,
  size: number = 200
): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({
        quality: 70,
        progressive: true,
      })
      .toBuffer()
  } catch (error) {
    logger.error('Erro ao gerar thumbnail', error instanceof Error ? error : undefined)
    throw new Error('Falha ao gerar thumbnail')
  }
}
