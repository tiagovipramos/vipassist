# 📊 Sistema de Rotação de Logs

## 📋 Visão Geral

O VIP ASSIST implementa um sistema completo de rotação de logs usando **logrotate** para evitar que os arquivos de log cresçam indefinidamente e consumam todo o espaço em disco. O sistema inclui rotação automática, compressão, monitoramento e alertas.

## 🎯 Problema Resolvido

**Antes**: Logs cresciam indefinidamente, podendo:
- ❌ Consumir todo o espaço em disco
- ❌ Causar falhas no sistema
- ❌ Dificultar análise e troubleshooting
- ❌ Impactar performance

**Depois**: Sistema gerenciado automaticamente:
- ✅ Rotação diária/semanal automática
- ✅ Compressão de logs antigos
- ✅ Retenção configurável por tipo
- ✅ Monitoramento e alertas
- ✅ Limpeza automática

## 📦 Componentes do Sistema

### 1. Configuração do Logrotate (`scripts/logrotate.conf`)
Define regras de rotação para cada tipo de log:
- Logs do Docker
- Logs do PostgreSQL
- Logs da aplicação Next.js
- Logs de backup
- Logs do Nginx
- Logs do sistema

### 2. Script de Instalação (`scripts/setup-logrotate.sh`)
Automatiza a instalação e configuração:
- Instala logrotate
- Cria diretórios necessários
- Configura permissões
- Instala configuração
- Configura cron
- Cria script de monitoramento

### 3. Docker Compose Atualizado
Inclui volumes de logs e limites:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 🔄 Políticas de Rotação

### Logs da Aplicação
```
Localização: /var/log/vipassist/*.log
Frequência: Diária
Retenção: 30 dias
Tamanho máximo: 200MB
Compressão: Sim (gzip)
```

### Logs de Erro
```
Localização: /var/log/vipassist/error.log
Frequência: Diária
Retenção: 60 dias (mais tempo para análise)
Tamanho máximo: 100MB
Compressão: Sim
Alertas: Se crescer > 10MB rapidamente
```

### Logs do Docker
```
Localização: /var/lib/docker/containers/*/*.log
Frequência: Diária
Retenção: 7 dias
Tamanho máximo: 100MB por container
Compressão: Sim
```

### Logs do PostgreSQL
```
Localização: /var/log/postgresql/*.log
Frequência: Diária
Retenção: 14 dias
Tamanho máximo: 50MB
Compressão: Sim
```

### Logs de Backup
```
Localização: /backups/*.log
Frequência: Semanal
Retenção: 12 semanas
Tamanho máximo: 10MB
Compressão: Sim
```

### Logs de Acesso
```
Localização: /var/log/vipassist/access.log
Frequência: Diária
Retenção: 30 dias
Tamanho máximo: 500MB
Compressão: Sim
Limpeza extra: Remove logs > 90 dias
```

## 🚀 Instalação

### Passo 1: Executar Script de Instalação

```bash
# Dar permissão de execução
chmod +x scripts/setup-logrotate.sh

# Executar como root
sudo ./scripts/setup-logrotate.sh
```

O script irá:
1. ✅ Detectar sistema operacional
2. ✅ Instalar logrotate (se necessário)
3. ✅ Criar diretórios de logs
4. ✅ Configurar permissões
5. ✅ Instalar configuração
6. ✅ Testar configuração
7. ✅ Configurar cron
8. ✅ Criar script de monitoramento
9. ✅ Executar primeira rotação

### Passo 2: Verificar Instalação

```bash
# Verificar se logrotate está instalado
logrotate --version

# Verificar configuração
cat /etc/logrotate.d/vipassist

# Verificar cron
grep logrotate /etc/crontab
```

### Passo 3: Atualizar Docker Compose

```bash
# Recriar containers com novos volumes
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Uso e Comandos

### Testar Configuração

```bash
# Modo debug (não executa, apenas mostra o que faria)
sudo logrotate -d /etc/logrotate.d/vipassist

# Verificar sintaxe
sudo logrotate -v /etc/logrotate.d/vipassist
```

### Forçar Rotação Manual

```bash
# Forçar rotação imediata
sudo logrotate -f /etc/logrotate.d/vipassist

# Forçar rotação com verbose
sudo logrotate -fv /etc/logrotate.d/vipassist
```

### Verificar Status

```bash
# Ver status da última rotação
cat /var/lib/logrotate/status

