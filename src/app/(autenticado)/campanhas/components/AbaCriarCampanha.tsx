'use client';

import { useState } from 'react';
import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/componentes/ui/dialog';
import { 
  resumoCampanhas,
  engajamentoCanais,
  topCampanhas,
  alertas,
  atividadesRecentes,
  campanhasMockadas
} from '@/lib/mocks/campanhas';
import { 
  Search, 
  Settings, 
  Bell, 
  TrendingUp,
  Send,
  CheckCircle2,
  Eye,
  MessageCircle,
  Target,
  DollarSign,
  BarChart3,
  AlertCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  Mail,
  Users,
  MessageSquare,
  Phone
} from 'lucide-react';

function AbaCriarCampanha() {
  const [etapa, setEtapa] = useState(1);
  const [nomeCampanha, setNomeCampanha] = useState('');
  const [canalSelecionado, setCanalSelecionado] = useState<'whatsapp' | 'email' | 'sms' | 'ligacoes'>('whatsapp');
  const [mensagem, setMensagem] = useState('');
  const [tipoPublico, setTipoPublico] = useState<'segmentado' | 'todos' | 'upload'>('segmentado');
  const [arquivoUpload, setArquivoUpload] = useState<File | null>(null);
  const [colunasCSV, setColunasCSV] = useState<string[]>([]);
  const [variaveisPadrao, setVariaveisPadrao] = useState<string[]>(['nome', 'email', 'telefone', 'cidade']);
  const [novaVariavel, setNovaVariavel] = useState('');

  const proximaEtapa = () => {
    if (etapa < 4) setEtapa(etapa + 1);
  };

  const etapaAnterior = () => {
    if (etapa > 1) setEtapa(etapa - 1);
  };

  const finalizarCampanha = () => {
    alert('✅ Campanha criada com sucesso!\n\nSua campanha foi agendada e começará em breve.');
    setEtapa(1);
    setNomeCampanha('');
    setMensagem('');
  };

  return (
    <div>
      <Card className="p-8">
        {/* CABEÇALHO */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">🚀 Criar Nova Campanha</h2>
          <p className="text-gray-600">Siga os passos para criar e enviar sua campanha em massa</p>
        </div>

        {/* PROGRESSO */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-medium">Etapa {etapa}/4</span>
            <span className="text-gray-600">{Math.round((etapa / 4) * 100)}% completo</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
              style={{ width: `${(etapa / 4) * 100}%` }}
            />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className={`flex items-center gap-2 ${etapa >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${etapa >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                {etapa > 1 ? '✓' : '1'}
              </div>
              <span className="text-sm font-medium">Informações</span>
            </div>
            <div className={`flex items-center gap-2 ${etapa >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${etapa >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                {etapa > 2 ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium">Público</span>
            </div>
            <div className={`flex items-center gap-2 ${etapa >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${etapa >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                {etapa > 3 ? '✓' : '3'}
              </div>
              <span className="text-sm font-medium">Mensagem</span>
            </div>
            <div className={`flex items-center gap-2 ${etapa >= 4 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${etapa >= 4 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                4
              </div>
              <span className="text-sm font-medium">Revisão</span>
            </div>
          </div>
        </div>

        {/* ETAPA 1: INFORMAÇÕES */}
        {etapa === 1 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Nome da campanha *</label>
              <Input
                placeholder="Ex: Promoção Fim de Semana"
                value={nomeCampanha}
                onChange={(e) => setNomeCampanha(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-600">💡 Use um nome descritivo para encontrar facilmente depois</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Descrição (opcional)</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:outline-none"
                rows={3}
                placeholder="Campanha promocional para aumentar vendas no fim de semana..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">📱 Canal de Envio *</label>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => setCanalSelecionado('whatsapp')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-6 transition-all ${
                    canalSelecionado === 'whatsapp'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MessageCircle className={`h-10 w-10 ${canalSelecionado === 'whatsapp' ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium">WhatsApp</span>
                  <span className="text-xs text-gray-600">12.345 contatos</span>
                </button>
                <button
                  onClick={() => setCanalSelecionado('email')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-6 transition-all ${
                    canalSelecionado === 'email'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Mail className={`h-10 w-10 ${canalSelecionado === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Email</span>
                  <span className="text-xs text-gray-600">15.678 contatos</span>
                </button>
                <button
                  onClick={() => setCanalSelecionado('sms')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-6 transition-all ${
                    canalSelecionado === 'sms'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MessageSquare className={`h-10 w-10 ${canalSelecionado === 'sms' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className="font-medium">SMS</span>
                  <span className="text-xs text-gray-600">10.234 contatos</span>
                </button>
                <button
                  onClick={() => setCanalSelecionado('ligacoes')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-6 transition-all ${
                    canalSelecionado === 'ligacoes'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Phone className={`h-10 w-10 ${canalSelecionado === 'ligacoes' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Ligações</span>
                  <span className="text-xs text-gray-600">8.912 contatos</span>
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">⚠️ ATENÇÃO: Respeite as regras do WhatsApp Business</p>
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                <li>• Apenas para clientes que já interagiram com você</li>
                <li>• Evite spam ou conteúdo não solicitado</li>
                <li>• Máximo 1.000 envios por hora (seu plano)</li>
              </ul>
            </div>
          </div>
        )}

        {/* ETAPA 2: PÚBLICO */}
        {etapa === 2 && (
          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium">🎯 Selecionar Público-Alvo</label>
              <div className="space-y-3">
                <button
                  onClick={() => setTipoPublico('segmentado')}
                  className={`flex w-full items-center justify-between rounded-lg border-2 p-4 transition-all ${
                    tipoPublico === 'segmentado'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      tipoPublico === 'segmentado' ? 'border-purple-600 bg-white' : 'border-gray-300'
                    }`}>
                      {tipoPublico === 'segmentado' && <div className="h-3 w-3 rounded-full bg-purple-600" />}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Segmentar público (recomendado)</p>
                      <p className="text-sm text-gray-600">Escolha filtros para segmentar seus clientes</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setTipoPublico('todos')}
                  className={`flex w-full items-center justify-between rounded-lg border-2 p-4 transition-all ${
                    tipoPublico === 'todos'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      tipoPublico === 'todos' ? 'border-purple-600 bg-white' : 'border-gray-300'
                    }`}>
                      {tipoPublico === 'todos' && <div className="h-3 w-3 rounded-full bg-purple-600" />}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Todos os contatos</p>
                      <p className="text-sm text-gray-600">12.345 clientes</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setTipoPublico('upload')}
                  className={`flex w-full items-center justify-between rounded-lg border-2 p-4 transition-all ${
                    tipoPublico === 'upload'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      tipoPublico === 'upload' ? 'border-purple-600 bg-white' : 'border-gray-300'
                    }`}>
                      {tipoPublico === 'upload' && <div className="h-3 w-3 rounded-full bg-purple-600" />}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Upload de Lista</p>
                      <p className="text-sm text-gray-600">Envie um arquivo CSV ou Excel com seus contatos</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* ÁREA DE UPLOAD */}
            {tipoPublico === 'upload' && (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                {arquivoUpload ? (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-green-600">✅ Arquivo carregado:</p>
                    <p className="mt-1 text-sm text-gray-700">{arquivoUpload.name}</p>
                    <p className="text-xs text-gray-500">{(arquivoUpload.size / 1024).toFixed(2)} KB</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setArquivoUpload(null)}
                    >
                      Remover arquivo
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Arraste e solte seu arquivo aqui ou
                    </p>
                    <label className="inline-block cursor-pointer">
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setArquivoUpload(file);
                            // Ler o arquivo para extrair as colunas
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const text = event.target?.result as string;
                              // Pegar a primeira linha (cabeçalhos)
                              const primeiraLinha = text.split('\n')[0];
                              // Separar por vírgula ou ponto-e-vírgula
                              const colunas = primeiraLinha.split(/[,;]/).map(col => col.trim().replace(/["\r]/g, ''));
                              setColunasCSV(colunas);
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                      <span className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                        Selecionar Arquivo
                      </span>
                    </label>
                    <p className="mt-3 text-xs text-gray-500">
                      Formatos aceitos: CSV, Excel (.xlsx, .xls)
                    </p>
                  </>
                )}

                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-left">
                  <p className="mb-2 text-xs font-medium text-blue-800">📋 Formato do arquivo:</p>
                  <ul className="space-y-1 text-xs text-blue-700">
                    <li>• Primeira linha deve conter os cabeçalhos</li>
                    <li>• Colunas obrigatórias: <code className="rounded bg-white px-1 font-mono">nome</code>, <code className="rounded bg-white px-1 font-mono">telefone</code></li>
                    <li>• Colunas opcionais: email, cidade, estado</li>
                    <li>• Telefone no formato: +55 11 99999-9999</li>
                  </ul>
                  <Button variant="link" size="sm" className="mt-2 p-0 text-xs">
                    Baixar modelo de arquivo
                  </Button>
                </div>
              </div>
            )}

            <Card className="p-5">
              <h4 className="mb-4 font-semibold">📊 Resumo do Público:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">👥 Total de destinatários:</span>
                  <span className="font-semibold">
                    {tipoPublico === 'todos' ? '12.345' : tipoPublico === 'upload' && arquivoUpload ? '2.847' : '1.234'} clientes
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">💚 {canalSelecionado === 'whatsapp' ? 'WhatsApp' : canalSelecionado === 'email' ? 'Email' : 'SMS'}:</span>
                  <span className="font-semibold">
                    {tipoPublico === 'todos' ? '12.345' : tipoPublico === 'upload' && arquivoUpload ? '2.847' : '1.234'} (100%)
                  </span>
                </div>
                {tipoPublico !== 'todos' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">⚠️ Excluídos:</span>
                    <span className="font-semibold">{tipoPublico === 'upload' && arquivoUpload ? '153' : '23'} clientes</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-gray-600">💰 Custo estimado:</span>
                  <span className="font-semibold text-green-600">
                    R$ {tipoPublico === 'todos' ? '1.851,75' : tipoPublico === 'upload' && arquivoUpload ? '427,05' : '185,10'}
                  </span>
                </div>
              </div>
            </Card>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">💡 Dica: Segmente seu público para melhorar a taxa de conversão</p>
            </div>
          </div>
        )}

        {/* ETAPA 3: MENSAGEM */}
        {etapa === 3 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">✍️ Criar Mensagem</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-purple-500 focus:outline-none"
                rows={10}
                placeholder="Olá {{nome}}! 👋

Aproveitando o fim de semana? 🌞

Temos uma SUPER PROMOÇÃO especial para você:

🔥 30% OFF em todos os produtos
🚚 Frete GRÁTIS acima de R$ 100
🎁 Brinde surpresa em compras acima de R$ 200

⏰ Válido só até domingo!

Use o cupom: WEEKEND30

Dúvidas? Responda esta mensagem! 😊"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
              <p className="mt-2 text-xs text-gray-600">Caracteres: {mensagem.length} / 1000</p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="mb-2 text-sm font-medium text-blue-800">💡 Variáveis disponíveis:</p>
              
              {/* Variáveis Padrão */}
              <div className="mb-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-blue-700">Padrão:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={novaVariavel}
                      onChange={(e) => setNovaVariavel(e.target.value)}
                      placeholder="nova_variavel"
                      className="rounded border border-blue-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && novaVariavel.trim()) {
                          setVariaveisPadrao([...variaveisPadrao, novaVariavel.trim()]);
                          setNovaVariavel('');
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (novaVariavel.trim()) {
                          setVariaveisPadrao([...variaveisPadrao, novaVariavel.trim()]);
                          setNovaVariavel('');
                        }
                      }}
                      className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      title="Adicionar variável"
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variaveisPadrao.map((variavel, index) => (
                    <div key={index} className="group relative">
                      <button
                        onClick={() => setMensagem(mensagem + `{{${variavel}}}`)}
                        className="rounded bg-white px-2 py-1 text-xs font-mono text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        {`{{${variavel}}}`}
                      </button>
                      <button
                        onClick={() => setVariaveisPadrao(variaveisPadrao.filter((_, i) => i !== index))}
                        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover variável"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variáveis do CSV (se arquivo foi carregado) */}
              {colunasCSV.length > 0 && (
                <div className="border-t border-blue-300 pt-3">
                  <p className="mb-2 text-xs font-medium text-purple-700">📄 Do seu arquivo CSV:</p>
                  <div className="flex flex-wrap gap-2">
                    {colunasCSV.map((coluna, index) => (
                      <div key={index} className="group relative">
                        <button
                          onClick={() => setMensagem(mensagem + `{{${coluna}}}`)}
                          className="rounded bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 px-2 py-1 text-xs font-mono text-purple-700 hover:from-purple-100 hover:to-pink-100 transition-colors"
                        >
                          {`{{${coluna}}}`}
                        </button>
                        <button
                          onClick={() => setColunasCSV(colunasCSV.filter((_, i) => i !== index))}
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remover variável"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-purple-600">
                    ✨ Clique em qualquer variável para inseri-la na mensagem
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ETAPA 4: REVISÃO */}
        {etapa === 4 && (
          <div className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-5">
              <h4 className="mb-2 font-semibold text-green-800">✅ Tudo pronto para enviar!</h4>
              <p className="text-sm text-green-700">Revise as informações abaixo antes de confirmar</p>
            </div>

            <Card className="p-5">
              <h4 className="mb-4 font-semibold">📋 Resumo da Campanha:</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-600">📌 Nome:</span>
                  <p className="mt-1 font-medium">{nomeCampanha || 'Sem nome'}</p>
                </div>
                <div>
                  <span className="text-gray-600">📱 Canal:</span>
                  <p className="mt-1 font-medium">
                    {canalSelecionado === 'whatsapp' ? '💚 WhatsApp' : canalSelecionado === 'email' ? '📧 Email' : '📱 SMS'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">👥 Público:</span>
                  <p className="mt-1 font-medium">1.234 clientes</p>
                </div>
                <div>
                  <span className="text-gray-600">💬 Mensagem:</span>
                  <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs">
                    {mensagem || 'Nenhuma mensagem escrita'}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <span className="text-gray-600">💰 Custo estimado:</span>
                  <p className="mt-1 text-lg font-semibold text-green-600">R$ 185,10</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 h-4 w-4" defaultChecked />
                <span className="text-sm">Li e concordo que esta campanha respeita as políticas do WhatsApp</span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 h-4 w-4" defaultChecked />
                <span className="text-sm">Confirmo que tenho permissão para contatar estes clientes</span>
              </label>
            </div>
          </div>
        )}

        {/* BOTÕES DE NAVEGAÇÃO */}
        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={etapaAnterior}
            disabled={etapa === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          {etapa < 4 ? (
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              onClick={proximaEtapa}
              disabled={etapa === 1 && !nomeCampanha}
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="bg-gradient-to-r from-green-600 to-emerald-600"
              onClick={finalizarCampanha}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmar e Enviar
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export { AbaCriarCampanha };
