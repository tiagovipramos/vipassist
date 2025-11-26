# 🔐 Sistema de Backup Criptografado

## 📋 Visão Geral

O VIP ASSIST implementa um sistema robusto de backup criptografado para proteger dados sensíveis do banco de dados PostgreSQL. Os backups são criptografados usando **AES-256-CBC** com derivação de chave **PBKDF2** (100.000 iterações).

## 🔒 Características de Segurança

### Criptografia
- **Algoritmo**: AES-256-CBC (Advanced Encryption Standard)
- **Derivação de Chave**: PBKDF2 com 100.000 iterações
- **Salt**: Gerado automaticamente pelo OpenSSL
- **Verificação de Integridade**: Hash SHA-256 para cada backup

### Proteções Implementadas
✅ Backups nunca são armazenados em texto plano  
✅ Arquivo original é removido após criptografia  
✅ Verificação de integridade automática  
✅ Logs de auditoria de todas as operações  
✅ Backup de segurança antes de restaurações  
✅ Limpeza automática de backups antigos  

## 📦 Estrutura dos Arquivos

```
/backups/
├── backup_20231122_120000.sql.gz.enc      # Backup criptografado
├── backup_20231122_120000.sql.gz.enc.sha256  # Hash de integridade
├── backup.log                              # Log de operações
└── safety_backup_*.sql.gz                  # Backups de segurança
```

## 🚀 Configuração Inicial

### 1. Gerar Chave de Criptografia

```bash
# Gerar chave forte de 32 caracteres
openssl rand -base64 32
```

### 2. Configurar Variável de Ambiente

Adicione ao arquivo `.env.production`:

```bash
BACKUP_ENCRYPTION_KEY=sua-chave-gerada-aqui
```

⚠️ **CRÍTICO**: 
- **NUNCA** perca esta chave!
- **NUNCA** commite esta chave no Git!
- Armazene em local seguro (gerenciador de senhas, cofre físico, etc.)
- Sem esta chave, os backups **NÃO PODEM** ser restaurados!

### 3. Dar Permissão aos Scripts

```bash
chmod +x scripts/backup.sh
chmod +x scripts/restore.sh
```

## 📝 Uso dos Scripts

### Backup Manual

```bash
# Executar backup único
docker-compose -f docker-compose.prod.yml exec backup /scripts/backup.sh
```

### Backup Automático

Os backups são executados automaticamente a cada 6 horas pelo container Docker.

### Listar Backups Disponíveis

```bash
# Listar todos os backups
ls -lh /backups/backup_*.sql.gz.enc

# Ver log de backups
cat /backups/backup.log
```

### Verificar Integridade

```bash
# Verificar integridade de um backup específico
sha256sum -c /backups/backup_20231122_120000.sql.gz.enc.sha256

# Verificar todos os backups
for file in /backups/*.sha256; do
    sha256sum -c "$file"
done
```

### Restaurar Backup

```bash
# Restaurar backup específico
docker-compose -f docker-compose.prod.yml exec backup \
    /scripts/restore.sh /backups/backup_20231122_120000.sql.gz.enc
```

⚠️ **ATENÇÃO**: A restauração irá **SUBSTITUIR** todos os dados atuais do banco!

## 🔄 Processo de Backup

### 1. Exportação
```
PostgreSQL → pg_dump → backup.sql
```

### 2. Compressão
```
backup.sql → gzip → backup.sql.gz
```

### 3. Criptografia
```
backup.sql.gz → OpenSSL AES-256-CBC → backup.sql.gz.enc
```

### 4. Verificação
```
backup.sql.gz.enc → SHA-256 → backup.sql.gz.enc.sha256
```

### 5. Limpeza
```
Remove backup.sql e backup.sql.gz (mantém apenas .enc)
```

## 🔓 Processo de Restauração

### 1. Verificação de Integridade
```
Verifica hash SHA-256 do arquivo criptografado
```

### 2. Backup de Segurança
```
Cria backup do banco atual antes de restaurar
```

### 3. Descriptografia
```
backup.sql.gz.enc → OpenSSL → backup.sql.gz
```

### 4. Descompressão
```
backup.sql.gz → gunzip → backup.sql
```

### 5. Restauração
```
backup.sql → psql → PostgreSQL
```

### 6. Limpeza
```
Remove arquivos temporários
```

## ⚙️ Configurações Avançadas

### Retenção de Backups

Edite no `.env.production`:

```bash
# Manter backups dos últimos 7 dias
BACKUP_KEEP_DAYS=7

# Manter backups semanais dos últimos 4 semanas
BACKUP_KEEP_WEEKS=4

# Manter backups mensais dos últimos 6 meses
BACKUP_KEEP_MONTHS=6
```

### Frequência de Backup

Para alterar a frequência (padrão: 6 horas), edite `scripts/backup.sh`:

```bash
# Alterar de 6 horas (21600s) para 12 horas (43200s)
sleep 43200
```

