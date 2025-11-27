import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { googleMapsKey, mapboxToken, searchRadius } = body

    // Caminho do arquivo .env
    const envPath = path.join(process.cwd(), '.env')
    
    // Ler o arquivo .env atual
    let envContent = ''
    try {
      envContent = fs.readFileSync(envPath, 'utf-8')
    } catch (error) {
      // Se o arquivo não existir, criar um novo
      envContent = ''
    }

    // Atualizar ou adicionar as variáveis
    const lines = envContent.split('\n')
    const updatedLines: string[] = []
    let googleMapsUpdated = false
    let mapboxUpdated = false
    let searchRadiusUpdated = false

    for (const line of lines) {
      if (line.startsWith('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=')) {
        updatedLines.push(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${googleMapsKey}`)
        googleMapsUpdated = true
      } else if (line.startsWith('NEXT_PUBLIC_MAPBOX_TOKEN=')) {
        updatedLines.push(`NEXT_PUBLIC_MAPBOX_TOKEN=${mapboxToken}`)
        mapboxUpdated = true
      } else if (line.startsWith('GOOGLE_MAPS_SEARCH_RADIUS=')) {
        updatedLines.push(`GOOGLE_MAPS_SEARCH_RADIUS=${searchRadius}`)
        searchRadiusUpdated = true
      } else {
        updatedLines.push(line)
      }
    }

    // Se as variáveis não existiam, adicionar no final
    if (!googleMapsUpdated) {
      updatedLines.push(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${googleMapsKey}`)
    }
    if (!mapboxUpdated) {
      updatedLines.push(`NEXT_PUBLIC_MAPBOX_TOKEN=${mapboxToken}`)
    }
    if (!searchRadiusUpdated && searchRadius) {
      updatedLines.push(`GOOGLE_MAPS_SEARCH_RADIUS=${searchRadius}`)
    }

    // Escrever de volta no arquivo
    const newEnvContent = updatedLines.join('\n')
    fs.writeFileSync(envPath, newEnvContent, 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso. Reinicie o servidor para aplicar as mudanças.'
    })
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao salvar configurações',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Retornar as chaves atuais (mascaradas por segurança)
    const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

    return NextResponse.json({
      success: true,
      data: {
        googleMapsKey: googleMapsKey ? `${googleMapsKey.substring(0, 10)}...` : '',
        mapboxToken: mapboxToken ? `${mapboxToken.substring(0, 10)}...` : '',
        googleMapsConfigured: googleMapsKey.length > 0,
        mapboxConfigured: mapboxToken.length > 0
      }
    })
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar configurações'
      },
      { status: 500 }
    )
  }
}
