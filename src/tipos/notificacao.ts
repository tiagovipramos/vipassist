// Tipos para notificações

export type TipoNotificacao = 
  | 'mensagem' 
  | 'ticket' 
  | 'sistema' 
  | 'pagamento' 
  | 'atendente';

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  descricao: string;
  lida: boolean;
  dataHora: string;
  icone: string;
  link?: string;
}
