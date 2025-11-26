/**
 * Validadores Zod para Clientes
 * DTOs para validação de entrada de dados nas APIs
 */

import { z } from 'zod'

// Schema para criação de cliente
export const createClienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').optional(),
  dataNascimento: z.string().datetime().optional(),
  
  // Endereço
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido').optional(),
  logradouro: z.string().max(200).optional(),
  numero: z.string().max(20).optional(),
  complemento: z.string().max(100).optional(),
  bairro: z.string().max(100).optional(),
  cidade: z.string().max(100).optional(),
  estado: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  
  // Plano/Seguro
  plano: z.string().max(100).optional(),
  numeroApolice: z.string().max(50).optional(),
  seguradora: z.string().max(100).optional(),
  
  observacoes: z.string().max(500).optional(),
})

// Schema para atualização de cliente
export const updateClienteSchema = createClienteSchema.partial()

// Schema para query params de listagem
export const listClientesQuerySchema = z.object({
  search: z.string().optional(),
  ativo: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(20),
})

// Tipos TypeScript inferidos dos schemas
export type CreateClienteDTO = z.infer<typeof createClienteSchema>
export type UpdateClienteDTO = z.infer<typeof updateClienteSchema>