# Ver logs do logrotate
grep logrotate /var/log/syslog

# Ver logs rotacionados
ls -lh /var/log/vipassist/
```

### Monitoramento

```bash
# Executar monitoramento manual
sudo /usr/local/bin/vipassist-log-monitor

# Ver alertas
cat /var/log/vipassist/alerts.log

# Ver tamanho total dos logs
du -sh /var/log/vipassist/
```

## 📊 Estrutura de Arquivos

### Antes da Rotação
```
/var/log/vipassist/
├── access.log          (500MB)
├── error.log           (100MB)
└── app.log             (200MB)
```

### Depois da Rotação
```
/var/log/vipassist/
├── access.log          (novo, vazio)
├── access.log-20231122 (comprimido)
├── access.log-20231121.gz
├── access.log-20231120.gz
├── error.log           (novo, vazio)
├── error.log-20231122
├── error.log-20231121.gz
├── app.log             (novo, vazio)
├── app.log-20231122
└── app.log-20231121.gz
```

## ⚙️ Configuração Avançada

### Alterar Frequência de Rotação

Edite `/etc/logrotate.d/vipassist`:

```bash
# Mudar de diário para semanal
/var/log/vipassist/*.log {
    weekly  # era: daily
    rotate 12  # manter 12 semanas
    # ... resto da configuração
}
```

### Alterar Retenção

```bash
# Manter logs por mais tempo
/var/log/vipassist/error.log {
    daily
    rotate 90  # era: 60 (manter 90 dias)
    # ... resto da configuração
}
```

### Alterar Tamanho Máximo

```bash
# Rotacionar quando atingir tamanho específico
/var/log/vipassist/*.log {
    daily
    maxsize 500M  # era: 200M
    # ... resto da configuração
}
```

### Adicionar Novo Tipo de Log

```bash
# Adicionar ao final de /etc/logrotate.d/vipassist
/var/log/vipassist/custom.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
    dateext
    dateformat -%Y%m%d
    maxsize 100M
}
```

## 🔔 Sistema de Alertas

### Alertas Automáticos

O sistema gera alertas para:

1. **Logs Grandes** (> 500MB total)
   ```
   Localização: /var/log/vipassist/alerts.log
   Frequência: A cada 6 horas
   ```

2. **Logs Não Rotacionados** (> 7 dias)
   ```
   Verifica arquivos .log sem rotação recente
   ```

3. **Erro de Rotação**
   ```
   Registrado em /var/log/syslog
   ```

### Verificar Alertas

```bash
# Ver todos os alertas
cat /var/log/vipassist/alerts.log

# Ver alertas recentes (últimas 24h)
find /var/log/vipassist/alerts.log -mtime -1 -exec cat {} \;

# Contar alertas
grep -c "ALERTA" /var/log/vipassist/alerts.log
```

### Configurar Notificações

Para receber notificações por email, adicione ao script de monitoramento:

```bash
# Editar /usr/local/bin/vipassist-log-monitor
# Adicionar após detectar alerta:

if [ "$TOTAL_SIZE" -gt "$ALERT_THRESHOLD_MB" ]; then
    # Enviar email
    echo "Logs ocupando ${TOTAL_SIZE}MB" | \
        mail -s "ALERTA: Logs VIP ASSIST" admin@example.com
fi
```

## 📈 Monitoramento e Métricas

### Dashboard de Logs

```bash
#!/bin/bash
# Script para gerar dashboard de logs

echo "=========================================="
echo "DASHBOARD DE LOGS - VIP ASSIST"
echo "=========================================="
echo ""

# Tamanho total
TOTAL=$(du -sh /var/log/vipassist/ | cut -f1)
echo "Tamanho Total: $TOTAL"
echo ""

# Por tipo
echo "Por Tipo de Log:"
du -sh /var/log/vipassist/*.log 2>/dev/null | sort -rh
echo ""

# Logs comprimidos
COMPRESSED=$(find /var/log/vipassist/ -name "*.gz" | wc -l)
echo "Logs Comprimidos: $COMPRESSED arquivos"
echo ""

# Última rotação
LAST_ROTATION=$(stat -c %y /var/lib/logrotate/status 2>/dev/null | cut -d' ' -f1)
echo "Última Rotação: $LAST_ROTATION"
echo ""

# Alertas recentes
ALERTS=$(grep -c "ALERTA" /var/log/vipassist/alerts.log 2>/dev/null || echo 0)
echo "Alertas Ativos: $ALERTS"
echo ""

echo "=========================================="
```

### Métricas Importantes

1. **Taxa de Crescimento**
   ```bash
   # Ver crescimento diário
   du -sh /var/log/vipassist/ --time | tail -7
   ```

2. **Logs Mais Ativos**
   ```bash
   # Identificar logs que mais crescem
   find /var/log/vipassist/ -name "*.log" -exec du -h {} \; | sort -rh | head -10
   ```

3. **Espaço Economizado**
   ```bash
   # Comparar tamanho original vs comprimido
   find /var/log/vipassist/ -name "*.gz" -exec gunzip -l {} \;
   ```

## 🛠️ Troubleshooting

### Problema: Rotação Não Está Funcionando

```bash
# 1. Verificar se cron está rodando
systemctl status cron

# 2. Verificar logs do cron
grep logrotate /var/log/syslog

# 3. Testar manualmente
sudo logrotate -fv /etc/logrotate.d/vipassist

# 4. Verificar permissões
ls -l /etc/logrotate.d/vipassist
```

### Problema: Logs Ainda Crescendo Muito

```bash
# 1. Verificar tamanho máximo configurado
grep maxsize /etc/logrotate.d/vipassist

# 2. Reduzir tamanho máximo
sudo sed -i 's/maxsize 200M/maxsize 100M/g' /etc/logrotate.d/vipassist

# 3. Forçar rotação
sudo logrotate -f /etc/logrotate.d/vipassist
```

### Problema: Erro de Permissão

```bash
# 1. Verificar proprietário dos logs
ls -l /var/log/vipassist/

# 2. Corrigir permissões
sudo chown -R www-data:www-data /var/log/vipassist/
sudo chmod 755 /var/log/vipassist/
sudo chmod 644 /var/log/vipassist/*.log

# 3. Testar novamente
sudo logrotate -fv /etc/logrotate.d/vipassist
```

### Problema: Logs Comprimidos Não Podem Ser Lidos

```bash
# Descompactar log específico
gunzip /var/log/vipassist/app.log-20231122.gz

# Ver log comprimido sem descompactar
zcat /var/log/vipassist/app.log-20231122.gz | less

# Buscar em log comprimido
zgrep "erro" /var/log/vipassist/app.log-20231122.gz
```

## 🔒 Segurança e Boas Práticas

### 1. Permissões Adequadas

```bash
# Logs da aplicação
chmod 644 /var/log/vipassist/*.log
chown www-data:www-data /var/log/vipassist/*.log

# Logs do PostgreSQL
chmod 640 /var/log/postgresql/*.log
chown postgres:postgres /var/log/postgresql/*.log

# Configuração do logrotate
chmod 644 /etc/logrotate.d/vipassist
chown root:root /etc/logrotate.d/vipassist
```

### 2. Retenção Apropriada

- **Logs de Acesso**: 30 dias (análise de tráfego)
- **Logs de Erro**: 60 dias (troubleshooting)
- **Logs de Auditoria**: 90+ dias (compliance)
- **Logs de Debug**: 7 dias (desenvolvimento)

### 3. Monitoramento Regular

```bash
# Adicionar ao crontab para relatório semanal
0 9 * * 1 /usr/local/bin/vipassist-log-monitor | mail -s "Relatório Semanal de Logs" admin@example.com
```

### 4. Backup de Logs Importantes

```bash
# Antes de limpar logs antigos, fazer backup
tar -czf logs-backup-$(date +%Y%m).tar.gz /var/log/vipassist/*.log-*
mv logs-backup-*.tar.gz /backups/logs/
```

## 📚 Referências

- [Logrotate Manual](https://linux.die.net/man/8/logrotate)
- [Docker Logging](https://docs.docker.com/config/containers/logging/)
- [PostgreSQL Logging](https://www.postgresql.org/docs/current/runtime-config-logging.html)
- [Best Practices for Log Management](https://www.loggly.com/ultimate-guide/managing-log-files/)

## 📞 Suporte

Para questões sobre rotação de logs:
1. Consulte esta documentação
2. Verifique `/var/log/vipassist/alerts.log`
3. Execute: `sudo logrotate -d /etc/logrotate.d/vipassist`
4. Entre em contato com a equipe de infraestrutura

---

**Última atualização**: 22/11/2023  
**Versão**: 1.0.0
