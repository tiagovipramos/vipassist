import { CanalCliente } from './cliente';

export type TipoMensagem = 'texto' | 'imagem' | 'video' | 'audio' | 'documento' | 'localizacao' | 'contato' | 'sticker';

export type StatusMensagem = 'enviando' | 'enviada' | 'entregue' | 'lida' | 'erro';

export type DirecaoMensagem = 'entrada' | 'saida';

export type EmocaoDetectada = 'feliz' | 'neutro' | 'frustrado' | 'irritado' | 'triste' | 'confuso';

export interface Mensagem {
  id: string;
  conversaId: string;
  clienteId: string;
  usuarioId?: string;
  conteudo: string;
  tipo: TipoMensagem;
  direcao: DirecaoMensagem;
  status: StatusMensagem;
  canal: CanalCliente;
  dataEnvio: string;
  dataLeitura?: string;
  anexos?: Anexo[];
  emocaoDetectada?: EmocaoDetectada;
  confiancaEmocao?: number; // 0-100
  metadata?: Record<string, any>;
}

export interface Anexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  thumbnail?: string;
}

export interface Conversa {
  id: string;
  clienteId: string;
  usuarioId?: string;
  canal: CanalCliente;
  status: 'aberta' | 'em_andamento' | 'aguardando' | 'fechada';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  tags: string[];
  ultimaMensagem?: Mensagem;
  dataInicio: string;
  dataUltimaAtualizacao: string;
  dataFechamento?: string;
  naoLidas: number;
  tempoResposta?: number;
  satisfacao?: number;
  notasInternas?: string;
}

export interface SugestaoResposta {
  id: string;
  texto: string;
  confianca: number; // 0-100
  contexto: string;
  tipo: 'automatica' | 'template' | 'ia';
}
