#!/bin/sh
set -e

# ==========================================
# SCRIPT DE BACKUP CRIPTOGRAFADO
# ==========================================
# Este script cria backups do banco de dados PostgreSQL
# com criptografia AES-256-CBC usando OpenSSL
# ==========================================

# Configurações
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"
ENCRYPTED_FILE="$BACKUP_FILE.enc"

# Criar diretório de backups se não existir
mkdir -p $BACKUP_DIR

# Verificar se a chave de criptografia está definida
if [ -z "$BACKUP_ENCRYPTION_KEY" ]; then
    echo "$(date): ERRO - Variável BACKUP_ENCRYPTION_KEY não está definida!"
    echo "$(date): Defina a variável de ambiente BACKUP_ENCRYPTION_KEY antes de executar o backup."
    exit 1
fi

# Verificar se OpenSSL está instalado
if ! command -v openssl >/dev/null 2>&1; then
    echo "$(date): ERRO - OpenSSL não está instalado!"
    echo "$(date): Instale o OpenSSL: apt-get install openssl"
    exit 1
fi

# Função para fazer backup
do_backup() {
    echo "$(date): Iniciando backup criptografado..."
    
    # Fazer backup comprimido
    echo "$(date): Exportando banco de dados..."
    PGPASSWORD=$POSTGRES_PASSWORD pg_dump \
        -h $POSTGRES_HOST \
        -U $POSTGRES_USER \
        -d $POSTGRES_DB \
        --no-owner \
        --no-acl \
        | gzip > $BACKUP_FILE
    
    if [ $? -ne 0 ]; then
        echo "$(date): ERRO ao criar backup!"
        rm -f $BACKUP_FILE
        exit 1
    fi
    
    # Verificar tamanho do backup não criptografado
    SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo "$(date): Backup criado: $SIZE"
    
    # Criptografar o backup usando AES-256-CBC
    echo "$(date): Criptografando backup..."
    openssl enc -aes-256-cbc \
        -salt \
        -pbkdf2 \
        -iter 100000 \
        -in $BACKUP_FILE \
        -out $ENCRYPTED_FILE \
        -k "$BACKUP_ENCRYPTION_KEY"
    
    if [ $? -eq 0 ]; then
        # Remover arquivo não criptografado
        rm -f $BACKUP_FILE
        
        # Verificar tamanho do backup criptografado
        ENC_SIZE=$(du -h $ENCRYPTED_FILE | cut -f1)
        echo "$(date): Backup criptografado com sucesso: $ENCRYPTED_FILE"
        echo "$(date): Tamanho do backup criptografado: $ENC_SIZE"
        
        # Calcular hash SHA256 para verificação de integridade
        HASH=$(sha256sum $ENCRYPTED_FILE | cut -d' ' -f1)
        echo "$(date): Hash SHA256: $HASH"
        echo "$HASH  $ENCRYPTED_FILE" > "$ENCRYPTED_FILE.sha256"
        
        # Registrar backup no log
        echo "$(date)|$ENCRYPTED_FILE|$ENC_SIZE|$HASH" >> "$BACKUP_DIR/backup.log"
        
    else
        echo "$(date): ERRO ao criptografar backup!"
        rm -f $BACKUP_FILE $ENCRYPTED_FILE
        exit 1
    fi
}

# Função para limpar backups antigos
cleanup_old_backups() {
    echo "$(date): Limpando backups antigos..."
    
    # Manter backups dos últimos N dias (padrão: 7 dias)
    KEEP_DAYS=${BACKUP_KEEP_DAYS:-7}
    
    # Remover backups criptografados antigos
    find $BACKUP_DIR -name "backup_*.sql.gz.enc" -type f -mtime +$KEEP_DAYS -delete
    
    # Remover arquivos de hash antigos
    find $BACKUP_DIR -name "backup_*.sql.gz.enc.sha256" -type f -mtime +$KEEP_DAYS -delete
    
    # Contar backups restantes
    BACKUP_COUNT=$(find $BACKUP_DIR -name "backup_*.sql.gz.enc" -type f | wc -l)
    echo "$(date): Limpeza concluída. Backups restantes: $BACKUP_COUNT"
}

# Função para verificar integridade dos backups
verify_backups() {
    echo "$(date): Verificando integridade dos backups..."
    
    CORRUPTED=0
    for HASH_FILE in $BACKUP_DIR/backup_*.sql.gz.enc.sha256; do
        if [ -f "$HASH_FILE" ]; then
            if sha256sum -c "$HASH_FILE" --status 2>/dev/null; then
                echo "$(date): ✓ $(basename $HASH_FILE .sha256) - OK"
            else
                echo "$(date): ✗ $(basename $HASH_FILE .sha256) - CORROMPIDO!"
                CORRUPTED=$((CORRUPTED + 1))
            fi
        fi
    done
    
    if [ $CORRUPTED -gt 0 ]; then
        echo "$(date): AVISO: $CORRUPTED backup(s) corrompido(s) encontrado(s)!"
    else
        echo "$(date): Todos os backups estão íntegros."
    fi
}

# Exibir informações de segurança
echo "=========================================="
echo "BACKUP CRIPTOGRAFADO - VIP ASSIST"
echo "=========================================="
echo "Algoritmo: AES-256-CBC"
echo "Derivação de chave: PBKDF2 (100.000 iterações)"
echo "Diretório: $BACKUP_DIR"
echo "Retenção: ${BACKUP_KEEP_DAYS:-7} dias"
echo "=========================================="

# Executar backup inicial
do_backup
cleanup_old_backups
verify_backups

# Loop para backups periódicos (a cada 6 horas)
echo "$(date): Agendando próximo backup em 6 horas..."
while true; do
    sleep 21600  # 6 horas
    do_backup
    cleanup_old_backups
    
    # Verificar integridade a cada 24 horas (4 backups)
    if [ $(($(date +%s) % 86400)) -lt 21600 ]; then
        verify_backups
    fi
done
