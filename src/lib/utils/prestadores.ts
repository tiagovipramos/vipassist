import { PrestadorProximo, DadosCotacao } from '@/tipos/assistenciaVeicular'

/**
 * Calcula a distância entre duas coordenadas usando a fórmula de Haversine
 */
export function calcularDistancia(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Busca prestadores próximos com base na localização e raio
 */
export function buscarPrestadoresProximos(
  prestadores: PrestadorProximo[],
  origemLat: number,
  origemLng: number,
  raioKm: number = 10,
  tipoServico?: string
): PrestadorProximo[] {
  // Filtra prestadores disponíveis
  let prestadoresFiltrados = prestadores.filter((p) => p.disponivel)

  // Filtra por tipo de serviço se especificado
  if (tipoServico) {
    prestadoresFiltrados = prestadoresFiltrados.filter((p) => {
      const tipoMap: Record<string, string[]> = {
        reboque: ['reboque', 'multiplo'],
        pneu: ['mecanico', 'multiplo'],
        bateria: ['mecanico', 'multiplo'],
        combustivel: ['mecanico', 'multiplo'],
        chaveiro: ['chaveiro', 'multiplo'],
        mecanica: ['mecanico', 'multiplo'],
      }
      return tipoMap[tipoServico]?.includes(p.tipo)
    })
  }

  // Calcula distância e filtra por raio
  const prestadoresComDistancia = prestadoresFiltrados
    .map((prestador) => {
      const distancia = calcularDistancia(
        origemLat,
        origemLng,
        prestador.localizacao.coordenadas.lat,
        prestador.localizacao.coordenadas.lng
      )
      return {
        ...prestador,
        distanciaKm: Number(distancia.toFixed(1)),
      }
    })
    .filter((p) => p.distanciaKm <= raioKm)

  // Ordena por distância (mais próximo primeiro)
  return prestadoresComDistancia.sort((a, b) => a.distanciaKm - b.distanciaKm)
}

/**
 * Busca prestadores com expansão automática de raio
 */
export function buscarPrestadoresComExpansao(
  prestadores: PrestadorProximo[],
  origemLat: number,
  origemLng: number,
  tipoServico?: string
): {
  prestadores: PrestadorProximo[]
  raioUtilizado: number
} {
  const raios = [10, 20, 30, 50] // Raios em km para tentar

  for (const raio of raios) {
    const encontrados = buscarPrestadoresProximos(
      prestadores,
      origemLat,
      origemLng,
      raio,
      tipoServico
    )

    if (encontrados.length > 0) {
      return {
        prestadores: encontrados,
        raioUtilizado: raio,
      }
    }
  }

  // Se não encontrou nenhum, retorna array vazio
  return {
    prestadores: [],
    raioUtilizado: 50,
  }
}

/**
 * Gera mensagem de cotação para WhatsApp
 */
export function gerarMensagemCotacao(dados: DadosCotacao): string {
  const tiposServico: Record<string, string> = {
    reboque: 'Reboque',
    pneu: 'Troca de Pneu',
    bateria: 'Pane Elétrica',
    combustivel: 'Combustível',
    chaveiro: 'Chaveiro',
    mecanica: 'Pane Mecânica',
  }

  const prioridades: Record<string, string> = {
    critica: '🔴 CRÍTICA',
    alta: '🟠 ALTA',
    media: '🟡 MÉDIA',
  }

  let mensagem = `📌 *SOLICITAÇÃO DE COTAÇÃO – VIP ASSIST*\n\n`
  
  mensagem += `*Protocolo:* ${dados.protocolo}\n`
  mensagem += `*Tipo de Serviço:* ${tiposServico[dados.tipoServico] || dados.tipoServico}\n`
  mensagem += `*Nível de Prioridade:* ${prioridades[dados.prioridade]}\n\n`

  mensagem += `📍 *LOCALIZAÇÃO*\n\n`
  mensagem += `*Origem:* ${dados.origem.endereco}\n`
  
  if (dados.destino) {
    mensagem += `*Destino:* ${dados.destino.endereco}\n`
  }
  
  if (dados.distanciaKm) {
    mensagem += `*Distância Estimada:* ${dados.distanciaKm} km\n`
  }
  
  mensagem += `*Tempo previsto com trânsito:* A calcular\n\n`

  mensagem += `🚗 *DADOS DO VEÍCULO*\n\n`
  mensagem += `*Placa:* ${dados.veiculoPlaca}\n`
  if (dados.veiculoMarca && dados.veiculoModelo) {
    mensagem += `*Modelo:* ${dados.veiculoMarca} ${dados.veiculoModelo}\n`
  }

  mensagem += `\n🛑 *DESCRIÇÃO DO OCORRIDO*\n\n`
  mensagem += `${dados.descricaoProblema}\n\n`

  mensagem += `📎 *Favor informar na resposta:*\n\n`
  mensagem += `Valor total da corrida (R$):\n`
  mensagem += `Tempo estimado de chegada aa ORIGEM (minutos):`

  return mensagem
}

/**
 * Gera link do WhatsApp com mensagem pré-formatada
 * Usa api.whatsapp.com que suporta mensagens pré-preenchidas
 */
export function gerarLinkWhatsApp(
  numeroWhatsApp: string,
  mensagem: string
): string {
  const mensagemCodificada = encodeURIComponent(mensagem)
  // api.whatsapp.com suporta mensagens pré-preenchidas e abre no WhatsApp Web
  return `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemCodificada}`
}

/**
 * Formata número de telefone para WhatsApp (remove caracteres especiais)
 */
export function formatarNumeroWhatsApp(telefone: string): string {
  return telefone.replace(/\D/g, '')
}

/**
 * Estima tempo de chegada baseado na distância
 */
export function estimarTempoChegada(distanciaKm: number): string {
  // Velocidade média urbana: 30 km/h
  const velocidadeMedia = 30
  const tempoMinutos = Math.ceil((distanciaKm / velocidadeMedia) * 60)

  if (tempoMinutos < 60) {
    return `${tempoMinutos} min`
  } else {
    const horas = Math.floor(tempoMinutos / 60)
    const minutos = tempoMinutos % 60
    return minutos > 0 ? `${horas}h ${minutos}min` : `${horas}h`
  }
}
