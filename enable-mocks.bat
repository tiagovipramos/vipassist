@echo off
chcp 65001 >nul
cls

echo ========================================
echo  VIP ASSIST - Habilitar Modo Mock
echo ========================================
echo.

echo [INFO] Habilitando dados mockados...
echo.

REM Criar arquivo .env.local com mocks habilitados
echo NEXT_PUBLIC_USE_MOCKS="true" > .env.local

echo ✅ Modo mock habilitado com sucesso!
echo.
echo ========================================
echo  Configuração Aplicada
echo ========================================
echo.
echo Arquivo criado: .env.local
echo Conteúdo: NEXT_PUBLIC_USE_MOCKS="true"
echo.
echo ========================================
echo  Próximos Passos
echo ========================================
echo.
echo 1. Reinicie o servidor Next.js (Ctrl+C e npm run dev)
echo 2. Ou execute: restart-server.bat
echo.
echo A aplicação agora usará dados mockados em memória.
echo Não é necessário banco de dados!
echo.
echo Para desabilitar o modo mock:
echo - Delete o arquivo .env.local
echo - Ou mude para NEXT_PUBLIC_USE_MOCKS="false"
echo.
pause
