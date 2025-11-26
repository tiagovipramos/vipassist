/**
 * Tipos para o sistema de Logs
 */

export type TipoLog = 
  | 'sistema'
  | 'usuario'
  | 'ticket'
  | 'prestador'
  | 'cliente'
  | 'pagamento'
  | 'erro';

export type AcaoLog = 
  | 'criar'
  | 'editar'
  | 'deletar'
  | 'login'
  | 'logout'
  | 'visualizar'
  | 'exportar'
  | 'importar'
  | 'aprovar'
  | 'rejeitar'
  | 'cancelar'
  | 'concluir'
  | 'erro';

export type NivelLog = 
  | 'debug'
  | 'info'
  | 'warning'
  | 'error'
  | 'critical';

export interface Log {
  id: string;
  tipo: TipoLog;
  acao: AcaoLog;
  descricao: string;
  entidade?: string;
  entidadeId?: string;
  usuarioId?: string;
  usuarioNome?: string;
  usuarioEmail?: string;
  metadados?: string;
  nivel: NivelLog;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface FiltrosLog {
  tipo?: TipoLog | 'todos';
  acao?: AcaoLog | 'todos';
  nivel?: NivelLog | 'todos';
  usuarioId?: string;
  dataInicio?: Date;
  dataFim?: Date;
  busca?: string;
}

export interface EstatisticasLog {
  totalLogs: number;
  porTipo: Record<TipoLog, number>;
  porNivel: Record<NivelLog, number>;
  porAcao: Record<string, number>;
  ultimasHoras: number;
  errosRecentes: number;
}
