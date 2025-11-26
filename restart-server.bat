@echo off
echo ========================================
echo  VIP ASSIST - Restart Server Script
echo ========================================
echo.

REM ====================================
REM 1. KILL ALL PORTS
REM ====================================
echo [1/4] Matando processos nas portas...
echo.

REM Matar processos na porta 3000 (Next.js frontend)
echo Verificando porta 3000 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Matando processo %%a na porta 3000
    taskkill /F /PID %%a 2>nul
)

REM Matar processos na porta 3001 (caso tenha outro serviço)
echo Verificando porta 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    echo Matando processo %%a na porta 3001
    taskkill /F /PID %%a 2>nul
)

REM Matar processos na porta 5000 (caso tenha backend futuro)
echo Verificando porta 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Matando processo %%a na porta 5000
    taskkill /F /PID %%a 2>nul
)

REM Matar processos na porta 8080 (caso tenha outro serviço)
echo Verificando porta 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do (
    echo Matando processo %%a na porta 8080
    taskkill /F /PID %%a 2>nul
)

echo.
echo Portas limpas!
timeout /t 2 /nobreak >nul

REM ====================================
REM 2. DOWN NO SERVIDOR
REM ====================================
echo.
echo [2/4] Parando servidores...
echo.

REM Matar apenas processos node.exe relacionados ao Next.js (não fecha navegadores)
echo Parando processos Node.js do Next.js...
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /FO LIST ^| findstr /C:"PID:"') do (
    set "pid=%%a"
    REM Verifica se o processo está usando as portas do projeto
    netstat -ano | findstr ":3000" | findstr "!pid!" >nul 2>&1
    if !errorlevel! equ 0 (
        echo Matando processo Node.js !pid! (porta 3000)
        taskkill /F /PID !pid! 2>nul
    )
    netstat -ano | findstr ":3001" | findstr "!pid!" >nul 2>&1
    if !errorlevel! equ 0 (
        echo Matando processo Node.js !pid! (porta 3001)
        taskkill /F /PID !pid! 2>nul
    )
)
echo Processos Node.js do projeto parados!

timeout /t 2 /nobreak >nul

REM ====================================
REM 3. LIMPAR CACHE COMPLETO
REM ====================================
echo.
echo [3/4] Limpando cache completo do Next.js...
echo.

REM Limpar .next
if exist .next (
    echo Removendo pasta .next...
    rmdir /s /q .next
    echo Cache .next removido!
)

REM Limpar .swc
if exist .swc (
    echo Removendo pasta .swc...
    rmdir /s /q .swc
    echo Cache .swc removido!
)

REM Limpar node_modules/.cache
if exist node_modules\.cache (
    echo Removendo cache do node_modules...
    rmdir /s /q node_modules\.cache
    echo Cache node_modules removido!
)

echo.
echo Cache completamente limpo!
timeout /t 2 /nobreak >nul

REM ====================================
REM 4. REINICIAR FRONTEND
REM ====================================
echo.
echo [4/4] Iniciando Frontend...
echo.
echo ========================================
echo  Frontend rodando em: http://localhost:3000
echo ========================================
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

REM Iniciar o servidor Next.js
npm run dev

REM Se o npm run dev falhar, pausar para ver o erro
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao iniciar o servidor!
    echo Verifique se as dependencias estao instaladas: npm install
    pause
)
