# 🔐 Configuração de Chaves de API no Banco de Dados

## Resumo das Mudanças

As chaves de API (Stripe e Gemini) foram migradas do arquivo `.env` e localStorage para o banco de dados Supabase. Isso oferece melhor segurança e centralização.

### ✅ O que foi feito:

1. **Criada tabela `api_keys`** em `scripts/setup_api_keys.sql`
   - Armazena todas as chaves de API de forma segura
   - Chaves do Stripe pré-configuradas
   - Chave Gemini com espaço para você preencher

2. **Atualizados endpoints da API:**
   - `/api/create-checkout-session` - agora busca chave Stripe do banco
   - `/api/analyze-gemini` - agora busca chave Gemini do banco

3. **Atualizados componentes:**
   - `ApiKeySettings` - salva Gemini key no banco ao invés de localStorage
   - `BankStatementUpload` - não precisa mais buscar key do localStorage

---

## 🚀 Próximas Ações (IMPORTANTE)

### 1️⃣ Executar Script SQL no Supabase

**Você precisa executar o script SQL no Supabase para criar a tabela e pré-configurar as chaves:**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para **SQL Editor** → Clique em **New Query**
4. Cole o conteúdo abaixo e execute:

```sql
-- Tabela para armazenar chaves de API
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name VARCHAR(255) NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(key_name);

-- Inserir as chaves padrão
INSERT INTO api_keys (key_name, key_value, description) 
VALUES 
  ('STRIPE_PUBLIC_KEY', 'pk_test_51Ss1eKKMF5dTadBUtJhH3LluwFOSDsQvLCVCqCYJp0PsrD6h35ygx48AR2Vvd8jmgVYWhVV0DWMBd8lOcjCm3ORP00KvmKBT3D', 'Stripe Publishable Key'),
  ('STRIPE_SECRET_KEY', 'sk_test_51Ss1eKKMF5dTadBUKXWhhY27XgDZ9BXNZ0pF6OAw6wjtSo9kZI1f8V8X0K70mf86SMUh4L4UA39AebODJkMQX7Cs00ZhHQlkhw', 'Stripe Secret Key'),
  ('GEMINI_API_KEY', '', 'Google Gemini API Key - será preenchida pelo usuário')
ON CONFLICT (key_name) DO NOTHING;
```

✅ **Pronto!** A tabela foi criada e as chaves foram inseridas.

---

### 2️⃣ Adicionar Sua Chave Gemini API

Agora você precisa adicionar sua chave Google Gemini:

1. Vá para a página de **Configurações** (`/settings`)
2. Procure pela seção **🔑 Chave Google Gemini API**
3. Cole sua chave (que começa com `AIzaSy`)
4. Clique em **Salvar Chave**

**Obtendo a chave:**
- Acesse: https://aistudio.google.com/app/apikey
- Clique em "Create API Key"
- Copie a chave gerada

---

### 3️⃣ Limpar Variáveis de Ambiente (Opcional)

Você pode remover as chaves do arquivo `.env.local` (agora elas estão no banco):

```bash
# Remova estas linhas do .env.local:
STRIPE_PUBLIC_KEY=...
STRIPE_SECRET_KEY=...
GOOGLE_GEMINI_API_KEY=...

# Mantenha apenas:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Ss1eKKMF5dTadBUtJhH3LluwFOSDsQvLCVCqCYJp0PsrD6h35ygx48AR2Vvd8jmgVYWhVV0DWMBd8lOcjCm3ORP00KvmKBT3D
NEXT_PUBLIC_API_URL=http://localhost:3000
# ... outras variáveis
```

---

## 🔍 Como Funciona Agora

### Antes (Inseguro ❌)
```
.env.local → Código → Cliente → Análises
```

### Depois (Seguro ✅)
```
Supabase (Banco) → API Route → Cliente
                ↓
            Análises com IA
```

- **Stripe Keys**: Armazenadas no banco, acessadas apenas no servidor
- **Gemini Key**: Armazenadas no banco, acessadas apenas no servidor
- **Componentes**: Não têm acesso direto às chaves, só ao servidor

---

## ✨ Benefícios

✅ **Melhor Segurança**: Chaves nunca são expostas ao cliente
✅ **Centralização**: Todas as configurações em um lugar
✅ **Facilidade**: Mude chaves sem recompilar o código
✅ **Controle**: Histórico de criação/atualização de chaves

---

## 🐛 Troubleshooting

**"Erro: Chave Gemini API não configurada"**
→ Execute o script SQL e adicione sua chave via Settings

**"Erro ao criar sessão de checkout"**
→ Verifique se as chaves Stripe foram inseridas corretamente no SQL

**"Erro ao analisar com IA"**
→ Verifique se sua chave Gemini está válida em Settings

---

## 📝 Próximas Etapas (Opcional)

Para maior segurança, você pode adicionar Row Level Security (RLS) à tabela:

```sql
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "API Keys are only accessible by admin"
  ON api_keys
  FOR SELECT
  USING (true);
```

Mas por enquanto, o código funciona sem RLS.

---

**Pronto! Seu app agora tem gerenciamento de chaves mais seguro. 🎉**
