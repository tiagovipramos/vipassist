'use client'

import { useState } from 'react'
import { Card } from '@/componentes/ui/card'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import { 
  Send, 
  Paperclip, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Phone,
  Mail,
  User,
  FileText
} from 'lucide-react'

export default function NovoTicketPage() {
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [numeroTicket, setNumeroTicket] = useState('')

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    categoria: '',
    prioridade: 'media',
    descricao: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    // Simula envio
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Gera número do ticket
    const numero = `#${Math.floor(1000 + Math.random() * 9000)}`
    setNumeroTicket(numero)
    setEnviado(true)
    setEnviando(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ticket Criado com Sucesso! 🎉
          </h1>
          
          <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-6 py-3 mb-6">
            <span className="text-sm font-medium text-gray-600">Número do Ticket:</span>
            <span className="text-2xl font-bold text-primary">{numeroTicket}</span>
          </div>
          
          <p className="text-gray-600 mb-8">
            Recebemos seu ticket e nossa equipe entrará em contato em breve.
            <br />
            Você receberá atualizações por email sobre o andamento.
          </p>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">📋 Resumo do Ticket</h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nome:</span>
                <span className="text-sm font-medium text-gray-900">{formData.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Assunto:</span>
                <span className="text-sm font-medium text-gray-900">{formData.assunto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Categoria:</span>
                <span className="text-sm font-medium text-gray-900">{formData.categoria}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                setEnviado(false)
                setFormData({
                  nome: '',
                  email: '',
                  telefone: '',
                  assunto: '',
                  categoria: '',
                  prioridade: 'media',
                  descricao: '',
                })
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Abrir Outro Ticket
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              Voltar ao Início
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 p-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent text-2xl font-bold text-white">
              K
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Kortex</h1>
          </div>
          <p className="text-lg text-gray-600">
            Abra um ticket de suporte e nossa equipe entrará em contato
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Suas Informações
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="João Silva"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    placeholder="(11) 99999-9999"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="joao@email.com"
                  className="w-full"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Detalhes do Ticket
              </h3>

              {/* Assunto */}
              <div className="mb-4">
                <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto *
                </label>
                <Input
                  id="assunto"
                  name="assunto"
                  type="text"
                  value={formData.assunto}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Problema com produto, Dúvida sobre pedido..."
                  className="w-full"
                />
              </div>

              {/* Categoria e Prioridade */}
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Suporte Técnico">Suporte Técnico</option>
                    <option value="Dúvida sobre Produto">Dúvida sobre Produto</option>
                    <option value="Reclamação">Reclamação</option>
                    <option value="Solicitação">Solicitação</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Logística">Logística</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    id="prioridade"
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Problema *
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Descreva detalhadamente o problema que você está enfrentando..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Quanto mais detalhes você fornecer, mais rápido poderemos ajudá-lo.
                </p>
              </div>

              {/* Anexos (futuro) */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexos (opcional)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Paperclip className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para adicionar</span> ou arraste arquivos
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF (máx. 10MB)</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*,.pdf" />
                  </label>
                </div>
              </div>
            </div>

            {/* Informações importantes */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Informações importantes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Você receberá um email de confirmação com o número do ticket</li>
                    <li>Nossa equipe responde em até 24 horas úteis</li>
                    <li>Para urgências, entre em contato pelo telefone (11) 3333-4444</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              disabled={enviando}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              {enviando ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Enviar Ticket
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Precisa de ajuda imediata? 
            <a href="tel:1133334444" className="ml-1 font-medium text-primary hover:underline">
              Ligue para (11) 3333-4444
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
