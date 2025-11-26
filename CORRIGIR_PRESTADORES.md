# CORREÇÃO URGENTE - Arquivo prestadores.client.tsx Corrompido

## Problema
O arquivo `src/app/(autenticado)/prestadores/prestadores.client.tsx` está cortado na linha 742, causando erro de sintaxe.

## Solução Rápida

### Opção 1: Restaurar Backup (RECOMENDADO)
Se você tem um backup do arquivo antes da modificação, restaure-o e depois adicione apenas o modal de busca do Google Maps.

### Opção 2: Corrigir Manualmente

1. Abra o arquivo `src/app/(autenticado)/prestadores/prestadores.client.tsx`
2. Vá até a linha 742 (onde está cortado: `<p className="font-`)
3. Delete tudo a partir dessa linha
4. Cole o código abaixo para completar o arquivo:

```tsx
medium">{selectedPrestador.razaoSocial}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500">Tipo</label>
                    <p className="font-medium">
                      {selectedPrestador.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      {selectedPrestador.tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                    </label>
                    <p className="font-medium">
                      {selectedPrestador.tipoPessoa === 'fisica' ? selectedPrestador.cpf : selectedPrestador.cnpj}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{selectedPrestador.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Telefone</label>
                    <p className="font-medium">{selectedPrestador.telefone}</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="mb-3 font-semibold">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">CEP</label>
                    <p className="font-medium">{selectedPrestador.endereco.cep}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Logradouro</label>
                    <p className="font-medium">{selectedPrestador.endereco.logradouro}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Número</label>
                    <p className="font-medium">{selectedPrestador.endereco.numero}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Bairro</label>
                    <p className="font-medium">{selectedPrestador.endereco.bairro}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Cidade</label>
                    <p className="font-medium">{selectedPrestador.endereco.cidade}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Estado</label>
                    <p className="font-medium">{selectedPrestador.endereco.estado}</p>
                  </div>
                </div>
              </div>

              {/* Serviços */}
              <div>
                <h3 className="mb-3 font-semibold">Serviços</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPrestador.servicos.map(servicoId => {
                    const servico = tiposServico.find(s => s.id === servicoId)
                    return servico ? (
                      <Badge key={servicoId} variant="outline">
                        {servico.nome}
                      </Badge>
                    ) : null
                  })}
                </div>
                <div className="mt-3">
                  <label className="text-sm text-gray-500">Raio de Atuação</label>
                  <p className="font-medium">{selectedPrestador.raioAtuacao} km</p>
                </div>
              </div>

              {/* Status e Avaliação */}
              <div>
                <h3 className="mb-3 font-semibold">Status e Avaliação</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedPrestador.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Disponível</label>
                    <p className="font-medium">{selectedPrestador.disponivel ? 'Sim' : 'Não'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Avaliação Média</label>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedPrestador.avaliacaoMedia.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Total de Atendimentos</label>
                    <p className="font-medium">{selectedPrestador.totalAtendimentos}</p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {selectedPrestador.observacoes && (
                <div>
                  <h3 className="mb-3 font-semibold">Observações</h3>
                  <p className="text-sm text-gray-600">{selectedPrestador.observacoes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewModalOpen(false)
              if (selectedPrestador) handleEdit(selectedPrestador)
            }}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o prestador <strong>{selectedPrestador?.nome}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search Modal - Google Maps */}
      <Dialog open={isSearchModalOpen} onOpenChange={(open) => {
        setIsSearchModalOpen(open)
        if (!open) {
          setSearchQuery('')
          setSearchResults([])
          setSearchError('')
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Buscar Prestadores via Google Maps</DialogTitle>
            <DialogDescription>
              Busque prestadores de reboque/guincho em qualquer cidade usando a API do Google Maps
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 px-1">
            {/* Tipo de Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo de Busca</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={searchType === 'texto' ? 'default' : 'outline'}
                  onClick={() => setSearchType('texto')}
                  className="flex-1"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Busca por Texto
                </Button>
                <Button
                  type="button"
                  variant={searchType === 'proximo' ? 'default' : 'outline'}
                  onClick={() => setSearchType('proximo')}
                  className="flex-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Busca por Proximidade
                </Button>
              </div>
            </div>

            {/* Campo de Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {searchType === 'texto' ? 'Cidade e Estado' : 'Endereço ou Cidade'}
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder={
                    searchType === 'texto'
                      ? 'Ex: São Paulo, SP'
                      : 'Ex: Av. Paulista, São Paulo, SP'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGoogleMapsSearch()
                    }
                  }}
                />
                <Button
                  onClick={handleGoogleMapsSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                {searchType === 'texto'
                  ? 'Digite a cidade e estado para buscar prestadores de reboque/guincho'
                  : 'Digite um endereço para buscar prestadores próximos (raio de 50km)'}
              </p>
            </div>

            {/* Erro */}
            {searchError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Erro na busca</h4>
                    <p className="text-sm text-red-700 mt-1">{searchError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resultados */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {searchResults.length} prestador(es) encontrado(s)
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    Google Maps
                  </Badge>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {searchResults.map((prestador) => (
                    <Card
                      key={prestador.placeId}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        {/* Nome e Avaliação */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{prestador.nome}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {prestador.cidade}, {prestador.estado}
                              </span>
                            </div>
                          </div>
                          {prestador.avaliacao && (
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {prestador.avaliacao.toFixed(1)}
                              </span>
                              {prestador.totalAvaliacoes && (
                                <span className="text-xs text-gray-500">
                                  ({prestador.totalAvaliacoes})
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Endereço */}
                        <div className="text-sm text-gray-600">
                          <p>{prestador.endereco}</p>
                        </div>

                        {/* Telefone */}
                        {prestador.telefone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a
                              href={`tel:${prestador.telefone}`}
                              className="text-sm text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {prestador.telefone}
                            </a>
                          </div>
                        )}

                        {/* Website */}
                        {prestador.website && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a
                              href={prestador.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Visitar website
                            </a>
                          </div>
                        )}

                        {/* Coordenadas */}
                        <div className="text-xs text-gray-500 pt-2 border-t">
                          Lat: {prestador.latitude.toFixed(6)}, Lng: {prestador.longitude.toFixed(6)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Estado vazio */}
            {!isSearching && searchResults.length === 0 && !searchError && (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">
                  Nenhuma busca realizada
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Digite uma cidade ou endereço e clique em Buscar para encontrar prestadores
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsSearchModalOpen(false)
                setSearchQuery('')
                setSearchResults([])
                setSearchError('')
              }}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

## Após Corrigir

1. Salve o arquivo
2. O servidor deve recarregar automaticamente
3. Acesse http://localhost:3000/prestadores
4. Clique no botão "Buscar" no header
5. Teste a busca do Google Maps

## Arquivos da Implementação

Todos os outros arquivos estão corretos:
- ✅ `.env` - API Key configurada
- ✅ `src/tipos/googleMaps.ts` - Tipos
- ✅ `src/lib/services/googleMaps.service.ts` - Serviço
- ✅ `src/app/api/google-maps/buscar/route.ts` - API Route

Apenas o `prestadores.client.tsx` precisa ser corrigido.
