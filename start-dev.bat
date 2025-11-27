@echo off
chcp 65001 >nul
cls

echo ========================================
echo  VIP ASSIST - Iniciar Desenvolvimento
echo ========================================
echo.

REM Verificar se Docker está disponível
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Docker não está disponível!
    echo.
    echo Você tem 2 opções:
    echo.
    echo [1] Instalar e iniciar Docker Desktop
    echo     - Baixe em: https://www.docker.com/products/docker-desktop
    echo     - Após instalar, execute este script novamente
    echo.
    echo [2] Usar modo MOCK (sem banco de dados)
    echo     - Dados temporários em memória
    echo     - Ideal para desenvolvimento de interface
    echo.
    choice /C 12 /N /M "Escolha uma opcao (1 ou 2): "
    
    if errorlevel 2 (
        echo.
        echo [MODO MOCK] Habilitando dados mockados...
        
        REM Criar arquivo .env.local com mocks habilitados
        echo NEXT_PUBLIC_USE_MOCKS="true" > .env.local
        
        echo Modo mock habilitado!
        echo.
        echo [INFO] Iniciando aplicação sem banco de dados...
        echo.
        goto START_APP
    )
    
    if errorlevel 1 (
        echo.
        echo Por favor, instale o Docker Desktop e execute este script novamente.
        pause
        exit /b 1
    )
)

echo [1/3] Verificando Docker Desktop...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Docker Desktop não está rodando!
    echo.
    echo Por favor:
    echo 1. Abra o Docker Desktop
    echo 2. Aguarde até que esteja completamente iniciado
    echo 3. Execute este script novamente
    echo.
    pause
    exit /b 1
)

echo Docker Desktop está rodando!
echo.

echo [2/3] Iniciando PostgreSQL...
echo.

REM Verificar se o container já existe
docker ps -a --filter "name=vipassist-postgres-dev" --format "{{.Names}}" | findstr "vipassist-postgres-dev" >nul 2>&1
if %errorlevel% equ 0 (
    echo Container PostgreSQL já existe. Iniciando...
    docker start vipassist-postgres-dev
) else (
    echo Criando e iniciando container PostgreSQL...
    docker-compose -f docker-compose.dev.yml up -d
)

echo.
echo Aguardando PostgreSQL ficar pronto...
timeout /t 5 /nobreak >nul

REM Verificar se PostgreSQL está saudável
:CHECK_POSTGRES
docker exec vipassist-postgres-dev pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    echo Aguardando PostgreSQL...
    timeout /t 2 /nobreak >nul
    goto CHECK_POSTGRES
)

echo PostgreSQL está pronto!
echo.

echo [3/3] Executando migrações do Prisma...
echo.
npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] Erro ao executar migrações. Tentando criar o banco...
    npx prisma db push
)

echo.
echo Gerando Prisma Client...
npx prisma generate

echo.
echo ========================================
echo  Banco de dados configurado!
echo ========================================
echo.

:START_APP
echo [4/4] Iniciando aplicação Next.js...
echo.
echo ========================================
echo  Frontend rodando em: http://localhost:3000
echo ========================================
echo.
echo Pressione Ctrl+C para parar
echo.

npm run dev
