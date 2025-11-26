/**
 * Serviço de Logs
 * Gerencia operações relacionadas aos logs do sistema
 */

import { prisma } from '@/lib/prisma';
import type { Log, FiltrosLog, EstatisticasLog, TipoLog, NivelLog } from '@/tipos/log';

export class LogsService {
  /**
   * Criar um novo log
   */
  static async criarLog(dados: {
    tipo: string;
    acao: string;
    descricao: string;
    entidade?: string;
    entidadeId?: string;
    usuarioId?: string;
    usuarioNome?: string;
    usuarioEmail?: string;
    metadados?: any;
    nivel?: string;
    ip?: string;
    userAgent?: string;
  }) {
    try {
      const log = await prisma.log.create({
        data: {
          tipo: dados.tipo,
          acao: dados.acao,
          descricao: dados.descricao,
          entidade: dados.entidade,
          entidadeId: dados.entidadeId,
          usuarioId: dados.usuarioId,
          usuarioNome: dados.usuarioNome,
          usuarioEmail: dados.usuarioEmail,
          metadados: dados.metadados ? JSON.stringify(dados.metadados) : undefined,
          nivel: dados.nivel || 'info',
          ip: dados.ip,
          userAgent: dados.userAgent,
        },
      });

      return log;
    } catch (error) {
      console.error('Erro ao criar log:', error);
      throw error;
    }
  }

  /**
   * Listar logs com filtros
   */
  static async listarLogs(filtros: FiltrosLog & { page?: number; limit?: number }) {
    try {
      const {
        tipo,
        acao,
        nivel,
        usuarioId,
        dataInicio,
        dataFim,
        busca,
        page = 1,
        limit = 50,
      } = filtros;

      const where: any = {};

      // Filtros
      if (tipo && tipo !== 'todos') {
        where.tipo = tipo;
      }

      if (acao && acao !== 'todos') {
        where.acao = acao;
      }

      if (nivel && nivel !== 'todos') {
        where.nivel = nivel;
      }

      if (usuarioId) {
        where.usuarioId = usuarioId;
      }

      if (dataInicio || dataFim) {
        where.createdAt = {};
        if (dataInicio) {
          where.createdAt.gte = dataInicio;
        }
        if (dataFim) {
          where.createdAt.lte = dataFim;
        }
      }

      if (busca) {
        where.OR = [
          { descricao: { contains: busca } },
          { usuarioNome: { contains: busca } },
          { usuarioEmail: { contains: busca } },
          { entidade: { contains: busca } },
        ];
      }

      // Contar total
      const total = await prisma.log.count({ where });

      // Buscar logs
      const logs = await prisma.log.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Erro ao listar logs:', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas dos logs
   */
  static async obterEstatisticas(): Promise<EstatisticasLog> {
    try {
      // Total de logs
      const totalLogs = await prisma.log.count();

      // Logs por tipo
      const logsPorTipo = await prisma.log.groupBy({
        by: ['tipo'],
        _count: true,
      });

      const porTipo: any = {
        sistema: 0,
        usuario: 0,
        ticket: 0,
        prestador: 0,
        cliente: 0,
        pagamento: 0,
        erro: 0,
      };

      logsPorTipo.forEach((item) => {
        porTipo[item.tipo as TipoLog] = item._count;
      });

      // Logs por nível
      const logsPorNivel = await prisma.log.groupBy({
        by: ['nivel'],
        _count: true,
      });

      const porNivel: any = {
        debug: 0,
        info: 0,
        warning: 0,
        error: 0,
        critical: 0,
      };

      logsPorNivel.forEach((item) => {
        porNivel[item.nivel as NivelLog] = item._count;
      });

      // Logs por ação
      const logsPorAcao = await prisma.log.groupBy({
        by: ['acao'],
        _count: true,
      });

      const porAcao: Record<string, number> = {};
      logsPorAcao.forEach((item) => {
        porAcao[item.acao] = item._count;
      });

      // Logs das últimas 24 horas
      const ultimasHoras = await prisma.log.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      });

      // Erros recentes (últimas 24 horas)
      const errosRecentes = await prisma.log.count({
        where: {
          nivel: {
            in: ['error', 'critical'],
          },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      });

      return {
        totalLogs,
        porTipo,
        porNivel,
        porAcao,
        ultimasHoras,
        errosRecentes,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  /**
   * Obter log por ID
   */
  static async obterLogPorId(id: string) {
    try {
      const log = await prisma.log.findUnique({
        where: { id },
      });

      return log;
    } catch (error) {
      console.error('Erro ao obter log:', error);
      throw error;
    }
  }

  /**
   * Limpar logs antigos (mais de X dias)
   */
  static async limparLogsAntigos(dias: number = 90) {
    try {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - dias);

      const resultado = await prisma.log.deleteMany({
        where: {
          createdAt: {
            lt: dataLimite,
          },
        },
      });

      return resultado.count;
    } catch (error) {
      console.error('Erro ao limpar logs antigos:', error);
      throw error;
    }
  }

  /**
   * Exportar logs para CSV
   */
  static async exportarLogs(filtros: FiltrosLog) {
    try {
      const { logs } = await this.listarLogs({ ...filtros, limit: 10000 });

      // Criar CSV
      const headers = [
        'Data/Hora',
        'Tipo',
        'Ação',
        'Nível',
        'Descrição',
        'Entidade',
        'Usuário',
        'IP',
      ];

      const rows = logs.map((log) => [
        new Date(log.createdAt).toLocaleString('pt-BR'),
        log.tipo,
        log.acao,
        log.nivel,
        log.descricao,
        log.entidade || '-',
        log.usuarioNome || '-',
        log.ip || '-',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      return csv;
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      throw error;
    }
  }
}
