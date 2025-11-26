export type PerfilUsuario = 'admin' | 'gerente' | 'atendente' | 'observador';

export type StatusUsuario = 'online' | 'offline' | 'ausente' | 'ocupado';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  perfil: PerfilUsuario;
  role?: PerfilUsuario; // Alias para perfil (compatibilidade)
  status: StatusUsuario;
  departamento?: string;
  setor?: string; // Alias para departamento (compatibilidade)
  telefone?: string;
  dataCriacao: string;
  ultimoAcesso?: string;
  ativo: boolean;
}

export interface UsuarioAutenticado extends Usuario {
  token: string;
  refreshToken: string;
  permissoes: string[];
}
