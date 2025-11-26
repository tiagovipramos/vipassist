# Implementação Google Maps Places API - Prestadores

## Status da Implementação

✅ **Concluído:**
1. Variável de ambiente configurada (`.env`)
2. Tipos TypeScript criados (`src/tipos/googleMaps.ts`)
3. Serviço Google Maps criado (`src/lib/services/googleMaps.service.ts`)
4. API Route criada (`src/app/api/google-maps/buscar/route.ts`)
5. Estados e função de busca adicionados ao componente

⚠️ **Pendente:**
- Completar o modal de busca no arquivo `src/app/(autenticado)/prestadores/prestadores.client.tsx`

## Arquivo Incompleto

O arquivo `src/app/(autenticado)/prestadores/prestadores.client.tsx` foi cortado na linha 742. 

### O que falta adicionar:

Após a linha 742 (que termina com `<p className="font-`), adicione o restante do modal View e os outros modais (Delete, Create/Edit, Search).

## Como Completar a Implementação

### 1. Configurar a API Key do Google Maps

No arquivo `.env`, substitua `YOUR_GOOGLE_MAPS_API_KEY_HERE` pela sua chave real da API do Google Maps:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"
```

**Como obter a chave:**
1. Acesse https://console.cloud.google.com/
2. Crie um projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Places API
   - Geocoding API
4. Vá em "Credenciais" e crie uma chave de API
5. Configure restrições de segurança (domínios permitidos)

### 2. Adicionar o Modal de Busca

O modal de busca já foi parcialmente implementado. Ele deve conter:

**Funcionalidades:**
- Toggle entre busca por texto e busca por proximidade
- Campo de input para cidade/estado ou endereço
- Botão de buscar que chama `handleGoogleMapsSearch()`
- Lista de resultados com:
  - Nome do prestador
  - Cidade e estado
  - Endereço completo
  - Telefone (se disponível)
  - Avaliação do Google (se disponível)
  - Website (se disponível)
  - Coordenadas (latitude/longitude)

**Estrutura do Modal:**
```tsx
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

    <div className="flex-1 overflow-y-auto space-y-4">
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
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
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
```

### 3. Testar a Implementação

1. Inicie o servidor: `npm run dev`
2. Acesse http://localhost:3000/prestadores
3. Clique no botão "Buscar" no header
4. Teste a busca por texto: Digite "São Paulo, SP"
5. Teste a busca por proximidade: Digite um endereço completo
6. Verifique se os resultados aparecem com nome, cidade, telefone

### 4. Limitações e Considerações

**Custos da API:**
- Google Maps Places API é paga após o limite gratuito
- Text Search: $32 por 1000 requisições
- Nearby Search: $32 por 1000 requisições
- Geocoding: $5 por 1000 requisições

**Recomendações:**
- Configure limites de uso no Google Cloud Console
- Implemente cache para reduzir chamadas à API
- Considere salvar resultados frequentes no banco de dados
- Use restrições de API key (domínios permitidos)

### 5. Próximos Passos (Opcional)

- Adicionar botão para importar prestador do Google Maps para o sistema
- Implementar cache de resultados
- Adicionar filtros adicionais (avaliação mínima, raio customizado)
- Mostrar resultados em um mapa
- Adicionar paginação para muitos resultados

## Suporte

Para dúvidas sobre a API do Google Maps:
- Documentação: https://developers.google.com/maps/documentation/places/web-service
- Console: https://console.cloud.google.com/

## Arquivos Criados/Modificados

1. `.env` - Adicionada variável NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
2. `src/tipos/googleMaps.ts` - Tipos TypeScript
3. `src/lib/services/googleMaps.service.ts` - Serviço (não usado diretamente, API route preferida)
4. `src/app/api/google-maps/buscar/route.ts` - API Route para chamadas seguras
5. `src/app/(autenticado)/prestadores/prestadores.client.tsx` - Componente com modal (INCOMPLETO)
