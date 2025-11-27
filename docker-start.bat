@echo off
chcp 65001 >nul
cls

echo ========================================
echo  VIP ASSIST - Iniciar Docker
echo ========================================
echo.

echo [INFO] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker não está instalado ou não está no PATH
    echo.
    echo Instale o Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker encontrado
echo.

echo [INFO] Parando containers antigos (se existirem)...
docker-compose down 2>nul

echo.
echo [INFO] Construindo e iniciando containers...
echo.
docker-compose up --build -d

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao iniciar containers
    pause
    exit /b 1
)

echo.
echo ========================================
echo  ✅ Containers Iniciados com Sucesso!
echo ========================================
echo.
echo 📦 Containers rodando:
docker-compose ps
echo.
echo ========================================
echo  🌐 Acesso à Aplicação
echo ========================================
echo.
echo Aplicação: http://localhost:3000
echo PostgreSQL: localhost:5432
echo.
echo ========================================
echo  📋 Comandos Úteis
echo ========================================
echo.
echo Ver logs:           docker-compose logs -f
echo Ver logs da app:    docker-compose logs -f app
echo Ver logs do DB:     docker-compose logs -f postgres
echo Parar containers:   docker-compose down
echo Reiniciar:          docker-compose restart
echo.
echo ========================================
echo  ⚠️ Aguarde alguns segundos...
echo ========================================
echo.
echo A aplicação está inicializando.
echo Aguarde cerca de 30-40 segundos antes de acessar.
echo.
pause
