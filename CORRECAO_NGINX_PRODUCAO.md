# Correção do Nginx em Produção

## Problema Identificado
Os arquivos estáticos do Next.js (CSS, JS) não estavam sendo carregados porque a configuração do Nginx não estava tratando corretamente as rotas `/_next/` do Next.js em modo standalone.

## Solução Aplicada
Atualizei a configuração do Nginx para:
1. Adicionar proxy correto para `/_next/static/`
2. Adicionar proxy para `/_next/` (chunks e outros arquivos)
3. Configurar headers corretos para cada tipo de arquivo

## Comandos para Executar no VPS

Execute estes comandos **no VPS via SSH** na ordem:

```bash
# 1. Navegar para o diretório do projeto
cd /opt/vipassist

# 2. Fazer pull das últimas alterações do GitHub
git pull origin master

# 3. Reiniciar o container do Nginx para aplicar a nova configuração
docker restart vipassist-nginx

# 4. Verificar se o Nginx reiniciou corretamente
docker ps | grep nginx

# 5. Verificar os logs do Nginx para confirmar que não há erros
docker logs vipassist-nginx --tail 20
```

## Teste
Após executar os comandos acima, acesse novamente:
- http://185.215.167.39/

A página deve carregar completamente com todos os estilos e scripts.

## O que foi corrigido no nginx.conf

### Antes:
```nginx
location /_next/static/ {
    proxy_pass http://nextjs;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### Depois:
```nginx
# Static files caching (_next/static)
location /_next/static/ {
    proxy_pass http://nextjs;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# Next.js chunks
location /_next/ {
    proxy_pass http://nextjs;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Verificação Final
Após aplicar a correção, verifique no console do navegador que não há mais erros de "Loading failed for the script".
