@echo off
echo Limpando cache do Prisma...

REM Remover node_modules/.prisma
if exist "node_modules\.prisma" (
    echo Removendo node_modules\.prisma...
    rmdir /s /q "node_modules\.prisma"
)

REM Remover node_modules/@prisma/client
if exist "node_modules\@prisma\client" (
    echo Removendo node_modules\@prisma\client...
    rmdir /s /q "node_modules\@prisma\client"
)

echo.
echo Regenerando Prisma Client...
call npx prisma generate

echo.
echo Pronto! Reinicie o servidor com: npm run dev
pause
