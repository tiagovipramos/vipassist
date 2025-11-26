import { NextResponse } from 'next/server'
import { DashboardService } from '@/lib/services/dashboard.service'

export async function GET() {
  try {
    const [
      metricas,
      chamadosUrgentes,
      alertas,
      distribuicaoServicos,
      topPrestadores,
      regioesAtendimento,
      horariosPico,
      tendenciaSemanal,
    ] = await Promise.all([
      DashboardService.getMetricasPrincipais(),
      DashboardService.getChamadosUrgentes(),
      DashboardService.getAlertasOperacionais(),
      DashboardService.getDistribuicaoServicos(),
      DashboardService.getTopPrestadores(),
      DashboardService.getRegioesAtendimento(),
      DashboardService.getHorariosPico(),
      DashboardService.getTendenciaSemanal(),
    ])

    return NextResponse.json({
      metricas,
      chamadosUrgentes,
      alertas,
      distribuicaoServicos,
      topPrestadores,
      regioesAtendimento,
      horariosPico,
      tendenciaSemanal,
    })
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do dashboard' },
      { status: 500 }
    )
  }
}
