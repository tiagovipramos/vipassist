'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Grid, List, Star, Check, Clock, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card'
import { Input } from '@/componentes/ui/input'
import { Button } from '@/componentes/ui/button'
import { Badge } from '@/componentes/ui/badge'
import {
  todasIntegracoes,
  colecoes,
  estatisticasGerais,
} from '@/lib/mocks/integracoes'
import type {
  Integracao,
  CategoriaIntegracao,
  StatusIntegracao,
  FiltrosIntegracoes,
} from '@/tipos/integracoes'
import { CATEGORIAS_INTEGRACAO, BADGES_INTEGRACAO } from '@/tipos/integracoes'

export function IntegracoesClient() {
  const [visualizacao, setVisualizacao] = useState<'grid' | 'list'>('grid')
  const [filtros, setFiltros] = useState<FiltrosIntegracoes>({
    busca: '',
    ordenacao: 'popularidade',
  })
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaIntegracao | 'todas'>('todas')
  const [statusAtivo, setStatusAtivo] = useState<StatusIntegracao | 'todos'>('todos')

  // Filtragem
  const integracoesFiltradas = useMemo(() => {
    let resultado = [...todasIntegracoes]

    // Busca
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase()
      resultado = resultado.filter(
        (int) =>
          int.nome.toLowerCase().includes(termo) ||
          int.descricao.toLowerCase().includes(termo) ||
          int.tags?.some((tag) => tag.toLowerCase().includes(termo))
      )
    }

    // Categoria
    if (categoriaAtiva !== 'todas') {
      resultado = resultado.filter((int) => int.categoria === categoriaAtiva)
    }

    // Status
    if (statusAtivo !== 'todos') {
      resultado = resultado.filter((int) => int.status === statusAtivo)
    }

    // Ordenação
    switch (filtros.ordenacao) {
      case 'popularidade':
        resultado.sort((a, b) => b.popularidade - a.popularidade)
        break
      case 'alfabetica':
        resultado.sort((a, b) => a.nome.localeCompare(b.nome))
        break
      case 'nota':
        resultado.sort((a, b) => (b.notaMedia || 0) - (a.notaMedia || 0))
        break
    }

    return resultado
  }, [filtros, categoriaAtiva, statusAtivo])

  return (
    <div className="flex-1 space-y-4 p-4 pt-1 md:p-6 md:pt-2">
      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{estatisticasGerais.totalIntegracoes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conectadas</p>
                <p className="text-2xl font-bold">{estatisticasGerais.integracoesConectadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponíveis</p>
                <p className="text-2xl font-bold">{estatisticasGerais.integracoesDisponiveis}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avaliação Média</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar integrações..."
            value={filtros.busca}
            onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={visualizacao === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVisualizacao('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={visualizacao === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVisualizacao('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoriaAtiva === 'todas' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoriaAtiva('todas')}
        >
          Todas
        </Button>
        {Object.entries(CATEGORIAS_INTEGRACAO).map(([key, value]) => (
          <Button
            key={key}
            variant={categoriaAtiva === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoriaAtiva(key as CategoriaIntegracao)}
          >
            <span className="mr-1">{value.icone}</span>
            {value.nome}
          </Button>
        ))}
      </div>

      {/* Filtros de Status */}
      <div className="flex gap-2">
        <Button
          variant={statusAtivo === 'todos' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusAtivo('todos')}
        >
          Todos
        </Button>
        <Button
          variant={statusAtivo === 'conectada' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusAtivo('conectada')}
        >
          <Check className="mr-1 h-3 w-3" />
          Conectadas
        </Button>
        <Button
          variant={statusAtivo === 'disponivel' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusAtivo('disponivel')}
        >
          Disponíveis
        </Button>
      </div>

      {/* Lista de Integrações */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {integracoesFiltradas.length} integrações encontradas
          </p>
        </div>

        {visualizacao === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integracoesFiltradas.map((integracao) => (
              <IntegracaoCard key={integracao.id} integracao={integracao} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {integracoesFiltradas.map((integracao) => (
              <IntegracaoLinha key={integracao.id} integracao={integracao} />
            ))}
          </div>
        )}

        {integracoesFiltradas.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Nenhuma integração encontrada</p>
              <Button
                variant="link"
                onClick={() => {
                  setFiltros({ busca: '', ordenacao: 'popularidade' })
                  setCategoriaAtiva('todas')
                  setStatusAtivo('todos')
                }}
              >
                Limpar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Componente Card de Integração (Grid)
function IntegracaoCard({ integracao }: { integracao: Integracao }) {
  const categoria = CATEGORIAS_INTEGRACAO[integracao.categoria]

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
              style={{ backgroundColor: `${integracao.cor}20` }}
            >
              {integracao.logo}
            </div>
            <div>
              <CardTitle className="text-base">{integracao.nome}</CardTitle>
              <CardDescription className="text-xs">
                {categoria.nome}
              </CardDescription>
            </div>
          </div>
          {integracao.status === 'conectada' && (
            <Badge variant="default" className="bg-green-500">
              <Check className="mr-1 h-3 w-3" />
              Conectada
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {integracao.descricao}
        </p>

        {/* Badges */}
        {integracao.badges && integracao.badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {integracao.badges.map((badge) => {
              const badgeInfo = BADGES_INTEGRACAO[badge]
              return (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badgeInfo.label}
                </Badge>
              )
            })}
          </div>
        )}

        {/* Avaliação */}
        {integracao.notaMedia && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="font-medium">{integracao.notaMedia}</span>
            <span className="text-muted-foreground">
              ({integracao.numeroAvaliacoes})
            </span>
          </div>
        )}

        {/* Preço */}
        <div className="pt-2">
          {integracao.preco.tipo === 'gratis' && (
            <p className="text-sm font-medium text-green-600">Grátis</p>
          )}
          {integracao.preco.tipo === 'incluido' && (
            <p className="text-sm font-medium text-blue-600">Incluído no plano</p>
          )}
          {integracao.preco.tipo === 'addon' && (
            <p className="text-sm font-medium">
              R$ {integracao.preco.valor}/{integracao.preco.periodo}
            </p>
          )}
          {integracao.preco.tipo === 'enterprise' && (
            <p className="text-sm font-medium text-purple-600">Enterprise</p>
          )}
        </div>

        {/* Botão */}
        <Button
          className="w-full"
          variant={integracao.status === 'conectada' ? 'outline' : 'default'}
        >
          {integracao.status === 'conectada' ? 'Gerenciar' : 'Conectar'}
        </Button>
      </CardContent>
    </Card>
  )
}

// Componente Linha de Integração (List)
function IntegracaoLinha({ integracao }: { integracao: Integracao }) {
  const categoria = CATEGORIAS_INTEGRACAO[integracao.categoria]

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4 flex-1">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl flex-shrink-0"
            style={{ backgroundColor: `${integracao.cor}20` }}
          >
            {integracao.logo}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{integracao.nome}</h3>
              {integracao.status === 'conectada' && (
                <Badge variant="default" className="bg-green-500">
                  <Check className="mr-1 h-3 w-3" />
                  Conectada
                </Badge>
              )}
              {integracao.badges?.slice(0, 2).map((badge) => {
                const badgeInfo = BADGES_INTEGRACAO[badge]
                return (
                  <Badge key={badge} variant="secondary" className="text-xs">
                    {badgeInfo.label}
                  </Badge>
                )
              })}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {integracao.descricao}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>{categoria.nome}</span>
              {integracao.notaMedia && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{integracao.notaMedia}</span>
                </div>
              )}
              {integracao.numeroUsuarios && (
                <span>{integracao.numeroUsuarios.toLocaleString()} usuários</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            {integracao.preco.tipo === 'gratis' && (
              <p className="text-sm font-medium text-green-600">Grátis</p>
            )}
            {integracao.preco.tipo === 'incluido' && (
              <p className="text-sm font-medium text-blue-600">Incluído</p>
            )}
            {integracao.preco.tipo === 'addon' && (
              <p className="text-sm font-medium">
                R$ {integracao.preco.valor}/{integracao.preco.periodo}
              </p>
            )}
          </div>

          <Button
            variant={integracao.status === 'conectada' ? 'outline' : 'default'}
          >
            {integracao.status === 'conectada' ? 'Gerenciar' : 'Conectar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
