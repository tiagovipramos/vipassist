// ⚠️ TODO: Esta página precisa ser refatorada para o pattern Server + Client Component
// para adicionar metadata SEO. Ver exemplo em src/app/(autenticado)/chat/page.tsx
// Use: generatePageMetadata('suporte') de src/lib/metadata/pages.ts

'use client';

import { useState } from 'react';
import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { FAQSection } from './components/FAQSection';
import { ContactOptions } from './components/ContactOptions';
import { TicketList } from './components/TicketList';
import { TicketForm } from './components/TicketForm';
import {
  categoriasBase,
  artigoWhatsApp,
  ticketsSuporte,
  tutoriais,
  statusServicos,
  incidentes,
  manutencoesProgramadas
} from '@/lib/mocks/suporte';

type Aba = 'inicio' | 'base' | 'tickets' | 'chat' | 'docs' | 'tutoriais' | 'status';

export function SuporteClient() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('inicio');
  const [mostrarArtigo, setMostrarArtigo] = useState(false);
  const [ticketSelecionado, setTicketSelecionado] = useState<string | null>(null);
  const [mostrarNovoTicket, setMostrarNovoTicket] = useState(false);

  return (
    <div className="p-4 space-y-4">
      {/* Abas */}
      <Card className="p-1">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setAbaAtiva('inicio')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              abaAtiva === 'inicio'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏠 INÍCIO
          </button>
          <button
            onClick={() => setAbaAtiva('base')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              abaAtiva === 'base'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📚 BASE CONHECIMENTO
          </button>
          <button
            onClick={() => setAbaAtiva('tickets')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              abaAtiva === 'tickets'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎫 MEUS TICKETS
          </button>
          <button
            onClick={() => setAbaAtiva('chat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              abaAtiva === 'chat'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💬 CHAT AO VIVO
          </button>
          <button
            onClick={() => setAbaAtiva('docs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              abaAtiva === 'docs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📖 DOCUMENTAÇÃO
          </button>
          <button
            onClick={() => setAbaAtiva('tutoriais')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              abaAtiva === 'tutoriais'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎓 TUTORIAIS
          </button>
          <button
            onClick={() => setAbaAtiva('status')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              abaAtiva === 'status'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ⚙️ STATUS
          </button>
        </div>
      </Card>

      {/* Conteúdo das Abas */}
      {abaAtiva === 'inicio' && <AbaInicio />}
      {abaAtiva === 'base' && (
        <AbaBase 
          mostrarArtigo={mostrarArtigo}
          setMostrarArtigo={setMostrarArtigo}
        />
      )}
      {abaAtiva === 'tickets' && (
        <AbaTickets
          ticketSelecionado={ticketSelecionado}
          setTicketSelecionado={setTicketSelecionado}
          mostrarNovoTicket={mostrarNovoTicket}
          setMostrarNovoTicket={setMostrarNovoTicket}
        />
      )}
      {abaAtiva === 'chat' && <AbaChat />}
      {abaAtiva === 'docs' && <AbaDocs />}
      {abaAtiva === 'tutoriais' && <AbaTutoriais />}
      {abaAtiva === 'status' && <AbaStatus />}
    </div>
  );
}

// Aba Início
function AbaInicio() {
  return (
    <div className="space-y-6">
      <FAQSection />
      <ContactOptions />
    </div>
  );
}

// Aba Base de Conhecimento
function AbaBase({ 
  mostrarArtigo, 
  setMostrarArtigo 
}: { 
  mostrarArtigo: boolean; 
  setMostrarArtigo: (v: boolean) => void;
}) {
  if (mostrarArtigo) {
    return <ArtigoDetalhes setMostrarArtigo={setMostrarArtigo} />;
  }

  return (
    <div className="space-y-6">
      {/* Busca */}
      <Card className="p-6">
        <div className="flex gap-3">
          <Input
            placeholder="Buscar artigos..."
            className="flex-1"
          />
          <Button className="bg-blue-600 hover:bg-blue-700">
            🔍 BUSCAR
          </Button>
        </div>
      </Card>

      {/* Categorias */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📂 CATEGORIAS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoriasBase.map((categoria) => (
            <Card key={categoria.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{categoria.icone}</div>
                <h4 className="font-bold text-gray-900">{categoria.nome}</h4>
                <p className="text-sm text-gray-500 mt-1">{categoria.totalArtigos} artigos</p>
              </div>
              <ul className="space-y-1 text-sm text-gray-600 mb-4">
                {categoria.subtopicos.map((sub, idx) => (
                  <li key={idx}>• {sub}</li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setMostrarArtigo(true)}
              >
                VER ARTIGOS
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Artigo Detalhes
function ArtigoDetalhes({ setMostrarArtigo }: { setMostrarArtigo: (v: boolean) => void }) {
  const artigo = artigoWhatsApp;

  return (
    <div className="space-y-6">
      {/* Header do Artigo */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{artigo.titulo}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📂 {artigo.categoria} › {artigo.subcategoria}</span>
              <span>👁️ {artigo.visualizacoes.toLocaleString('pt-BR')} visualizações</span>
              <span>⭐ {artigo.avaliacao.media}/5.0 ({artigo.avaliacao.total} avaliações)</span>
              <span>📅 Atualizado em: {artigo.atualizado}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setMostrarArtigo(false)}
          >
            ✕ FECHAR
          </Button>
        </div>
      </Card>

      {/* Conteúdo do Artigo */}
      <Card className="p-8">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {artigo.conteudo}
          </div>
        </div>
      </Card>

      {/* Feedback */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📌 ESTE ARTIGO FOI ÚTIL?</h3>
        <div className="flex gap-3 mb-4">
          <Button className="bg-green-600 hover:bg-green-700">
            👍 Sim ({artigo.avaliacao.positivos})
          </Button>
          <Button variant="outline">
            👎 Não ({artigo.avaliacao.negativos})
          </Button>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            💬 Deixe um comentário ou sugestão:
          </label>
          <textarea
            className="w-full border rounded-lg p-3 text-sm"
            rows={3}
            placeholder="Seu feedback..."
          />
          <Button className="mt-2 bg-blue-600 hover:bg-blue-700">
            ENVIAR FEEDBACK
          </Button>
        </div>
      </Card>

      {/* Artigos Relacionados */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📚 ARTIGOS RELACIONADOS</h3>
        <ul className="space-y-2">
          {artigo.artigosRelacionados.map((relacionado, idx) => (
            <li key={idx} className="text-blue-600 hover:underline cursor-pointer">
              • {relacionado}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// Aba Tickets
function AbaTickets({
  ticketSelecionado,
  setTicketSelecionado,
  mostrarNovoTicket,
  setMostrarNovoTicket
}: {
  ticketSelecionado: string | null;
  setTicketSelecionado: (id: string | null) => void;
  mostrarNovoTicket: boolean;
  setMostrarNovoTicket: (v: boolean) => void;
}) {
  if (mostrarNovoTicket) {
    return <TicketForm onClose={() => setMostrarNovoTicket(false)} />;
  }

  if (ticketSelecionado) {
    const ticket = ticketsSuporte.find(t => t.id === ticketSelecionado);
    if (ticket) {
      return <TicketDetalhes ticket={ticket} setTicketSelecionado={setTicketSelecionado} />;
    }
  }

  return (
    <TicketList 
      onSelectTicket={setTicketSelecionado}
      onNewTicket={() => setMostrarNovoTicket(true)}
    />
  );
}

// Ticket Detalhes
function TicketDetalhes({ 
  ticket, 
  setTicketSelecionado 
}: { 
  ticket: any; 
  setTicketSelecionado: (id: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              🎫 TICKET {ticket.numero} - {ticket.assunto.toUpperCase()}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <span>
                Status: {ticket.status === 'aberto' && '🟢 Aberto'}
                {ticket.status === 'em_andamento' && '⏳ Em andamento'}
                {ticket.status === 'resolvido' && '✅ Resolvido'}
              </span>
              <span>Prioridade: {ticket.prioridade === 'alta' && '🔴 Alta'}
                {ticket.prioridade === 'media' && '🟡 Média'}
                {ticket.prioridade === 'baixa' && '🟢 Baixa'}</span>
              <span>Criado: {ticket.criado}</span>
            </div>
            {ticket.atribuidoPara && (
              <p className="text-sm text-gray-600 mt-1">
                Atribuído para: {ticket.atribuidoPara.nome} ({ticket.atribuidoPara.cargo})
              </p>
            )}
          </div>
          <Button variant="outline" onClick={() => setTicketSelecionado(null)}>
            ✕ FECHAR
          </Button>
        </div>
      </Card>

      {/* Conversa */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-6">💬 CONVERSA DO TICKET</h3>
        <div className="space-y-6">
          {ticket.mensagens.map((msg: any) => (
            <div key={msg.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {msg.remetente.avatar || msg.remetente.nome.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{msg.remetente.nome}</span>
                    {msg.remetente.tipo === 'suporte' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        Suporte
                      </span>
                    )}
                    <span className="text-sm text-gray-500">• {msg.dataHora}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                    {msg.mensagem}
                  </div>
                  {msg.anexos && msg.anexos.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {msg.anexos.map((anexo: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded">
                          📎 {anexo.nome} ({anexo.tamanho})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {ticket.status === 'aberto' && (
            <div className="text-center py-4 text-gray-500">
              ⏳ Aguardando sua resposta...
            </div>
          )}
        </div>
      </Card>

      {/* Responder */}
      {ticket.status !== 'resolvido' && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">✍️ RESPONDER:</h3>
          <textarea
            className="w-full border rounded-lg p-3 mb-4"
            rows={4}
            placeholder="Digite sua resposta..."
          />
          <div className="flex justify-between items-center">
            <Button variant="outline">
              📎 ANEXAR ARQUIVO
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="text-green-600">
                ✅ MARCAR COMO RESOLVIDO
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                ENVIAR RESPOSTA
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Aba Chat
function AbaChat() {
  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="text-center space-y-4">
          <div className="text-6xl">💬</div>
          <h2 className="text-2xl font-bold text-gray-900">CHAT AO VIVO COM SUPORTE</h2>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
            🟢 ONLINE - Tempo médio de resposta: 2 minutos
          </div>
          <p className="text-gray-600">Disponível: Seg-Sex 8h às 18h</p>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
            💬 INICIAR CHAT AGORA
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                🤖
              </div>
              <div>
                <p className="font-semibold text-gray-900">Bot Kortex</p>
                <p className="text-sm text-gray-500">há 2 min</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-gray-700">
              Olá! Sou o assistente virtual do Kortex. Como posso te ajudar hoje?
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm">Conectar WhatsApp</Button>
              <Button variant="outline" size="sm">Problema técnico</Button>
              <Button variant="outline" size="sm">Dúvida sobre plano</Button>
              <Button variant="outline" size="sm">Outro</Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex gap-3">
              <Input placeholder="Digite sua mensagem..." className="flex-1" />
              <Button variant="outline" size="sm">📎</Button>
              <Button variant="outline" size="sm">😊</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">➤</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
        💡 O chat funciona em tempo real com bot inicial e transferência para humano se necessário
      </div>
    </div>
  );
}

// Aba Docs
function AbaDocs() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📖 DOCUMENTAÇÃO TÉCNICA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🚀', title: 'INÍCIO RÁPIDO', desc: 'Primeiros passos com o sistema' },
            { icon: '📡', title: 'API', desc: 'Documentação API completa' },
            { icon: '🔗', title: 'WEBHOOKS', desc: 'Configurar webhooks' },
            { icon: '💻', title: 'DESENVOLVEDORES', desc: 'SDKs e bibliotecas' }
          ].map((item, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
              <Button variant="outline" className="w-full">ACESSAR</Button>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📚 GUIAS TÉCNICOS</h3>
        <ul className="space-y-2">
          {[
            'Autenticação e segurança',
            'Rate limits e quotas',
            'Webhooks: eventos e payloads',
            'Integração com sistemas externos',
            'Boas práticas de desenvolvimento',
            'Changelog da API'
          ].map((item, idx) => (
            <li key={idx} className="text-blue-600 hover:underline cursor-pointer">
              • {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">🔧 EXEMPLOS DE CÓDIGO</h3>
          <div className="flex gap-2">
            {['JavaScript', 'Python', 'PHP', 'Ruby', 'Java'].map((lang) => (
              <button key={lang} className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm">
{`// Enviar mensagem via API
const response = await fetch('https://api.kortex.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+5585999991234',
    channel: 'whatsapp',
    text: 'Olá! Mensagem enviada via API'
  })
});`}
          </pre>
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="outline">COPIAR CÓDIGO</Button>
          <Button variant="outline">VER MAIS EXEMPLOS</Button>
        </div>
      </Card>
    </div>
  );
}

// Aba Tutoriais
function AbaTutoriais() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🎓 TUTORIAIS EM VÍDEO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tutoriais.map((tutorial) => (
            <Card key={tutorial.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-40 flex items-center justify-center text-white text-6xl">
                🎥
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{tutorial.titulo}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutorial.descricao}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>⏱️ {tutorial.duracao}</span>
                  <span>👁️ {tutorial.visualizacoes.toLocaleString('pt-BR')} views</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  ▶️ ASSISTIR
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📺 WEBINARS GRAVADOS</h3>
        <ul className="space-y-3">
          {[
            { titulo: 'Como escalar atendimento com IA', duracao: '45 min' },
            { titulo: 'Automações avançadas: cases reais', duracao: '60 min' },
            { titulo: 'Integração com e-commerce', duracao: '30 min' },
            { titulo: 'Métricas que importam no atendimento', duracao: '40 min' }
          ].map((webinar, idx) => (
            <li key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📺</span>
                <span className="font-medium text-gray-900">{webinar.titulo}</span>
              </div>
              <span className="text-sm text-gray-500">{webinar.duracao}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// Aba Status
function AbaStatus() {
  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="text-center space-y-2">
          <div className="text-6xl">🟢</div>
          <h2 className="text-2xl font-bold text-gray-900">TODOS OS SISTEMAS OPERACIONAIS</h2>
          <p className="text-gray-600">Última atualização: há 30 segundos</p>
          <Button variant="outline">🔄 Atualizar</Button>
        </div>
      </Card>

      {/* Status dos Serviços */}
      <Card>
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900">📊 SERVIÇOS</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uptime (30 dias)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statusServicos.map((servico, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{servico.icone}</span>
                      <span className="font-medium text-gray-900">{servico.nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      🟢 Online
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{servico.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Histórico de Incidentes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">📅 HISTÓRICO DE INCIDENTES</h3>
          <Button variant="outline">Ver histórico completo</Button>
        </div>
        {incidentes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            ✅ Nenhum incidente nos últimos 30 dias
          </div>
        ) : (
          <div className="space-y-3">
            {incidentes.map((incidente) => (
              <div key={incidente.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{incidente.titulo}</h4>
                  {incidente.resolvido && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      ✅ Resolvido
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{incidente.descricao}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{incidente.data}</span>
                  <span>•</span>
                  <span>Duração: {incidente.duracao}</span>
                  <span>•</span>
                  <span>Impacto: {incidente.impacto}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 text-sm text-gray-600">
          Último incidente: 05/10/2025 - Latência alta na API (resolvido em 15 minutos)
        </div>
      </Card>

      {/* Manutenções Programadas */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📅 MANUTENÇÕES PROGRAMADAS</h3>
        <div className="space-y-3">
          {manutencoesProgramadas.map((manutencao) => (
            <div key={manutencao.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛠️</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{manutencao.titulo}</h4>
                  <p className="text-sm text-gray-700 mb-2">{manutencao.descricao}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>📅 {manutencao.dataInicio} - {manutencao.dataFim}</span>
                    <span>•</span>
                    <span>Impacto: {manutencao.impacto}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Serviços afetados: {manutencao.servicos.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
