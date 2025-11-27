# Instalação SSL/HTTPS - conectiva24h.com.br

## 📋 Pré-requisitos

Antes de executar o script de instalação SSL, certifique-se de que:

### 1. DNS Configurado Corretamente
O domínio **conectiva24h.com.br** deve estar apontando para o IP da sua VPS.

**Verificar DNS:**
```bash
# Ver IP do servidor
curl ifconfig.me

# Ver IP do domínio
dig +short conectiva24h.com.br
```

Os IPs devem ser iguais! Se não forem, configure os registros DNS:

**Registros DNS necessários:**
- **Tipo A**: `conectiva24h.com.br` → `IP_DA_VPS`
- **Tipo A**: `www.conectiva24h.com.br` → `IP_DA_VPS`

### 2. Portas Abertas no Firewall
```bash
# Verificar firewall
sudo ufw status

# Se necessário, abrir portas
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### 3. Email Válido
Edite o script e altere o email para receber notificações do Let's Encrypt:
```bash
nano /root/vipassist/scripts/setup-ssl.sh
# Altere a linha: EMAIL="admin@conectiva24h.com.br"
```

---

## 🚀 Instalação

### Passo 1: Conectar na VPS
```bash
ssh root@SEU_IP_VPS
```

### Passo 2: Navegar para o diretório do projeto
```bash
cd /root/vipassist
```

### Passo 3: Fazer backup da configuração atual (opcional mas recomendado)
```bash
cp nginx/nginx.conf nginx/nginx.conf.backup
cp .env .env.backup
```

### Passo 4: Dar permissão de execução ao script
```bash
chmod +x scripts/setup-ssl.sh
```

### Passo 5: Executar o script de instalação SSL
```bash
sudo bash scripts/setup-ssl.sh
```

O script irá:
1. ✅ Verificar se o DNS está configurado
2. ✅ Instalar o Certbot
3. ✅ Parar os containers temporariamente
4. ✅ Obter certificado SSL do Let's Encrypt
5. ✅ Configurar o Nginx com HTTPS
6. ✅ Configurar renovação automática
7. ✅ Atualizar variáveis de ambiente
8. ✅ Reiniciar containers com SSL

---

## 🔍 Verificação

### 1. Verificar se os containers estão rodando
```bash
cd /root/vipassist
docker-compose -f docker-compose.full.yml ps
```

Todos devem estar com status "Up".

### 2. Verificar certificado SSL
```bash
certbot certificates
```

Deve mostrar:
- Domínios: conectiva24h.com.br, www.conectiva24h.com.br
- Validade: ~90 dias
- Status: Valid

### 3. Testar acesso HTTPS
```bash
# Testar localmente
curl -I https://localhost

# Testar pelo domínio
curl -I https://conectiva24h.com.br
```

### 4. Verificar logs do Nginx
```bash
docker-compose -f docker-compose.full.yml logs -f nginx
```

### 5. Testar no navegador
Acesse: **https://conectiva24h.com.br**

Você deve ver:
- ✅ Cadeado verde na barra de endereço
- ✅ Certificado válido
- ✅ Site carregando normalmente

---

## 🔄 Renovação Automática

O certificado SSL é válido por **90 dias** e será renovado automaticamente.

### Verificar configuração de renovação
```bash
cat /etc/cron.d/certbot-renew
```

### Testar renovação (dry-run)
```bash
certbot renew --dry-run
```

### Renovar manualmente (se necessário)
```bash
certbot renew
```

Após renovação manual, copie os certificados:
```bash
cp /etc/letsencrypt/live/conectiva24h.com.br/fullchain.pem /root/vipassist/nginx/ssl/cert.pem
cp /etc/letsencrypt/live/conectiva24h.com.br/privkey.pem /root/vipassist/nginx/ssl/key.pem
cd /root/vipassist
docker-compose -f docker-compose.full.yml restart nginx
```

---

## 🛠️ Troubleshooting

### Problema: DNS não está apontando corretamente
**Solução:**
1. Configure os registros DNS no seu provedor
2. Aguarde propagação (pode levar até 48h, geralmente 1-2h)
3. Execute o script novamente

### Problema: Porta 80 ou 443 já está em uso
**Solução:**
```bash
# Ver o que está usando as portas
sudo lsof -i :80
sudo lsof -i :443

# Parar containers
cd /root/vipassist
docker-compose -f docker-compose.full.yml down

