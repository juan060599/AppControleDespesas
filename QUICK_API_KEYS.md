# ⚡ Quick Start - API Keys no Banco

## TL;DR - Faça Isso AGORA

### 1️⃣ Copie este SQL:
```sql
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name VARCHAR(255) NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(key_name);

INSERT INTO api_keys (key_name, key_value, description) 
VALUES 
  ('STRIPE_PUBLIC_KEY', 'pk_test_51Ss1eKKMF5dTadBUtJhH3LluwFOSDsQvLCVCqCYJp0PsrD6h35ygx48AR2Vvd8jmgVYWhVV0DWMBd8lOcjCm3ORP00KvmKBT3D', 'Stripe Publishable Key'),
  ('STRIPE_SECRET_KEY', 'sk_test_51Ss1eKKMF5dTadBUKXWhhY27XgDZ9BXNZ0pF6OAw6wjtSo9kZI1f8V8X0K70mf86SMUh4L4UA39AebODJkMQX7Cs00ZhHQlkhw', 'Stripe Secret Key'),
  ('GEMINI_API_KEY', '', 'Google Gemini API Key')
ON CONFLICT (key_name) DO NOTHING;
```

### 2️⃣ Execute no Supabase:
- https://supabase.com/dashboard
- SQL Editor → New Query
- Cole o código acima
- Clique em "Run"

### 3️⃣ Adicione sua chave Gemini:
- Vá para http://localhost:3000/settings
- Procure "🔑 Chave Google Gemini API"
- Cole sua chave (começa com `AIzaSy`)
- Clique "Salvar Chave"

### 4️⃣ Pronto! ✅
- Seu app agora usa chaves do banco
- Mais seguro
- Sem necessidade de .env

---

## O que mudou?

### Stripe
- ✅ Automaticamente buscado do banco
- Nada a fazer

### Gemini
- ✅ Adicionável via Settings
- Procure a seção de chaves

### Banco de Dados
- ✅ Nova tabela `api_keys` criada
- ✅ Stripe keys pré-preenchidas
- ✅ Espaço para sua chave Gemini

---

## Troubleshooting

**"Chave não configurada"**
→ Execute o SQL acima

**"Erro ao fazer análise"**
→ Verifique chave Gemini em `/settings`

**"Erro ao fazer checkout"**
→ Verifique se SQL foi executado

---

**Documentação completa**: Veja `SETUP_API_KEYS.md`
