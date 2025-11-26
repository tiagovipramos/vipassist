import { TipoServico } from '@/tipos/prestador'

// Tipos de serviço disponíveis (mantidos para referência na UI)
export const tiposServico: TipoServico[] = [
  {
    id: '1',
    nome: 'Guincho',
    descricao: 'Serviço de reboque e guincho',
    icone: 'Truck',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Mecânico',
    descricao: 'Serviços mecânicos em geral',
    icone: 'Wrench',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Eletricista',
    descricao: 'Serviços elétricos automotivos',
    icone: 'Zap',
    ativo: true,
  },
  {
    id: '4',
    nome: 'Troca de Pneu',
    descricao: 'Troca e reparo de pneus',
    icone: 'Circle',
    ativo: true,
  },
  {
    id: '5',
    nome: 'Chaveiro',
    descricao: 'Serviços de chaveiro automotivo',
    icone: 'Key',
    ativo: true,
  },
  {
    id: '6',
    nome: 'Pane Seca',
    descricao: 'Abastecimento emergencial',
    icone: 'Fuel',
    ativo: true,
  },
]

// DADOS MOCKADOS REMOVIDOS - Agora usando API real
// Os prestadores são gerenciados através da API em /api/prestadores
export const prestadoresMock = [
]