## 🛡️ Boas Práticas de Segurança

### 1. Gerenciamento de Chaves

✅ **FAÇA**:
- Armazene a chave em gerenciador de senhas (1Password, Bitwarden, etc.)
- Mantenha cópia física em cofre
- Documente quem tem acesso à chave
- Rotacione a chave periodicamente (a cada 6-12 meses)

❌ **NÃO FAÇA**:
- Armazenar chave em texto plano
- Compartilhar chave por email/chat
- Commitar chave no Git
- Usar chaves fracas ou previsíveis

### 2. Armazenamento de Backups

✅ **FAÇA**:
- Mantenha backups em múltiplos locais
- Use armazenamento off-site (S3, Google Cloud Storage, etc.)
- Teste restaurações regularmente
- Monitore espaço em disco

❌ **NÃO FAÇA**:
- Armazenar apenas localmente
- Ignorar alertas de espaço em disco
- Assumir que backups funcionam sem testar

### 3. Testes de Restauração

Execute testes mensais:

```bash
# 1. Criar ambiente de teste
docker-compose -f docker-compose.test.yml up -d

# 2. Restaurar backup mais recente
./scripts/restore.sh /backups/backup_latest.sql.gz.enc

# 3. Verificar dados
psql -h localhost -U vipassist -d vipassist -c "SELECT COUNT(*) FROM tickets;"

# 4. Limpar ambiente de teste
docker-compose -f docker-compose.test.yml down -v
```

## 🚨 Recuperação de Desastres

### Cenário 1: Perda de Dados

```bash
# 1. Identificar último backup válido
ls -lh /backups/backup_*.sql.gz.enc

# 2. Verificar integridade
sha256sum -c /backups/backup_20231122_120000.sql.gz.enc.sha256

# 3. Restaurar
./scripts/restore.sh /backups/backup_20231122_120000.sql.gz.enc
```

### Cenário 2: Backup Corrompido

```bash
# 1. Verificar todos os backups
for file in /backups/*.sha256; do
    echo "Verificando: $file"
    sha256sum -c "$file" || echo "CORROMPIDO!"
done

# 2. Usar backup anterior válido
./scripts/restore.sh /backups/backup_anterior_valido.sql.gz.enc
```

### Cenário 3: Chave de Criptografia Perdida

⚠️ **SEM SOLUÇÃO**: Se a chave for perdida, os backups **NÃO PODEM** ser recuperados!

**Prevenção**:
- Mantenha múltiplas cópias da chave
- Documente localização das cópias
- Teste acesso às cópias regularmente

## 📊 Monitoramento

### Verificar Status dos Backups

```bash
# Ver últimos backups
tail -20 /backups/backup.log

# Verificar espaço em disco
df -h /backups

# Contar backups
ls -1 /backups/backup_*.sql.gz.enc | wc -l
```

### Alertas Recomendados

Configure alertas para:
- ❌ Falha em criar backup
- ❌ Backup corrompido detectado
- ⚠️ Espaço em disco < 20%
- ⚠️ Nenhum backup nas últimas 24h
- ⚠️ Backup muito pequeno (possível erro)

## 🔧 Troubleshooting

### Erro: "BACKUP_ENCRYPTION_KEY não está definida"

```bash
# Verificar se variável está definida
echo $BACKUP_ENCRYPTION_KEY

# Definir temporariamente
export BACKUP_ENCRYPTION_KEY="sua-chave-aqui"

# Ou adicionar ao .env.production
echo "BACKUP_ENCRYPTION_KEY=sua-chave-aqui" >> .env.production
```

### Erro: "OpenSSL não está instalado"

```bash
# Ubuntu/Debian
apt-get update && apt-get install -y openssl

# Alpine Linux (Docker)
apk add --no-cache openssl
```

### Erro: "Falha ao descriptografar"

```bash
# Verificar se a chave está correta
# Tentar descriptografar manualmente
openssl enc -aes-256-cbc -d -pbkdf2 -iter 100000 \
    -in backup.sql.gz.enc \
    -out backup.sql.gz \
    -k "sua-chave-aqui"
```

### Backup Muito Grande

```bash
# Verificar tamanho
du -h /backups/backup_*.sql.gz.enc

# Limpar dados antigos do banco antes do backup
# Exemplo: remover logs com mais de 90 dias
psql -c "DELETE FROM logs WHERE created_at < NOW() - INTERVAL '90 days';"
```

## 📚 Referências

- [OpenSSL Encryption](https://www.openssl.org/docs/man1.1.1/man1/enc.html)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup.html)
- [AES-256 Encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
- [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2)

## 📞 Suporte

Para questões sobre backup e recuperação:
1. Consulte esta documentação
2. Verifique logs em `/backups/backup.log`
3. Teste em ambiente de desenvolvimento primeiro
4. Entre em contato com a equipe de infraestrutura

---

**Última atualização**: 22/11/2023  
**Versão**: 1.0.0
