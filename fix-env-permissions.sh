#!/bin/bash

echo "🔧 Corrigindo permissões do arquivo .env..."

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "📝 Arquivo .env não existe, criando..."
    touch .env
    echo "# Configurações de API" > .env
fi

# Dar permissão de leitura e escrita para todos
chmod 666 .env

echo "✅ Permissões corrigidas!"
echo ""
echo "📋 Permissões atuais:"
ls -la .env

echo ""
echo "🔄 Agora reinicie o container:"
echo "docker-compose restart app"