# Executar script novamente
sudo bash scripts/setup-ssl.sh
```

### Problema: Certificado não foi gerado
**Solução:**
```bash
# Ver logs do Certbot
sudo journalctl -u certbot

# Tentar obter certificado manualmente
certbot certonly --standalone \
  --email seu-email@exemplo.com \
  --agree-tos \
  --domains conectiva24h.com.br \
  --domains www.conectiva24h.com.br
```

### Problema: Site não carrega após instalação
**Solução:**
```bash
# Verificar logs
docker-compose -f docker-compose.full.yml logs app
docker-compose -f docker-compose.full.yml logs nginx

# Reiniciar containers
docker-compose -f docker-compose.full.yml restart

# Se necessário, rebuild
docker-compose -f docker-compose.full.yml down
docker-compose -f docker-compose.full.yml up -d --build
```

### Problema: Erro "too many certificates already issued"
**Solução:**
Let's Encrypt tem limite de 5 certificados por semana por domínio.
- Aguarde 7 dias
- Ou use o modo staging para testes:
```bash
certbot certonly --staging --standalone \
  --email seu-email@exemplo.com \
  --agree-tos \
  --domains conectiva24h.com.br
```

---

## 📊 Monitoramento

### Verificar status SSL
```bash
# SSL Labs (online)
# Acesse: https://www.ssllabs.com/ssltest/analyze.html?d=conectiva24h.com.br

# Verificar expiração do certificado
echo | openssl s_client -servername conectiva24h.com.br -connect conectiva24h.com.br:443 2>/dev/null | openssl x509 -noout -dates
```

### Logs importantes
```bash
# Logs do Nginx
docker-compose -f docker-compose.full.yml logs -f nginx

# Logs da aplicação
docker-compose -f docker-compose.full.yml logs -f app

# Logs do sistema
sudo journalctl -f
```

---

## 🔐 Segurança

O script configura automaticamente:

✅ **Redirecionamento HTTP → HTTPS**
- Todo tráfego HTTP é redirecionado para HTTPS

✅ **Headers de Segurança**
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

✅ **Protocolos Seguros**
- TLS 1.2 e TLS 1.3
- Ciphers modernos e seguros

✅ **OCSP Stapling**
- Melhora performance e privacidade

---

## 📝 Comandos Úteis

```bash
# Ver certificados instalados
certbot certificates

# Revogar certificado (se necessário)
certbot revoke --cert-path /etc/letsencrypt/live/conectiva24h.com.br/cert.pem

# Deletar certificado
certbot delete --cert-name conectiva24h.com.br

# Testar configuração do Nginx
docker exec vipassist-nginx nginx -t

# Recarregar configuração do Nginx
docker-compose -f docker-compose.full.yml exec nginx nginx -s reload

# Ver status dos containers
docker-compose -f docker-compose.full.yml ps

# Ver uso de recursos
docker stats

# Backup dos certificados
sudo tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/
```

---

## 🎯 Checklist Final

Após a instalação, verifique:

- [ ] Site acessível via https://conectiva24h.com.br
- [ ] Site acessível via https://www.conectiva24h.com.br
- [ ] HTTP redireciona para HTTPS
- [ ] Cadeado verde no navegador
- [ ] Certificado válido (verificar detalhes)
- [ ] Renovação automática configurada
- [ ] Logs sem erros
- [ ] Todos os containers rodando

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose -f docker-compose.full.yml logs`
2. Teste a configuração: `docker exec vipassist-nginx nginx -t`
3. Verifique o DNS: `dig +short conectiva24h.com.br`
4. Verifique o certificado: `certbot certificates`

---

## 🔄 Reverter Instalação (se necessário)

Se algo der errado e você precisar voltar à configuração anterior:

```bash
cd /root/vipassist

# Parar containers
docker-compose -f docker-compose.full.yml down

# Restaurar backup
cp nginx/nginx.conf.backup nginx/nginx.conf
cp .env.backup .env

# Remover certificados
rm -rf nginx/ssl/*

# Reiniciar sem SSL
docker-compose -f docker-compose.full.yml up -d
```

---

## ✅ Conclusão

Após seguir este guia, seu site estará:
- ✅ Acessível via HTTPS
- ✅ Com certificado SSL válido
- ✅ Com renovação automática configurada
- ✅ Com headers de segurança
- ✅ Com redirecionamento HTTP → HTTPS

**Seu site estará seguro e profissional!** 🎉
