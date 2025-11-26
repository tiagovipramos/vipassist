import { CanalCliente } from './cliente';
import { EmocaoDetectada, Mensagem } from './mensagem';

export type StatusConversaSupervisao = 'urgente' | 'em_andamento' | 'normal' | 'resolvida';

export type NivelAlerta = 'critico' | 'alto' | 'medio' | 'baixo';

export interface AnaliseIAConversa {
  nivelIrritacao: number; // 0-10
  sentimento: EmocaoDetectada;
  confianca: number; // 0-100
  sugestoes: string[];
  alertas: string[];
  historicoReclamacoes: number;
  diasDesdeUltimaReclamacao?: number;
  topicosAbordados: string[];
}

export interface ConversaSupervisao {
  id: string;
  status: StatusConversaSupervisao;
  prioridade: NivelAlerta;
  
  // Informações do cliente
  clienteId: string;
  clienteNome: string;
  clienteAvatar?: string;
  clienteEmocao: EmocaoDetectada;
  
  // Informações do atendente
  atendenteId: string;
  atendenteNome: string;
  atendenteAvatar?: string;
  atendenteTipo: 'humano' | 'ia';
  
  // Informações da conversa
  canal: CanalCliente;
  duracaoMinutos: number;
  inicioConversa: string;
  ultimaAtualizacao: string;
  mensagens: Mensagem[];
  digitando: boolean;
  
  // Análise IA
  analiseIA: AnaliseIAConversa;
  
  // Tags e categorias
  tags: string[];
  categoria?: string;
}

export interface FiltrosConversaSupervisao {
  status?: StatusConversaSupervisao[];
  emocao?: EmocaoDetectada[];
  atendente?: string[];
  canal?: CanalCliente[];
  periodo?: 'tempo_real' | 'ultimas_24h' | 'ultimos_7d' | 'ultimos_30d';
  prioridade?: NivelAlerta[];
}

export interface MetricasConversas {
  totalAtivas: number;
  tmr: number; // Tempo médio de resposta em segundos
  satisfacaoPercentual: number;
  filaEspera: number;
  distribuicaoEmocoes: {
    positivo: number;
    neutro: number;
    negativo: number;
  };
}
