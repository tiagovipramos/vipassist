'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { 
  Search,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  PlayCircle,
  FileText,
  Zap,
  Users,
  TrendingUp,
  Shield,
  Clock,
  X
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/componentes/ui/dialog'

export default function SuportePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Como podemos ajudar?
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Encontre respostas, tutoriais e entre em contato com o suporte
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar artigos, tutoriais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a
            href="#artigos"
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Base de Conhecimento
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Artigos e tutoriais completos
            </p>
          </a>

          <a
            href="#videos"
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                <PlayCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Vídeo Tutoriais
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Aprenda assistindo passo a passo
            </p>
          </a>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 group w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Falar com Suporte
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Nossa equipe está pronta para ajudar
            </p>
          </button>
        </div>

        {/* FAQ Robusto */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Perguntas Frequentes
          </h2>
          
          {/* Filtros de Categoria */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {['Todos', 'Chamados', 'Prestadores', 'Mapa', 'Pagamentos', 'Relatórios', 'Clientes', 'Equipe', 'Segurança', 'Sistema'].map((categoria) => (
              <button
                key={categoria}
                onClick={() => setSelectedCategory(categoria === 'Mapa' ? 'Mapa e Rastreamento' : categoria)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === categoria || (categoria === 'Mapa' && selectedCategory === 'Mapa e Rastreamento')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-md'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {[
              {
                categoria: 'Chamados',
                q: 'Como criar um novo chamado de assistência?',
                a: 'Acesse o menu "Chamados" na barra lateral e clique em "Criar Chamado". Preencha os dados do cliente (nome, telefone, CPF), selecione o tipo de serviço necessário (reboque, chaveiro, troca de pneu, bateria, combustível ou mecânica), informe a localização de origem com endereço completo e, se aplicável, o destino. O sistema calculará automaticamente a distância e sugerirá prestadores próximos disponíveis baseado na geolocalização.'
              },
              {
                categoria: 'Chamados',
                q: 'Quais tipos de serviço posso solicitar?',
                a: 'O sistema oferece 6 tipos principais de serviço: Reboque (guincho para transporte do veículo), Chaveiro (abertura de portas, cópia de chaves), Troca de Pneu (remoção e instalação de estepe), Bateria (carga ou troca de bateria), Combustível (entrega de combustível no local) e Mecânica (reparos emergenciais no local). Cada serviço tem sua tabela de preços específica.'
              },
              {
                categoria: 'Chamados',
                q: 'Como funciona o cálculo de distância e preço?',
                a: 'O sistema utiliza a API do Google Maps para calcular a distância real entre a origem e o destino, considerando as vias disponíveis. Para serviços de reboque, o preço é calculado com base em: preço base do serviço + (distância em km × valor por km adicional). Para outros serviços, geralmente é cobrado apenas o preço base. Você pode consultar a tabela de preços completa no menu "Pagamentos".'
              },
              {
                categoria: 'Chamados',
                q: 'Posso cancelar um chamado após criá-lo?',
                a: 'Sim, você pode cancelar um chamado enquanto ele estiver com status "Aberto" ou "Em Andamento". Acesse a lista de chamados, clique no chamado desejado, e selecione "Cancelar Chamado". Será necessário informar o motivo do cancelamento. Atenção: se o prestador já estiver a caminho, podem ser aplicadas taxas de cancelamento conforme política da empresa.'
              },
              {
                categoria: 'Prestadores',
                q: 'Como funciona o sistema de busca de prestadores?',
                a: 'O sistema utiliza geolocalização para encontrar prestadores disponíveis em um raio de até 50km da localização do chamado. São considerados múltiplos fatores: tipo de serviço oferecido, disponibilidade atual (online/offline), avaliação média dos clientes, número de atendimentos realizados e tempo estimado de chegada. Você pode visualizar todos os prestadores sugeridos no mapa e escolher manualmente o mais adequado para cada situação.'
              },
              {
                categoria: 'Prestadores',
                q: 'Como cadastrar um novo prestador de serviço?',
                a: 'No menu "Prestadores", clique em "Cadastrar Prestador". Preencha: dados pessoais (nome, CPF) ou da empresa (razão social, CNPJ), documentos obrigatórios (CNH, Alvará, Licença de funcionamento), serviços que oferece (pode selecionar múltiplos), área de atuação (raio em km), dados bancários para recebimento (PIX, conta bancária). Após o cadastro, o prestador ficará com status "Pendente" até a aprovação da documentação pela equipe administrativa.'
              },
              {
                categoria: 'Prestadores',
                q: 'Como aprovar ou reprovar um prestador?',
                a: 'Acesse "Prestadores", filtre por status "Pendente". Clique no prestador para ver todos os detalhes e documentos enviados. Verifique: validade dos documentos, dados bancários corretos, serviços compatíveis com a demanda. Você pode "Aprovar" (prestador fica ativo e disponível para chamados) ou "Reprovar" (deve informar o motivo, prestador pode corrigir e reenviar documentação).'
              },
              {
                categoria: 'Prestadores',
                q: 'Como gerenciar a disponibilidade dos prestadores?',
                a: 'Na lista de prestadores, você pode ver o status de cada um: "Disponível" (verde, pode receber chamados), "Ocupado" (amarelo, em atendimento), "Indisponível" (vermelho, offline). Os prestadores podem alterar seu próprio status através do app mobile. Como administrador, você também pode forçar a indisponibilidade de um prestador temporariamente em casos especiais.'
              },
              {
                categoria: 'Mapa e Rastreamento',
                q: 'Como acompanhar atendimentos em tempo real?',
                a: 'Utilize o "Mapa ao Vivo" no menu Chamados. Nele você visualiza: todos os atendimentos em andamento (marcadores coloridos por status), localização atual dos prestadores (atualizada a cada 30 segundos), rotas traçadas do prestador até o cliente, tempo estimado de chegada (ETA), e histórico de movimentação. Clique em qualquer marcador para ver detalhes completos do chamado, incluindo dados do cliente, prestador e serviço.'
              },
              {
                categoria: 'Mapa e Rastreamento',
                q: 'O que significam as cores dos marcadores no mapa?',
                a: 'Azul: Chamado aberto, aguardando atribuição de prestador. Amarelo: Prestador a caminho do local. Verde: Prestador chegou, atendimento em execução. Roxo: Atendimento concluído, aguardando confirmação. Vermelho: Chamado com problema ou cancelado. Cinza: Chamados históricos/finalizados (quando ativado o filtro de histórico).'
              },
              {
                categoria: 'Pagamentos',
                q: 'Como gerenciar pagamentos e aprovar valores?',
                a: 'Acesse o menu "Pagamentos" para visualizar todos os pagamentos pendentes e finalizados. Para aprovar um pagamento: localize o chamado na lista, clique para ver detalhes completos, verifique o valor cobrado (deve estar de acordo com a tabela de preços), confira o comprovante de serviço (foto tirada pelo prestador), valide a quilometragem percorrida, e clique em "Aprovar Pagamento". Você pode filtrar por status (pendente/aprovado/rejeitado), data, prestador ou cliente.'
              },
              {
                categoria: 'Pagamentos',
                q: 'Como funciona a tabela de preços?',
                a: 'Acesse "Pagamentos" > "Tabela de Preços" para visualizar e editar os valores. Cada tipo de serviço tem: Preço Base (valor fixo do serviço), Preço por Km Adicional (apenas para reboque, cobrado após os primeiros km inclusos). Você pode editar os valores a qualquer momento, mas as alterações só afetarão novos chamados. Chamados já criados mantêm os valores vigentes no momento da criação.'
              },
              {
                categoria: 'Pagamentos',
                q: 'Como o prestador recebe o pagamento?',
                a: 'Após a aprovação do pagamento pelo administrador, o valor é liberado para o prestador. O pagamento pode ser feito via: PIX (instantâneo, usando a chave cadastrada), Transferência Bancária (1-2 dias úteis, para conta cadastrada), ou outro método acordado. O sistema registra data e hora de cada pagamento, e o prestador pode consultar seu histórico financeiro no app mobile.'
              },
              {
                categoria: 'Relatórios',
                q: 'Como emitir relatórios gerenciais?',
                a: 'Acesse o menu "Relatórios" e escolha o tipo desejado: Chamados (volume por período, status, tipos de serviço, tempos médios de atendimento), Prestadores (performance individual, avaliações, total de atendimentos, taxa de conclusão), Financeiro (receitas, despesas, lucro líquido, valores por prestador), ou Clientes (frequência de uso, satisfação, ticket médio). Selecione o período desejado, aplique filtros específicos se necessário e clique em "Gerar Relatório". Você pode visualizar online, exportar em PDF para impressão ou Excel para análise detalhada.'
              },
              {
                categoria: 'Relatórios',
                q: 'Quais métricas são mais importantes para acompanhar?',
                a: 'Recomendamos acompanhar: Tempo Médio de Atendimento (do chamado até conclusão), Taxa de Conclusão (% de chamados finalizados com sucesso), Avaliação Média dos Clientes (satisfação geral), Ticket Médio (valor médio por atendimento), Prestadores Ativos (quantos estão disponíveis), Chamados por Tipo de Serviço (demanda de cada categoria), e Receita Mensal (faturamento total). Essas métricas ajudam a identificar gargalos e oportunidades de melhoria.'
              },
              {
                categoria: 'Clientes',
                q: 'Como cadastrar um novo cliente?',
                a: 'Clientes podem ser cadastrados de duas formas: 1) Automaticamente ao criar um chamado (sistema cria o cadastro com os dados informados), ou 2) Manualmente no menu "Clientes" > "Cadastrar Cliente". Preencha: nome completo, CPF, telefone (obrigatório para contato), email (opcional), data de nascimento, endereço completo, dados do plano/seguro (se aplicável), e observações relevantes. O sistema valida CPF e evita duplicatas.'
              },
              {
                categoria: 'Clientes',
                q: 'Como gerenciar o histórico de um cliente?',
                a: 'Acesse "Clientes", busque pelo nome ou CPF, e clique no cliente desejado. Você verá: dados cadastrais completos, histórico de todos os chamados (com datas, serviços e valores), veículos cadastrados (placas, modelos), avaliações dadas aos prestadores, e observações registradas. Você pode editar qualquer informação, adicionar novos veículos, ou registrar observações importantes sobre o cliente.'
              },
              {
                categoria: 'Equipe',
                q: 'Como adicionar novos usuários ao sistema?',
                a: 'Acesse "Equipe" > "Adicionar Membro". Preencha: nome completo, email (será usado para login), telefone, setor (Operações, Financeiro, Administrativo, etc.), e nível de permissão (Admin: acesso total, Supervisor: visualiza tudo mas aprova apenas seu setor, Atendente: apenas cria e acompanha chamados). Após salvar, o usuário receberá um email com instruções para criar sua senha e acessar o sistema.'
              },
              {
                categoria: 'Equipe',
                q: 'Como funcionam as permissões de acesso?',
                a: 'O sistema tem 3 níveis: Admin (acesso total, pode criar usuários, aprovar pagamentos, editar tabela de preços, gerenciar prestadores), Supervisor (visualiza todos os dados, pode aprovar pagamentos do seu setor, gerenciar chamados), Atendente (cria chamados, acompanha atendimentos, visualiza relatórios básicos, não aprova pagamentos). As permissões podem ser ajustadas individualmente em casos especiais.'
              },
              {
                categoria: 'Segurança',
                q: 'Como ativar a autenticação de dois fatores (2FA)?',
                a: 'Acesse seu perfil > "Segurança" > "Autenticação de Dois Fatores". Clique em "Ativar 2FA", escaneie o QR Code com um app autenticador (Google Authenticator, Authy, Microsoft Authenticator), e digite o código de 6 dígitos para confirmar. A partir de agora, além da senha, você precisará do código do app para fazer login. Isso aumenta significativamente a segurança da sua conta.'
              },
              {
                categoria: 'Segurança',
                q: 'Como gerenciar dispositivos conectados?',
                a: 'Em "Segurança" > "Dispositivos com Acesso", você vê todos os dispositivos que acessaram sua conta: tipo (desktop, mobile, tablet), navegador, localização aproximada, e último acesso. Se identificar algum dispositivo desconhecido, clique em "Remover" imediatamente e altere sua senha. O dispositivo atual sempre aparece marcado e não pode ser removido.'
              },
              {
                categoria: 'Sistema',
                q: 'Como funciona o sistema de notificações?',
                a: 'Você recebe notificações em tempo real para eventos importantes: novo chamado criado, prestador atribuído, atendimento iniciado, atendimento concluído, pagamento pendente de aprovação, novo prestador aguardando aprovação, e alertas do sistema. As notificações aparecem no sino do header (canto superior direito) e podem ser configuradas para envio por email também.'
              },
              {
                categoria: 'Sistema',
                q: 'Os dados são salvos automaticamente?',
                a: 'Sim, o sistema salva automaticamente todas as alterações. Ao criar ou editar um chamado, cliente, prestador ou qualquer outro dado, as informações são salvas imediatamente no banco de dados. Você verá uma mensagem de confirmação (toast) no canto da tela indicando que a operação foi bem-sucedida. Não é necessário clicar em "Salvar" manualmente.'
              },
              {
                categoria: 'Sistema',
                q: 'Como funciona o sistema de logs?',
                a: 'Todas as ações importantes são registradas em "Logs do Sistema": criação/edição/exclusão de registros, aprovações, login/logout de usuários, alterações de status, e erros do sistema. Cada log contém: data/hora exata, usuário responsável, tipo de ação, descrição detalhada, e IP de origem. Isso permite auditoria completa e rastreamento de qualquer operação realizada no sistema.'
              }
            ]
            .filter(faq => selectedCategory === 'Todos' || faq.categoria === selectedCategory)
            .map((faq, index) => (
              <details
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 group"
              >
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* Modal de Contato Minimalista */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="p-8">
            <DialogTitle className="text-2xl font-semibold text-gray-900 mb-2">
              Entre em Contato
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-8">
              Escolha a melhor forma de falar conosco
            </DialogDescription>

            <div className="space-y-3">
              <a
                href="tel:11999999999"
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Telefone</p>
                  <p className="text-lg font-semibold text-blue-600">(11) 99999-9999</p>
                </div>
              </a>

              <a
                href="mailto:suporte@vip-assist.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm font-semibold text-green-600 truncate">suporte@vip-assist.com</p>
                </div>
              </a>

              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm font-semibold text-emerald-600">Chat ao vivo</p>
                </div>
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Horário de Atendimento</p>
                  <p>Segunda a Sexta, 8h às 18h</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
