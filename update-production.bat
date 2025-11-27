@echo off
echo ========================================
echo  Atualizando Servidor de Producao
echo  VIP Assist - conectiva24h.com.br
echo ========================================
echo.

REM Verificar se tem acesso SSH configurado
echo [1/5] Conectando ao servidor...
echo.

REM Comandos para executar no servidor VPS
echo Execute os seguintes comandos no seu servidor VPS:
echo.
echo ----------------------------------------
echo cd /path/to/vipassist
echo git pull origin master
echo docker-compose down
echo docker-compose up --build -d
echo docker-compose logs -f
echo ----------------------------------------
echo.

echo INSTRUCOES:
echo.
echo 1. Conecte-se ao servidor via SSH:
echo    ssh usuario@conectiva24h.com.br
echo.
echo 2. Navegue ate o diretorio do projeto:
echo    cd /path/to/vipassist
echo.
echo 3. Atualize o codigo:
echo    git pull origin master
echo.
echo 4. Reconstrua e reinicie os containers:
echo    docker-compose down
echo    docker-compose up --build -d
echo.
echo 5. Verifique os logs:
echo    docker-compose logs -f app
echo.
echo 6. Teste o site:
echo    https://conectiva24h.com.br
echo.
echo ========================================

pause
