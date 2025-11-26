import { Usuario, Cliente, Conversa, Mensagem, Ticket } from '@/tipos';

// Usuários mockados
export const usuariosMockados: Usuario[] = [
  {
    id: '1',
    nome: 'Joe Peterson',
    email: 'joe@kortex.com',
    avatar: '',
    perfil: 'admin',
    status: 'online',
    departamento: 'Atendimento',
    telefone: '(11) 98765-4321',
    dataCriacao: '2024-01-15T10:00:00Z',
    ultimoAcesso: new Date().toISOString(),
    ativo: true,
  },
  {
    id: '2',
    nome: 'Maria Silva',
    email: 'maria@kortex.com',
    avatar: '',
    perfil: 'atendente',
    status: 'online',
    departamento: 'Atendimento',
    telefone: '(11) 98765-4322',
    dataCriacao: '2024-02-01T10:00:00Z',
    ultimoAcesso: new Date().toISOString(),
    ativo: true,
  },
  {
    id: '3',
    nome: 'João Santos',
    email: 'joao@kortex.com',
    avatar: '',
    perfil: 'atendente',
    status: 'ausente',
    departamento: 'Suporte',
    telefone: '(11) 98765-4323',
    dataCriacao: '2024-02-10T10:00:00Z',
    ultimoAcesso: new Date(Date.now() - 3600000).toISOString(),
    ativo: true,
  },
];

// Dados básicos (compatibilidade) - removidos para evitar conflitos com outros mocks
// Esses dados estão em seus respectivos arquivos mock
