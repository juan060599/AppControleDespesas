@echo off
REM Script para inicializar o projeto no Windows

echo 🚀 Inicializando App Controle de Despesas...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado. Por favor, instale Node.js 18+ antes de continuar.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js encontrado: %NODE_VERSION%

REM Instalar dependências
echo 📦 Instalando dependências...
call npm install

if %errorlevel% equ 0 (
    echo ✓ Dependências instaladas com sucesso
) else (
    echo ❌ Erro ao instalar dependências
    exit /b 1
)

REM Verificar arquivo .env.local
if not exist ".env.local" (
    echo ⚠️  Arquivo .env.local não encontrado. Criando arquivo com variáveis de exemplo...
    (
        echo NEXT_PUBLIC_SUPABASE_URL=https://rgxhxgigemncqkskaprj.supabase.co
        echo NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_D9M6qWPxdZ_aZ52k0mKfCA_Sn9RJHZU
        echo SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key_aqui
    ) > .env.local
    echo ✓ Arquivo .env.local criado
)

echo.
echo ✅ Setup concluído!
echo.
echo 📝 Próximos passos:
echo 1. Execute o script SQL (scripts/setup_database.sql) no SQL Editor do Supabase
echo 2. Execute 'npm run dev' para iniciar o servidor de desenvolvimento
echo.
