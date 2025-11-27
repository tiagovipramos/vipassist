@echo off
chcp 65001 >nul
cls

echo ========================================
echo  VIP ASSIST - Parar Docker
echo ========================================
echo.

echo [INFO] Parando containers...
docker-compose down

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao parar containers
    pause
    exit /b 1
)

echo.
echo ========================================
echo  ✅ Containers Parados com Sucesso!
echo ========================================
echo.
echo Os dados do banco permanecem salvos.
echo Para iniciar novamente: docker-start.bat
echo.
pause
