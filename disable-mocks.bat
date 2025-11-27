@echo off
chcp 65001 >nul
cls

echo ========================================
echo  VIP ASSIST - Desabilitar Modo Mock
echo ========================================
echo.

echo [INFO] Desabilitando dados mockados...
echo.

REM Verificar se .env.local existe
if exist .env.local (
    del .env.local
    echo ✅ Arquivo .env.local removido!
    echo.
    echo Modo mock desabilitado com sucesso!
) else (
    echo ⚠️  Arquivo .env.local não encontrado.
    echo O modo mock já está desabilitado.
)

echo.
echo ========================================
echo  Próximos Passos
echo ========================================
echo.
echo IMPORTANTE: Agora você precisa de um banco de dados!
echo.
echo Opções:
echo.
echo 1. Usar Docker + PostgreSQL (RECOMENDADO)
echo    Execute: start-dev.bat
echo.
echo 2. Usar PostgreSQL local
echo    Configure a DATABASE_URL no arquivo .env
echo.
echo 3. Voltar ao modo mock
echo    Execute: enable-mocks.bat
echo.
pause
