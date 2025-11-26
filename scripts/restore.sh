#!/bin/sh
set -e

# ==========================================
# SCRIPT DE RESTAURAÇÃO DE BACKUP CRIPTOGRAFADO
# ==========================================
# Este script restaura backups criptografados do banco de dados PostgreSQL
# ==========================================

# Verificar argumentos
if [ $# -lt 1 ]; then
    echo "Uso: $0 <arquivo_backup_criptografado>"
    echo ""
    echo "Exemplo:"
    echo "  $0 /backups/backup_20231122_120000.sql.gz.enc"
    echo ""
    echo "Para listar backups disponíveis:"
    echo "  ls -lh /backups/backup_*.sql.gz.enc"
    exit 1
fi

ENCRYPTED_FILE="$1"
BACKUP_DIR=$(dirname "$ENCRYPTED_FILE")
DECRYPTED_FILE="${ENCRYPTED_FILE%.enc}"
TEMP_SQL_FILE="${DECRYPTED_FILE%.gz}"

# Verificar se o arquivo existe
if [ ! -f "$ENCRYPTED_FILE" ]; then
    echo "ERRO: Arquivo não encontrado: $ENCRYPTED_FILE"
    exit 1
fi

# Verificar se a chave de criptografia está definida
if [ -z "$BACKUP_ENCRYPTION_KEY" ]; then
    echo "ERRO: Variável BACKUP_ENCRYPTION_KEY não está definida!"
    echo "Defina a variável de ambiente BACKUP_ENCRYPTION_KEY antes de executar a restauração."
    exit 1
fi

# Verificar se OpenSSL está instalado
if ! command -v openssl >/dev/null 2>&1; then
    echo "ERRO: OpenSSL não está instalado!"
    echo "Instale o OpenSSL: apt-get install openssl"
    exit 1
fi

echo "=========================================="
echo "RESTAURAÇÃO DE BACKUP CRIPTOGRAFADO"
echo "=========================================="
echo "Arquivo: $ENCRYPTED_FILE"
echo "=========================================="

# Verificar integridade do backup
if [ -f "$ENCRYPTED_FILE.sha256" ]; then
    echo "Verificando integridade do backup..."
    if sha256sum -c "$ENCRYPTED_FILE.sha256" --status 2>/dev/null; then
        echo "✓ Integridade verificada com sucesso"
    else
        echo "✗ AVISO: Falha na verificação de integridade!"
        echo "O arquivo pode estar corrompido."
        read -p "Deseja continuar mesmo assim? (s/N): " CONTINUE
        if [ "$CONTINUE" != "s" ] && [ "$CONTINUE" != "S" ]; then
            echo "Restauração cancelada."
            exit 1
        fi
    fi
else
    echo "⚠ Arquivo de hash não encontrado. Pulando verificação de integridade."
fi

# Confirmar restauração
echo ""
echo "⚠️  ATENÇÃO: Esta operação irá SUBSTITUIR todos os dados do banco de dados atual!"
echo ""
echo "Banco de dados: $POSTGRES_DB"
echo "Host: $POSTGRES_HOST"
echo "Usuário: $POSTGRES_USER"
echo ""
read -p "Tem certeza que deseja continuar? Digite 'CONFIRMAR' para prosseguir: " CONFIRM

if [ "$CONFIRM" != "CONFIRMAR" ]; then
    echo "Restauração cancelada."
    exit 0
fi

# Descriptografar o backup
echo ""
echo "Descriptografando backup..."
openssl enc -aes-256-cbc \
    -d \
    -pbkdf2 \
    -iter 100000 \
    -in "$ENCRYPTED_FILE" \
    -out "$DECRYPTED_FILE" \
    -k "$BACKUP_ENCRYPTION_KEY"

if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao descriptografar o backup!"
    echo "Verifique se a chave de criptografia está correta."
    rm -f "$DECRYPTED_FILE"
    exit 1
fi

echo "✓ Backup descriptografado com sucesso"

# Descompactar o backup
echo "Descompactando backup..."
gunzip -c "$DECRYPTED_FILE" > "$TEMP_SQL_FILE"

if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao descompactar o backup!"
    rm -f "$DECRYPTED_FILE" "$TEMP_SQL_FILE"
    exit 1
fi

echo "✓ Backup descompactado com sucesso"

# Verificar tamanho do arquivo SQL
SQL_SIZE=$(du -h "$TEMP_SQL_FILE" | cut -f1)
echo "Tamanho do arquivo SQL: $SQL_SIZE"

# Fazer backup do banco atual antes de restaurar
echo ""
echo "Criando backup de segurança do banco atual..."
SAFETY_BACKUP="/backups/safety_backup_$(date +%Y%m%d_%H%M%S).sql.gz"
PGPASSWORD=$POSTGRES_PASSWORD pg_dump \
    -h $POSTGRES_HOST \
    -U $POSTGRES_USER \
    -d $POSTGRES_DB \
    --no-owner \
    --no-acl \
    | gzip > "$SAFETY_BACKUP"

if [ $? -eq 0 ]; then
    echo "✓ Backup de segurança criado: $SAFETY_BACKUP"
else
    echo "⚠ Falha ao criar backup de segurança (continuando mesmo assim)"
fi

# Restaurar o banco de dados
echo ""
echo "Restaurando banco de dados..."
echo "Isso pode levar alguns minutos dependendo do tamanho do backup..."

# Desconectar usuários ativos
PGPASSWORD=$POSTGRES_PASSWORD psql \
    -h $POSTGRES_HOST \
    -U $POSTGRES_USER \
    -d postgres \
    -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$POSTGRES_DB' AND pid <> pg_backend_pid();" \
    >/dev/null 2>&1

# Dropar e recriar o banco
PGPASSWORD=$POSTGRES_PASSWORD psql \
    -h $POSTGRES_HOST \
    -U $POSTGRES_USER \
    -d postgres \
    -c "DROP DATABASE IF EXISTS $POSTGRES_DB;" \
    >/dev/null 2>&1

PGPASSWORD=$POSTGRES_PASSWORD psql \
    -h $POSTGRES_HOST \
    -U $POSTGRES_USER \
    -d postgres \
    -c "CREATE DATABASE $POSTGRES_DB;" \
    >/dev/null 2>&1

# Restaurar o backup
PGPASSWORD=$POSTGRES_PASSWORD psql \
    -h $POSTGRES_HOST \
    -U $POSTGRES_USER \
    -d $POSTGRES_DB \
    -f "$TEMP_SQL_FILE" \
    >/dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Banco de dados restaurado com sucesso!"
    
    # Limpar arquivos temporários
    rm -f "$DECRYPTED_FILE" "$TEMP_SQL_FILE"
    
    echo ""
    echo "=========================================="
    echo "RESTAURAÇÃO CONCLUÍDA COM SUCESSO"
    echo "=========================================="
    echo "Backup restaurado: $ENCRYPTED_FILE"
    echo "Backup de segurança: $SAFETY_BACKUP"
    echo "=========================================="
    
else
    echo "✗ ERRO ao restaurar o banco de dados!"
    echo ""
    echo "Tentando restaurar o backup de segurança..."
    
    if [ -f "$SAFETY_BACKUP" ]; then
        gunzip -c "$SAFETY_BACKUP" | PGPASSWORD=$POSTGRES_PASSWORD psql \
            -h $POSTGRES_HOST \
            -U $POSTGRES_USER \
            -d $POSTGRES_DB \
            >/dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✓ Backup de segurança restaurado com sucesso"
        else
            echo "✗ Falha ao restaurar backup de segurança!"
        fi
    fi
    
    # Limpar arquivos temporários
    rm -f "$DECRYPTED_FILE" "$TEMP_SQL_FILE"
    
    exit 1
fi
