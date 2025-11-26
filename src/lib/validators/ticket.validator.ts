/**
 * Validadores Zod para Tickets
 * DTOs para validação de entrada de dados nas APIs
 */

import { z } from 'zod'

// Schema para criação de ticket
export const createTicketSchema = z.object({
  clienteId: z.string().cuid('ID do cliente inválido'),
  veiculoId: z.string().cuid('ID do veículo inválido').optional(),
  tipoServico: z.enum(['reboque', 'pneu', 'chaveiro', 'bateria', 'combustivel', 'mecanica'], {
    errorMap: () => ({ message: 'Tipo de serviço inválido' })
  }),
  descricaoProblema: z.string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  // Origem
  origemCep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido').optional(),
  origemEndereco: z.string().min(5, 'Endereço de origem muito curto').max(200),
  origemCidade: z.string().min(2, 'Cidade inválida').max(100),
  origemLatitude: z.number().min(-90).max(90).optional(),
  origemLongitude: z.number().min(-180).max(180).optional(),
  
  // Destino
  destinoCep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido').optional(),
  destinoEndereco: z.string().min(5).max(200).optional(),
  destinoCidade: z.string().min(2).max(100).optional(),
  destinoLatitude: z.number().min(-90).max(90).optional(),
  destinoLongitude: z.number().min(-180).max(180).optional(),
  
  distanciaKm: z.number().min(0).max(1000).optional(),
  prioridade: z.enum(['baixa', 'media', 'alta', 'critica']).default('media'),
})

// Schema para atualização de ticket
export const updateTicketSchema = z.object({
  status: z.enum(['aguardando', 'em_andamento', 'concluido', 'cancelado']).optional(),
  prioridade: z.enum(['baixa', 'media', 'alta', 'critica']).optional(),
  prestadorId: z.string().cuid().optional(),
  valorCotado: z.number().min(0).optional(),
  valorFinal: z.number().min(0).optional(),
  avaliacaoCliente: z.number().min(1).max(5).optional(),
  comentarioCliente: z.string().max(500).optional(),
  motivoCancelamento: z.string().max(300).optional(),
  observacoes: z.string().max(500).optional(),
})

// Schema para query params de listagem
export const listTicketsQuerySchema = z.object({
  status: z.enum(['aguardando', 'em_andamento', 'concluido', 'cancelado']).optional(),
  prioridade: z.enum(['baixa', 'media', 'alta', 'critica']).optional(),
  clienteId: z.string().cuid().optional(),
  prestadorId: z.string().cuid().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
})

// Tipos TypeScript inferidos dos schemas
export type CreateTicketDTO = z.infer<typeof createTicketSchema>
export type UpdateTicketDTO = z.infer<typeof updateTicketSchema>
