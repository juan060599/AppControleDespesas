#!/bin/bash

# Script para inicializar o projeto
echo "🚀 Inicializando App Controle de Despesas..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale Node.js 18+ antes de continuar."
    exit 1
fi

echo "✓ Node.js encontrado: $(node --version)"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependências instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Verificar arquivo .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  Arquivo .env.local não encontrado. Criando arquivo com variáveis de exemplo..."
    cp .env.local.example .env.local 2>/dev/null || echo "NEXT_PUBLIC_SUPABASE_URL=seu_url_aqui
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sua_chave_aqui" > .env.local
    echo "Por favor, atualize o arquivo .env.local com suas credenciais do Supabase"
fi

echo ""
echo "✅ Setup concluído!"
echo ""
echo "📝 Próximos passos:"
echo "1. Atualize o arquivo .env.local com suas credenciais do Supabase"
echo "2. Execute o script SQL (scripts/setup_database.sql) no SQL Editor do Supabase"
echo "3. Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
echo ""
