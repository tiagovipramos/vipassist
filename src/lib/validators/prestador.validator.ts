/**
 * Validadores Zod para Prestadores
 * DTOs para validação de entrada de dados nas APIs
 */

import { z } from 'zod'

// Schema para criação de prestador
export const createPrestadorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  razaoSocial: z.string().max(200).optional(),
  tipoPessoa: z.enum(['fisica', 'juridica'], {
    message: 'Tipo de pessoa deve ser "fisica" ou "juridica"'
  }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').optional(),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido').optional(),
  
  email: z.string().email('Email inválido'),
  telefone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
  celular: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Celular inválido').optional(),
  
  // Endereço
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  logradouro: z.string().min(3).max(200),
  numero: z.string().max(20),
  complemento: z.string().max(100).optional(),
  bairro: z.string().max(100),
  cidade: z.string().max(100),
  estado: z.string().length(2, 'Estado deve ter 2 caracteres'),
  
  // Serviços
  servicos: z.array(z.enum(['reboque', 'pneu', 'chaveiro', 'bateria', 'combustivel', 'mecanica'])),
  raioAtuacao: z.number().min(1).max(200).default(50),
  
  // Dados Bancários
  pixChave: z.string().max(100).optional(),
  banco: z.string().max(100).optional(),
  agencia: z.string().max(20).optional(),
  conta: z.string().max(20).optional(),
  tipoConta: z.enum(['corrente', 'poupanca']).optional(),
  
  // Localização
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  
  observacoes: z.string().max(500).optional(),
})

// Schema para atualização de prestador
export const updatePrestadorSchema = createPrestadorSchema.partial().extend({
  status: z.enum(['ativo', 'inativo', 'pendente', 'bloqueado']).optional(),
  disponivel: z.boolean().optional(),
})

// Schema para query params de listagem
export const listPrestadoresQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente', 'bloqueado']).optional(),
  disponivel: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  servico: z.enum(['reboque', 'pneu', 'chaveiro', 'bateria', 'combustivel', 'mecanica']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
})

// Schema para buscar prestadores próximos
export const prestadoresProximosQuerySchema = z.object({
  latitude: z.string().transform(Number),
  longitude: z.string().transform(Number),
  raio: z.string().regex(/^\d+$/).transform(Number).default(() => 50),
  servico: z.enum(['reboque', 'pneu', 'chaveiro', 'bateria', 'combustivel', 'mecanica']).optional(),
})

// Tipos TypeScript inferidos dos schemas
export type CreatePrestadorDTO = z.infer<typeof createPrestadorSchema>
export type UpdatePrestadorDTO = z.infer<typeof updatePrestadorSchema>
