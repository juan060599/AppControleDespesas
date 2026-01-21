@echo off
REM ============================================================
REM Script para Rodar App no Android Studio
REM ============================================================

echo.
echo ========================================
echo    Controle de Despesas - Android Studio
echo ========================================
echo.

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado!
    echo.
    echo Instale Node.js de: https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js encontrado:
node --version

REM Instalar dependencias se necessario
if not exist "node_modules" (
    echo.
    echo 📦 Instalando dependencias...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependencias
        pause
        exit /b 1
    )
)

REM Iniciar servidor
echo.
echo 🚀 Iniciando servidor...
echo.
echo ====================================
echo    SERVIDOR INICIANDO...
echo ====================================
echo.
echo 📱 No emulador do Android Studio:
echo    Navegador ^> http://10.0.2.2:3000
echo.
echo 💻 No PC:
echo    Navegador ^> http://localhost:3000
echo.
echo ====================================
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

call npm run dev

pause
