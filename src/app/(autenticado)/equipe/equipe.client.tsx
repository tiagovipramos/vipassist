'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Badge } from '@/componentes/ui/badge';
import { Shield, CheckCircle2, XCircle, Key } from 'lucide-react';
import type { Membro, StatusMembro, CargoMembro, EstatisticasEquipe } from '@/tipos/equipe';

type AbaEquipe = 'membros' | 'setores' | 'permissoes' | 'organograma';
type VisualizacaoMembros = 'cards' | 'tabela';

export function EquipeClient() {
  const [abaAtiva, setAbaAtiva] = useState<AbaEquipe>('membros');
  const [visualizacao, setVisualizacao] = useState<VisualizacaoMembros>('cards');
  const [filtroStatus, setFiltroStatus] = useState<StatusMembro | 'todos'>('todos');
  const [filtroCargo, setFiltroCargo] = useState<CargoMembro | 'todos'>('todos');
  const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [abaModal, setAbaModal] = useState<'dados' | 'atividade'>('dados');
  const [modalSetorAberto, setModalSetorAberto] = useState(false);
  const [setorSelecionado, setSetorSelecionado] = useState<'atendente' | 'gestor' | 'admin' | null>(null);
  
  // Estados para modal de adicionar membro
  const [modalAdicionarMembroAberto, setModalAdicionarMembroAberto] = useState(false);
  const [criandoMembro, setCriandoMembro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [novoMembro, setNovoMembro] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cargo: 'atendente' as CargoMembro,
    setorId: ''
  });
  
  // Estados para dados da API
  const [membros, setMembros] = useState<Membro[]>([]);
  const [stats, setStats] = useState<EstatisticasEquipe | null>(null);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [setores, setSetores] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados para permissões
  const [permissoes, setPermissoes] = useState<Record<string, Record<string, boolean>>>({});
  const [carregandoPermissoes, setCarregandoPermissoes] = useState(false);
  const [salvandoPermissoes, setSalvandoPermissoes] = useState(false);
  const [permissoesAlteradas, setPermissoesAlteradas] = useState(false);

  // Carregar dados da API
  useEffect(() => {
    carregarDados();
  }, []);

  // Carregar permissões quando a aba é ativada
  useEffect(() => {
    if (abaAtiva === 'permissoes' && Object.keys(permissoes).length === 0) {
      carregarPermissoes();
    }
  }, [abaAtiva]);

  const carregarPermissoes = async () => {
    try {
      setCarregandoPermissoes(true);
      const response = await fetch('/api/permissoes');
      const result = await response.json();

      if (result.success) {
        setPermissoes(result.data);
      } else {
        alert('Erro ao carregar permissões');
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setCarregandoPermissoes(false);
    }
  };

  const handlePermissaoChange = (role: string, chave: string, valor: boolean) => {
    setPermissoes(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [chave]: valor
      }
    }));
    setPermissoesAlteradas(true);
  };

  const handleSalvarPermissoes = async () => {
    try {
      setSalvandoPermissoes(true);
      
      // Preparar array de atualizações
      const atualizacoes = [];
      for (const role in permissoes) {
        for (const chave in permissoes[role]) {
          atualizacoes.push({
            role,
            chave,
            ativo: permissoes[role][chave]
          });
        }
      }

      // Enviar todas as atualizações
      const resultados = await Promise.all(
        atualizacoes.map(async (update) => {
          const response = await fetch('/api/permissoes', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update)
          });
          return response.json();
        })
      );

      const sucesso = resultados.filter(r => r.success).length;
      const falhas = resultados.filter(r => !r.success).length;

      if (falhas === 0) {
        alert(`✅ Permissões salvas com sucesso! (${sucesso} atualizações)`);
        setPermissoesAlteradas(false);
      } else {
        alert(`⚠️ Permissões salvas parcialmente: ${sucesso} sucesso, ${falhas} falhas`);
      }
    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
      alert('❌ Erro ao salvar permissões');
    } finally {
      setSalvandoPermissoes(false);
    }
  };

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const [equipeResponse, setoresResponse] = await Promise.all([
        fetch('/api/equipe'),
        fetch('/api/setores')
      ]);

      const equipeResult = await equipeResponse.json();
      const setoresResult = await setoresResponse.json();

      if (equipeResult.success) {
        setMembros(equipeResult.data.membros);
        setStats(equipeResult.data.estatisticas);
      } else {
        setErro(equipeResult.error || 'Erro ao carregar dados');
      }

      if (setoresResult.success) {
        setSetores(setoresResult.data);
      }
    } catch (error) {
      console.error('Erro ao carregar equipe:', error);
      setErro('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  // Carregar atividades quando um membro é selecionado
  useEffect(() => {
    if (membroSelecionado && abaModal === 'atividade') {
      carregarAtividades(membroSelecionado.id);
    }
  }, [membroSelecionado, abaModal]);

  const carregarAtividades = async (membroId: string) => {
    try {
      const response = await fetch(`/api/equipe/${membroId}/atividades`);
      const result = await response.json();

      if (result.success) {
        setAtividades(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  // Handler para criar membro
  const handleCriarMembro = async () => {
    if (!novoMembro.nome.trim()) {
      alert('Por favor, preencha o nome completo');
      return;
    }
    if (!novoMembro.email.trim()) {
      alert('Por favor, preencha o email');
      return;
    }
    if (!novoMembro.senha.trim()) {
      alert('Por favor, preencha a senha');
      return;
    }
    if (novoMembro.senha.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      setCriandoMembro(true);

      const response = await fetch('/api/equipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: novoMembro.nome,
          email: novoMembro.email,
          senha: novoMembro.senha,
          telefone: novoMembro.telefone || undefined,
          role: novoMembro.cargo,
          setorId: novoMembro.setorId || undefined
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Membro criado com sucesso! As credenciais de acesso foram configuradas.');
        setModalAdicionarMembroAberto(false);
        setNovoMembro({
          nome: '',
          email: '',
          senha: '',
          telefone: '',
          cargo: 'atendente',
          setorId: ''
        });
        setMostrarSenha(false);
        carregarDados();
      } else {
        alert(`❌ Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao criar membro:', error);
      alert('❌ Erro ao criar membro');
    } finally {
      setCriandoMembro(false);
    }
  };

  // Filtrar membros
  const membrosFiltrados = membros.filter((membro) => {
    const matchStatus = filtroStatus === 'todos' || membro.status === filtroStatus;
    const matchCargo = filtroCargo === 'todos' || membro.cargo === filtroCargo;
    return matchStatus && matchCargo;
  });

  const getStatusColor = (status: StatusMembro) => {
    switch (status) {
      case 'online':
        return 'border-green-500';
      case 'offline':
        return 'border-red-500';
      case 'pausado':
        return 'border-yellow-500';
      case 'inativo':
        return 'border-gray-400';
      default:
        return 'border-gray-300';
    }
  };

  const getStatusBadge = (status: StatusMembro) => {
    switch (status) {
      case 'online':
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">🟢 Online</span>;
      case 'offline':
        return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">🔴 Offline</span>;
      case 'pausado':
        return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">⏸️ Pausado</span>;
      case 'inativo':
        return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">❌ Inativo</span>;
      default:
        return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">❓ Desconhecido</span>;
    }
  };

  const getCargoIcon = (cargo: CargoMembro) => {
    switch (cargo) {
      case 'admin':
        return '👑';
      case 'gestor':
        return '👤';
      case 'atendente':
        return '👤';
      case 'ia':
        return '🤖';
      default:
        return '👤';
    }
  };

  if (carregando) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="text-red-700">
            <h3 className="font-bold mb-2">❌ Erro ao carregar dados</h3>
            <p>{erro}</p>
            <Button 
              onClick={carregarDados} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              🔄 Tentar Novamente
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Abas */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {[
            { id: 'membros', label: '👥 MEMBROS' },
            { id: 'setores', label: '🏢 SETORES' },
            { id: 'permissoes', label: '🔐 PERMISSÕES' },
            { id: 'organograma', label: '📊 ORGANOGRAMA' },
          ].map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id as AbaEquipe)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                abaAtiva === aba.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das Abas */}
      {abaAtiva === 'membros' && stats && (
        <div className="space-y-6">
          {/* Cards Superiores */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-6 flex flex-col items-center justify-center text-center">
              <div className="text-sm text-gray-600 mb-2">👥 TOTAL MEMBROS</div>
              <div className="text-3xl font-bold">{stats.totalMembros}</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.totalHumanos} humanos<br />
                {stats.totalIAs} IAs
              </div>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center text-center">
              <div className="text-sm text-gray-600 mb-2">🟢 ONLINE AGORA</div>
              <div className="text-3xl font-bold">{stats.onlineAgora}</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.percentualOnline}% da equipe
              </div>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center text-center">
              <div className="text-sm text-gray-600 mb-2">💼 CARGOS</div>
              <div className="text-sm mt-2 space-y-1">
                <div>{stats.cargos.admins} Admins</div>
                <div>{stats.cargos.gestores} Gestores</div>
                <div>{stats.cargos.atendentes} Atendentes</div>
              </div>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center text-center">
              <div className="text-sm text-gray-600 mb-2">📅 NOVOS (30D)</div>
              <div className="text-3xl font-bold">{stats.novosMes}</div>
              <div className="text-xs text-green-600 mt-2">
                {stats.variacao === 'aumento' && '↑ vs mês anterior'}
                {stats.variacao === 'reducao' && '↓ vs mês anterior'}
                {stats.variacao === 'neutro' && '→ sem mudanças'}
              </div>
            </Card>
          </div>

          {/* Barra de Ações */}
          <div className="flex gap-3">
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setModalAdicionarMembroAberto(true)}
            >
              + ADICIONAR MEMBRO
            </Button>
            <Button variant="outline" onClick={carregarDados}>
              🔄 ATUALIZAR
            </Button>
          </div>

          {/* Filtros */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="font-medium text-sm mb-3">FILTROS:</div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Status:</label>
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value as StatusMembro | 'todos')}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="todos">Todos</option>
                    <option value="online">🟢 Online</option>
                    <option value="offline">🔴 Offline</option>
                    <option value="pausado">⏸️ Pausado</option>
                    <option value="inativo">❌ Inativo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">Cargo:</label>
                  <select
                    value={filtroCargo}
                    onChange={(e) => setFiltroCargo(e.target.value as CargoMembro | 'todos')}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="todos">Todos</option>
                    <option value="admin">Admin</option>
                    <option value="gestor">Gestor</option>
                    <option value="atendente">Atendente</option>
                    <option value="ia">IA</option>
                  </select>
                </div>

                <div className="ml-auto">
                  <label className="text-xs text-gray-600 block mb-1">Visualização:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVisualizacao('cards')}
                      className={`px-3 py-2 border rounded text-sm ${
                        visualizacao === 'cards'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-gray-300'
                      }`}
                    >
                      🎴 Cards
                    </button>
                    <button
                      onClick={() => setVisualizacao('tabela')}
                      className={`px-3 py-2 border rounded text-sm ${
                        visualizacao === 'tabela'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-gray-300'
                      }`}
                    >
                      📊 Tabela
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Visualização em Cards */}
          {visualizacao === 'cards' && (
            <div className="grid grid-cols-6 gap-4">
              {membrosFiltrados.map((membro) => (
                <Card
                  key={membro.id}
                  onClick={() => {
                    setMembroSelecionado(membro);
                    setModalAberto(true);
                    setAbaModal('dados');
                  }}
                  className={`p-4 border-2 ${getStatusColor(membro.status)} cursor-pointer hover:shadow-lg transition-shadow relative flex items-center justify-center`}
                >
                  <div className="absolute top-2 right-2 scale-75">
                    {getStatusBadge(membro.status)}
                  </div>

                  <div className="flex flex-col items-center justify-center text-center space-y-2 w-full">
                    <div>
                      {membro.tipo === 'ia' ? (
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                          🤖
                        </div>
                      ) : (
                        <Image
                          src={membro.avatar || '/avatars/default.png'}
                          alt={membro.nome}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      )}
                    </div>

                    <div className="w-full">
                      <div className="font-bold text-sm truncate">{membro.nome}</div>
                      <div className="text-xs text-gray-600 capitalize">
                        {getCargoIcon(membro.cargo)} {membro.cargo}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">🏢 {membro.setor}</div>

                    <div className="w-full">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full"
                          style={{ width: `${membro.performance}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{membro.performance}%</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Visualização em Tabela */}
          {visualizacao === 'tabela' && (
            <Card className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">FOTO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">NOME</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">CARGO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">SETOR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">PERF.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ATEND.</th>
                  </tr>
                </thead>
                <tbody>
                  {membrosFiltrados.map((membro) => (
                    <tr 
                      key={membro.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setMembroSelecionado(membro);
                        setModalAberto(true);
                        setAbaModal('dados');
                      }}
                    >
                      <td className="px-4 py-3">
                        {membro.tipo === 'ia' ? (
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                            🤖
                          </div>
                        ) : (
                          <Image
                            src={membro.avatar || '/avatars/default.png'}
                            alt={membro.nome}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {getCargoIcon(membro.cargo)} {membro.nome}
                          </div>
                          <div className="text-xs text-gray-500">{membro.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm capitalize">{membro.cargo}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{membro.setor}</td>
                      <td className="px-4 py-3">{getStatusBadge(membro.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${membro.performance}%` }}
                            />
                          </div>
                          <span className="text-xs">{membro.performance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{membro.stats.atendimentos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {membrosFiltrados.length === 0 && (
            <Card className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <div className="font-medium">Nenhum membro encontrado</div>
              <div className="text-sm mt-2">Tente ajustar os filtros</div>
            </Card>
          )}
        </div>
      )}

      {/* Modal de Detalhes do Membro */}
      {modalAberto && membroSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white border-b p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {membroSelecionado.tipo === 'ia' ? (
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                    🤖
                  </div>
                ) : (
                  <Image
                    src={membroSelecionado.avatar || '/avatars/default.png'}
                    alt={membroSelecionado.nome}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{membroSelecionado.nome}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600 capitalize">
                      {getCargoIcon(membroSelecionado.cargo)} {membroSelecionado.cargo}
                    </span>
                    <span className="text-gray-400">•</span>
                    {getStatusBadge(membroSelecionado.status)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModalAberto(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Abas do Modal */}
            <div className="border-b border-gray-200 px-6">
              <div className="flex gap-1">
                <button
                  onClick={() => setAbaModal('dados')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    abaModal === 'dados'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 DADOS
                </button>
                <button
                  onClick={() => setAbaModal('atividade')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    abaModal === 'atividade'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📊 ATIVIDADE
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              {abaModal === 'dados' && (
                <div className="space-y-6">
                  {/* Informações Básicas */}
                  <div>
                    <h3 className="font-bold text-lg mb-4">👤 Informações Básicas</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Email</div>
                        <div className="font-medium">{membroSelecionado.email}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Telefone</div>
                        <div className="font-medium">{membroSelecionado.telefone || 'Não informado'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Setor</div>
                        <div className="font-medium">🏢 {membroSelecionado.setor}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Tipo</div>
                        <div className="font-medium capitalize">
                          {membroSelecionado.tipo === 'ia' ? '🤖 IA' : '👤 Humano'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas de Performance */}
                  <div>
                    <h3 className="font-bold text-lg mb-4">📊 Estatísticas de Performance</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <Card className="p-4 text-center">
                        <div className="text-xs text-gray-600 mb-2">Atendimentos</div>
                        <div className="text-2xl font-bold">{membroSelecionado.stats.atendimentos}</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-xs text-gray-600 mb-2">TMR</div>
                        <div className="text-2xl font-bold">
                          {membroSelecionado.stats.tmr ? `${membroSelecionado.stats.tmr}min` : 'N/A'}
                        </div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-xs text-gray-600 mb-2">CSAT</div>
                        <div className="text-2xl font-bold">
                          {membroSelecionado.stats.csat ? `${membroSelecionado.stats.csat}%` : 'N/A'}
                        </div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-xs text-gray-600 mb-2">Resolução</div>
                        <div className="text-2xl font-bold">
                          {membroSelecionado.stats.taxaResolucao ? `${membroSelecionado.stats.taxaResolucao}%` : 'N/A'}
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Performance Geral */}
                  <div>
                    <h3 className="font-bold text-lg mb-4">🎯 Performance Geral</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">Performance Total</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {membroSelecionado.performance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full transition-all ${
                            membroSelecionado.performance >= 80 ? 'bg-green-500' :
                            membroSelecionado.performance >= 60 ? 'bg-blue-500' :
                            membroSelecionado.performance >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${membroSelecionado.performance}%` }}
                        />
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        {membroSelecionado.performance >= 80 && '🌟 Excelente desempenho!'}
                        {membroSelecionado.performance >= 60 && membroSelecionado.performance < 80 && '👍 Bom desempenho'}
                        {membroSelecionado.performance >= 40 && membroSelecionado.performance < 60 && '⚠️ Desempenho regular'}
                        {membroSelecionado.performance < 40 && '📉 Necessita atenção'}
                      </div>
                    </div>
                  </div>

                  {/* Horas Trabalhadas */}
                  <div>
                    <h3 className="font-bold text-lg mb-4">⏰ Tempo de Trabalho</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Horas trabalhadas (último mês)</span>
                        <span className="text-xl font-bold">
                          {membroSelecionado.stats.horasTrabalhadas || 0}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {abaModal === 'atividade' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-4">📊 Atividades Recentes</h3>
                  
                  {atividades.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📋</div>
                      <div className="font-medium">Nenhuma atividade registrada</div>
                      <div className="text-sm mt-2">As atividades aparecerão aqui quando disponíveis</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {atividades.map((atividade, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{atividade.icone || '📌'}</div>
                            <div className="flex-1">
                              <div className="font-medium">{atividade.descricao}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(atividade.data).toLocaleString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Adicionar Membro */}
      {modalAdicionarMembroAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">👤 Adicionar Novo Membro</h2>
              <button
                onClick={() => setModalAdicionarMembroAberto(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔐</div>
                  <div className="flex-1">
                    <div className="font-bold text-blue-900 text-sm mb-1">Credenciais de Acesso ao Sistema</div>
                    <div className="text-xs text-blue-700">
                      Este formulário cria um novo membro da equipe e configura suas credenciais de login/senha para acesso ao sistema.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={novoMembro.nome}
                    onChange={(e) => setNovoMembro({ ...novoMembro, nome: e.target.value })}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Login) *
                  </label>
                  <input
                    type="email"
                    value={novoMembro.email}
                    onChange={(e) => setNovoMembro({ ...novoMembro, email: e.target.value })}
                    placeholder="Ex: joao.silva@empresa.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Este email será usado como login no sistema
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={novoMembro.senha}
                      onChange={(e) => setNovoMembro({ ...novoMembro, senha: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {mostrarSenha ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Senha para acesso ao sistema (mínimo 6 caracteres)
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={novoMembro.telefone}
                    onChange={(e) => setNovoMembro({ ...novoMembro, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo *
                  </label>
                  <select
                    value={novoMembro.cargo}
                    onChange={(e) => setNovoMembro({ ...novoMembro, cargo: e.target.value as CargoMembro })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="atendente">👤 Atendente</option>
                    <option value="gestor">👤 Gestor</option>
                    <option value="admin">👑 Administrador</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Setor (Opcional)
                  </label>
                  <select
                    value={novoMembro.setorId}
                    onChange={(e) => setNovoMembro({ ...novoMembro, setorId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">Selecione um setor...</option>
                    {setores.map((setor) => (
                      <option key={setor.id} value={setor.id}>
                        {setor.icone} {setor.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs font-medium text-gray-700 mb-2">📋 Resumo:</div>
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-600">Nome:</span> <span className="font-medium">{novoMembro.nome || '(não preenchido)'}</span></div>
                  <div><span className="text-gray-600">Email/Login:</span> <span className="font-medium">{novoMembro.email || '(não preenchido)'}</span></div>
                  <div><span className="text-gray-600">Senha:</span> <span className="font-medium">{novoMembro.senha ? '••••••' : '(não preenchida)'}</span></div>
                  <div><span className="text-gray-600">Cargo:</span> <span className="font-medium capitalize">{novoMembro.cargo}</span></div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setModalAdicionarMembroAberto(false)}
                  disabled={criandoMembro}
                >
                  ✕ CANCELAR
                </Button>
                <Button
                  onClick={handleCriarMembro}
                  disabled={criandoMembro}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {criandoMembro ? '⏳ CRIANDO...' : '✓ CRIAR MEMBRO'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Aba SETORES */}
      {abaAtiva === 'setores' && (
        <div className="space-y-6">
          {/* Cards por Cargo */}
          <div className="grid grid-cols-3 gap-6">
            {/* Card Atendentes */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
                    👤
                  </div>
                  <div>
                    <div className="font-bold text-lg">Atendentes</div>
                    <div className="text-sm text-gray-600">Linha de frente</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-bold text-2xl">{stats?.cargos.atendentes || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Online:</span>
                  <span className="font-semibold text-green-600">
                    {membros.filter(m => m.cargo === 'atendente' && m.status === 'online').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Performance Média:</span>
                  <span className="font-semibold">
                    {Math.round(
                      membros
                        .filter(m => m.cargo === 'atendente')
                        .reduce((acc, m) => acc + m.performance, 0) /
                        (membros.filter(m => m.cargo === 'atendente').length || 1)
                    )}%
                  </span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setSetorSelecionado('atendente');
                  setModalSetorAberto(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                👥 VER EQUIPE
              </Button>
            </Card>

            {/* Card Gestores */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl">
                    👤
                  </div>
                  <div>
                    <div className="font-bold text-lg">Gestores</div>
                    <div className="text-sm text-gray-600">Supervisão</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-bold text-2xl">{stats?.cargos.gestores || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Online:</span>
                  <span className="font-semibold text-green-600">
                    {membros.filter(m => m.cargo === 'gestor' && m.status === 'online').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Performance Média:</span>
                  <span className="font-semibold">
                    {Math.round(
                      membros
                        .filter(m => m.cargo === 'gestor')
                        .reduce((acc, m) => acc + m.performance, 0) /
                        (membros.filter(m => m.cargo === 'gestor').length || 1)
                    )}%
                  </span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setSetorSelecionado('gestor');
                  setModalSetorAberto(true);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                👥 VER EQUIPE
              </Button>
            </Card>

            {/* Card Administradores */}
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl">
                    👑
                  </div>
                  <div>
                    <div className="font-bold text-lg">Administradores</div>
                    <div className="text-sm text-gray-600">Gestão total</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-bold text-2xl">{stats?.cargos.admins || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Online:</span>
                  <span className="font-semibold text-green-600">
                    {membros.filter(m => m.cargo === 'admin' && m.status === 'online').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Performance Média:</span>
                  <span className="font-semibold">
                    {Math.round(
                      membros
                        .filter(m => m.cargo === 'admin')
                        .reduce((acc, m) => acc + m.performance, 0) /
                        (membros.filter(m => m.cargo === 'admin').length || 1)
                    )}%
                  </span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setSetorSelecionado('admin');
                  setModalSetorAberto(true);
                }}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                👥 VER EQUIPE
              </Button>
            </Card>
          </div>

          {/* Gráfico de Distribuição */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">📊 Distribuição por Cargo</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">👤 Atendentes</span>
                  <span className="text-sm font-bold">
                    {stats?.cargos.atendentes || 0} ({Math.round(((stats?.cargos.atendentes || 0) / (stats?.totalMembros || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${((stats?.cargos.atendentes || 0) / (stats?.totalMembros || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">👤 Gestores</span>
                  <span className="text-sm font-bold">
                    {stats?.cargos.gestores || 0} ({Math.round(((stats?.cargos.gestores || 0) / (stats?.totalMembros || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${((stats?.cargos.gestores || 0) / (stats?.totalMembros || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">👑 Administradores</span>
                  <span className="text-sm font-bold">
                    {stats?.cargos.admins || 0} ({Math.round(((stats?.cargos.admins || 0) / (stats?.totalMembros || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-amber-600 h-3 rounded-full transition-all"
                    style={{ width: `${((stats?.cargos.admins || 0) / (stats?.totalMembros || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Equipe por Setor */}
      {modalSetorAberto && setorSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {setorSelecionado === 'atendente' && '👤 Equipe de Atendentes'}
                {setorSelecionado === 'gestor' && '👤 Equipe de Gestores'}
                {setorSelecionado === 'admin' && '👑 Equipe de Administradores'}
              </h2>
              <button
                onClick={() => setModalSetorAberto(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-4 gap-4">
                {membros
                  .filter(m => m.cargo === setorSelecionado)
                  .map((membro) => (
                    <Card
                      key={membro.id}
                      className={`p-6 border-2 ${getStatusColor(membro.status)} cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-white relative`}
                      onClick={() => {
                        setMembroSelecionado(membro);
                        setModalAberto(true);
                        setAbaModal('dados');
                        setModalSetorAberto(false);
                      }}
                    >
                      {/* Badge de Status no canto superior direito */}
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(membro.status)}
                      </div>

                      <div className="flex flex-col items-center text-center space-y-3">
                        {/* Nome e Email */}
                        <div className="w-full mt-2">
                          <div className="font-bold text-lg truncate text-gray-900">{membro.nome}</div>
                          <div className="text-xs text-gray-500 mt-1">🏢 {membro.setor}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{membro.email}</div>
                        </div>

                        {/* Divider */}
                        <div className="w-full border-t border-gray-200"></div>

                        {/* Performance */}
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-600">Performance</span>
                            <span className="text-sm font-bold text-purple-600">{membro.performance}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                            <div
                              className={`h-2.5 rounded-full transition-all ${
                                membro.performance >= 80 ? 'bg-green-500' :
                                membro.performance >= 60 ? 'bg-blue-500' :
                                membro.performance >= 40 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${membro.performance}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>

              {membros.filter(m => m.cargo === setorSelecionado).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">👥</div>
                  <div className="font-medium">Nenhum membro neste cargo</div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {abaAtiva === 'permissoes' && (
        <div className="space-y-6">
          {permissoesAlteradas && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <div className="font-bold text-yellow-900 text-sm">Alterações Pendentes</div>
                  <div className="text-xs text-yellow-700">
                    Você tem alterações não salvas. Clique em "SALVAR PERMISSÕES" para aplicar as mudanças.
                  </div>
                </div>
              </div>
            </div>
          )}

          {carregandoPermissoes ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <div className="font-medium">Carregando permissões...</div>
            </div>
          ) : (
            <>
              {/* Cards de Permissões por Cargo */}
              <div className="grid grid-cols-3 gap-6">
            {/* Permissões de Administrador */}
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl">
                    👑
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Administrador</h3>
                    <p className="text-xs text-gray-600">Acesso total ao sistema</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-amber-600">
                  Acesso Total
                </Badge>
              </div>

              <div className="space-y-4">
                {/* GERAL */}
                <div>
                  <div className="text-xs font-bold text-amber-700 mb-2 px-2">GERAL</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['geral.dashboard'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'geral.dashboard', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🏠 Dashboard</span>
                    </label>
                  </div>
                </div>

                {/* OPERACIONAL */}
                <div>
                  <div className="text-xs font-bold text-amber-700 mb-2 px-2">OPERACIONAL</div>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg border border-amber-200 p-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={permissoes['admin']?.['operacional.chamados'] ?? true}
                          onChange={(e) => handlePermissaoChange('admin', 'operacional.chamados', e.target.checked)}
                          className="w-4 h-4 text-amber-600" 
                        />
                        <span className="text-sm font-bold text-gray-900">🎫 Chamados</span>
                      </label>
                      <div className="ml-7 mt-2 space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissoes['admin']?.['operacional.chamados.criar'] ?? true}
                            onChange={(e) => handlePermissaoChange('admin', 'operacional.chamados.criar', e.target.checked)}
                            className="w-3.5 h-3.5 text-amber-600" 
                          />
                          <span className="text-xs text-gray-700">Criar Chamado</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissoes['admin']?.['operacional.chamados.listar'] ?? true}
                            onChange={(e) => handlePermissaoChange('admin', 'operacional.chamados.listar', e.target.checked)}
                            className="w-3.5 h-3.5 text-amber-600" 
                          />
                          <span className="text-xs text-gray-700">Lista de Chamados</span>
                        </label>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['operacional.mapa'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'operacional.mapa', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">📍 Mapa ao Vivo</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['operacional.prestadores'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'operacional.prestadores', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">✅ Prestadores</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['operacional.clientes'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'operacional.clientes', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🏢 Clientes</span>
                    </label>
                  </div>
                </div>

                {/* GESTÃO */}
                <div>
                  <div className="text-xs font-bold text-amber-700 mb-2 px-2">GESTÃO</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['gestao.financeiro'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'gestao.financeiro', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">💰 Financeiro</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['gestao.relatorios'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'gestao.relatorios', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">📊 Relatórios</span>
                    </label>
                  </div>
                </div>

                {/* ADMINISTRATIVO */}
                <div>
                  <div className="text-xs font-bold text-amber-700 mb-2 px-2">ADMINISTRATIVO</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['admin.usuarios'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'admin.usuarios', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">👥 Usuários & Permissões</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['admin.logs'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'admin.logs', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">📋 Logs & Auditoria</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['admin.seguranca'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'admin.seguranca', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🔒 Segurança</span>
                    </label>
                  </div>
                </div>

                {/* SUPORTE & DESENVOLVIMENTO */}
                <div>
                  <div className="text-xs font-bold text-amber-700 mb-2 px-2">SUPORTE & DESENVOLVIMENTO</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['suporte.ajuda'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'suporte.ajuda', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">❓ Ajuda</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['admin']?.['suporte.api'] ?? true}
                        onChange={(e) => handlePermissaoChange('admin', 'suporte.api', e.target.checked)}
                        className="w-4 h-4 text-amber-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🔌 API</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Permissões de Gestor */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Gestor</h3>
                    <p className="text-xs text-gray-600">Supervisão e gerenciamento</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-purple-600">
                  Supervisão
                </Badge>
              </div>

              <div className="space-y-4">
                {/* GERAL */}
                <div>
                  <div className="text-xs font-bold text-purple-700 mb-2 px-2">GERAL</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['geral.dashboard'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'geral.dashboard', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🏠 Dashboard</span>
                    </label>
                  </div>
                </div>

                {/* OPERACIONAL */}
                <div>
                  <div className="text-xs font-bold text-purple-700 mb-2 px-2">OPERACIONAL</div>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg border border-purple-200 p-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={permissoes['gestor']?.['operacional.chamados'] ?? true}
                          onChange={(e) => handlePermissaoChange('gestor', 'operacional.chamados', e.target.checked)}
                          className="w-4 h-4 text-purple-600" 
                        />
                        <span className="text-sm font-bold text-gray-900">🎫 Chamados</span>
                      </label>
                      <div className="ml-7 mt-2 space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissoes['gestor']?.['operacional.chamados.criar'] ?? true}
                            onChange={(e) => handlePermissaoChange('gestor', 'operacional.chamados.criar', e.target.checked)}
                            className="w-3.5 h-3.5 text-purple-600" 
                          />
                          <span className="text-xs text-gray-700">Criar Chamado</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissoes['gestor']?.['operacional.chamados.listar'] ?? true}
                            onChange={(e) => handlePermissaoChange('gestor', 'operacional.chamados.listar', e.target.checked)}
                            className="w-3.5 h-3.5 text-purple-600" 
                          />
                          <span className="text-xs text-gray-700">Lista de Chamados</span>
                        </label>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['operacional.mapa'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'operacional.mapa', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">📍 Mapa ao Vivo</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['operacional.prestadores'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'operacional.prestadores', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">✅ Prestadores</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['operacional.clientes'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'operacional.clientes', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🏢 Clientes</span>
                    </label>
                  </div>
                </div>

                {/* GESTÃO */}
                <div>
                  <div className="text-xs font-bold text-purple-700 mb-2 px-2">GESTÃO</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['gestao.financeiro'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'gestao.financeiro', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">💰 Financeiro</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['gestao.relatorios'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'gestao.relatorios', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">📊 Relatórios</span>
                    </label>
                  </div>
                </div>

                {/* ADMINISTRATIVO */}
                <div>
                  <div className="text-xs font-bold text-purple-700 mb-2 px-2">ADMINISTRATIVO</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['admin.usuarios'] ?? false}
                        onChange={(e) => handlePermissaoChange('gestor', 'admin.usuarios', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">👥 Usuários & Permissões</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['admin.logs'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'admin.logs', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">📋 Logs & Auditoria</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['admin.seguranca'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'admin.seguranca', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🔒 Segurança</span>
                    </label>
                  </div>
                </div>

                {/* SUPORTE & DESENVOLVIMENTO */}
                <div>
                  <div className="text-xs font-bold text-purple-700 mb-2 px-2">SUPORTE & DESENVOLVIMENTO</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['suporte.ajuda'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'suporte.ajuda', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">❓ Ajuda</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['gestor']?.['suporte.api'] ?? true}
                        onChange={(e) => handlePermissaoChange('gestor', 'suporte.api', e.target.checked)}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🔌 API</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Permissões de Atendente */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Atendente</h3>
                    <p className="text-xs text-gray-600">Operação e atendimento</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-blue-600">
                  Operacional
                </Badge>
              </div>

              <div className="space-y-4">
                {/* GERAL */}
                <div>
                  <div className="text-xs font-bold text-blue-700 mb-2 px-2">GERAL</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['geral.dashboard'] ?? true}
                        onChange={(e) => handlePermissaoChange('atendente', 'geral.dashboard', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🏠 Dashboard</span>
                    </label>
                  </div>
                </div>

                {/* OPERACIONAL */}
                <div>
                  <div className="text-xs font-bold text-blue-700 mb-2 px-2">OPERACIONAL</div>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg border border-blue-200 p-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={permissoes['atendente']?.['operacional.chamados'] ?? true}
                          onChange={(e) => handlePermissaoChange('atendente', 'operacional.chamados', e.target.checked)}
                          className="w-4 h-4 text-blue-600" 
                        />
                        <span className="text-sm font-bold text-gray-900">🎫 Chamados</span>
                      </label>
                      <div className="ml-7 mt-2 space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissoes['atendente']?.['operacional.chamados.criar'] ?? true}
                            onChange={(e) => handlePermissaoChange('atendente', 'operacional.chamados.criar', e.target.checked)}
                            className="w-3.5 h-3.5 text-blue-600" 
                          />
                          <span className="text-xs text-gray-700">Criar Chamado</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissoes['atendente']?.['operacional.chamados.listar'] ?? true}
                            onChange={(e) => handlePermissaoChange('atendente', 'operacional.chamados.listar', e.target.checked)}
                            className="w-3.5 h-3.5 text-blue-600" 
                          />
                          <span className="text-xs text-gray-700">Lista de Chamados</span>
                        </label>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['operacional.mapa'] ?? true}
                        onChange={(e) => handlePermissaoChange('atendente', 'operacional.mapa', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">📍 Mapa ao Vivo</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['operacional.prestadores'] ?? true}
                        onChange={(e) => handlePermissaoChange('atendente', 'operacional.prestadores', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">✅ Prestadores</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['operacional.clientes'] ?? true}
                        onChange={(e) => handlePermissaoChange('atendente', 'operacional.clientes', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🏢 Clientes</span>
                    </label>
                  </div>
                </div>

                {/* GESTÃO */}
                <div>
                  <div className="text-xs font-bold text-blue-700 mb-2 px-2">GESTÃO</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['gestao.financeiro'] ?? false}
                        onChange={(e) => handlePermissaoChange('atendente', 'gestao.financeiro', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">💰 Financeiro</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['gestao.relatorios'] ?? false}
                        onChange={(e) => handlePermissaoChange('atendente', 'gestao.relatorios', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">📊 Relatórios</span>
                    </label>
                  </div>
                </div>

                {/* ADMINISTRATIVO */}
                <div>
                  <div className="text-xs font-bold text-blue-700 mb-2 px-2">ADMINISTRATIVO</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['admin.usuarios'] ?? false}
                        onChange={(e) => handlePermissaoChange('atendente', 'admin.usuarios', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">👥 Usuários & Permissões</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['admin.logs'] ?? false}
                        onChange={(e) => handlePermissaoChange('atendente', 'admin.logs', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">📋 Logs & Auditoria</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['admin.seguranca'] ?? false}
                        onChange={(e) => handlePermissaoChange('atendente', 'admin.seguranca', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🔒 Segurança</span>
                    </label>
                  </div>
                </div>

                {/* SUPORTE & DESENVOLVIMENTO */}
                <div>
                  <div className="text-xs font-bold text-blue-700 mb-2 px-2">SUPORTE & DESENVOLVIMENTO</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['suporte.ajuda'] ?? true}
                        onChange={(e) => handlePermissaoChange('atendente', 'suporte.ajuda', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">❓ Ajuda</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={permissoes['atendente']?.['suporte.api'] ?? false}
                        onChange={(e) => handlePermissaoChange('atendente', 'suporte.api', e.target.checked)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium text-gray-900">🔌 API</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
              </div>
            </>
          )}

          {/* Barra de Ações - Final da Página */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button 
              onClick={handleSalvarPermissoes}
              disabled={salvandoPermissoes || !permissoesAlteradas}
              className={`${
                permissoesAlteradas 
                  ? 'bg-green-600 hover:bg-green-700 text-white font-bold' 
                  : 'bg-gray-400 cursor-not-allowed text-gray-600'
              }`}
            >
              {salvandoPermissoes ? '⏳ Salvando...' : '💾 SALVAR PERMISSÕES'}
            </Button>
          </div>
        </div>
      )}

      {abaAtiva === 'organograma' && (
        <Card className="p-12 text-center text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <div className="font-medium">Aba ORGANOGRAMA</div>
          <div className="text-sm mt-2">Em desenvolvimento</div>
        </Card>
      )}
    </div>
  );
}
