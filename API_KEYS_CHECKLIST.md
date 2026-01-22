# 🔑 Atualizações de Chaves de API - Checklist Final

## ✅ O que foi feito

- [x] **Database**: Criada tabela `api_keys` no Supabase
- [x] **API Routes**: Atualizados para buscar chaves do banco
  - `/api/create-checkout-session` - Stripe
  - `/api/analyze-gemini` - Gemini
- [x] **Components**: Atualizados
  - `ApiKeySettings` - Salva no banco
  - `BankStatementUpload` - Remove localStorage
- [x] **Design System**: Corrigido com `transitions.default`

---

## 🚀 Próximas Ações (OBRIGATÓRIO)

### Passo 1: Execute o Script SQL

**Abra: https://supabase.com/dashboard**

1. Selecione seu projeto AppControleDespesas
2. Vá para **SQL Editor**
3. Clique em **New Query**
4. Cole o seguinte código:

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

5. Clique em **RUN** (ou Ctrl+Enter)

**Resultado esperado:** Query exibida com sucesso

---

### Passo 2: Adicione Sua Chave Gemini

**Abra: http://localhost:3000/settings**

1. Role até encontrar **🔑 Chave Google Gemini API**
2. Copie sua chave do Google AI Studio
3. Cole no campo
4. Clique em **Salvar Chave**

**Para obter a chave:**
- Acesse: https://aistudio.google.com/app/apikey
- Clique em **Create API Key**
- Copie a chave (começa com `AIzaSy`)

**Resultado esperado:** "✅ Chave API salva com sucesso no banco de dados!"

---

### Passo 3: Teste as Alterações

✅ **Teste 1 - Upload de Extrato:**
1. Vá para `/dashboard`
2. Faça upload de um extrato CSV/OFX
3. Verifique se o Gemini analisa corretamente
4. Deve funcionar com a chave do banco

✅ **Teste 2 - Checkout:**
1. Vá para `/pricing`
2. Clique em "Assinar Pro"
3. Verifique se o Stripe consegue criar a sessão
4. Deve funcionar com chave Stripe do banco

---

## 📊 Status das Chaves

| Chave | Status | Armazenada | Nota |
|-------|--------|-----------|------|
| `STRIPE_PUBLIC_KEY` | ✅ Pronta | Banco | Pré-preenchida |
| `STRIPE_SECRET_KEY` | ✅ Pronta | Banco | Pré-preenchida |
| `GEMINI_API_KEY` | ⏳ Pendente | Banco | Adicione em Settings |

---

## 🔍 Como Verificar que Tudo Funciona

### Verificação 1: Chaves no Banco
No Supabase SQL Editor, rode:

```sql
SELECT key_name, left(key_value, 10) as preview, description 
FROM api_keys;
```

Deve retornar 3 linhas (Stripe Public, Stripe Secret, Gemini)

### Verificação 2: API Keys Settings
- `/settings` deve carregar sem erros
- Campo de Gemini deve aceitar entrada
- Botão "Salvar Chave" deve funcionar

### Verificação 3: Análise Funcionando
- Upload um extrato → Deve usar Gemini do banco
- Veja no browser console se há erros

### Verificação 4: Checkout Funcionando
- Clique "Assinar" → Deve criar sessão Stripe
- Deve redirecionar para checkout.stripe.com

---

## ⚠️ Problemas Comuns

### "Erro: Chave Gemini API não configurada"
**Solução:**
- [ ] Execute o script SQL acima
- [ ] Adicione sua chave em Settings
- [ ] Recarregue a página

### "Erro ao analisar com IA"
**Solução:**
- [ ] Verifique se a chave Gemini começa com `AIzaSy`
- [ ] Verifique se a chave está ativa em aistudio.google.com
- [ ] Tente gerar uma nova chave

### "Erro ao criar sessão de checkout"
**Solução:**
- [ ] Verifique se o script SQL foi executado
- [ ] Verifique se as chaves Stripe foram inseridas
- [ ] Rode: `SELECT * FROM api_keys;` para listar

---

## 📝 Arquivos Atualizados

```
✅ lib/database.ts
   └─ Adicionadas funções getApiKey, getAllApiKeys, setApiKey
   └─ Adicionada interface ApiKey

✅ app/api/create-checkout-session/route.ts
   └─ Busca chave Stripe do banco

✅ app/api/analyze-gemini/route.ts
   └─ Busca chave Gemini do banco

✅ components/ApiKeySettings.tsx
   └─ Salva chave no banco

✅ components/BankStatementUpload.tsx
   └─ Remove dependência de localStorage

✅ lib/designSystem.ts
   └─ Adicionado transitions.default

✅ scripts/setup_api_keys.sql (Novo)
   └─ Script para criar tabela e inserir chaves

✅ SETUP_API_KEYS.md (Novo)
   └─ Documentação detalhada

✅ MIGRATION_SUMMARY.md (Novo)
   └─ Resumo técnico das mudanças

✅ QUICK_API_KEYS.md (Novo)
   └─ TL;DR rápido
```

---

## 🎯 Resumo Final

| Item | Antes | Depois |
|------|-------|--------|
| Chaves Stripe | `.env` estático | Banco dinâmico |
| Chave Gemini | localStorage | Banco seguro |
| API Routes | Usam process.env | Busca do banco |
| Adicionar chaves | Editar .env | Usar Settings |
| Segurança | ⚠️ Cliente vê chaves | ✅ Servidor protege |

---

## ✨ Benefícios

✅ **Mais Seguro**: Chaves no servidor, não no cliente
✅ **Mais Fácil**: Troque chaves sem recompilar
✅ **Mais Escalável**: Múltiplas chaves por tipo
✅ **Auditável**: Histórico de criação/atualização

---

**Próximo passo:** Execute o SQL acima! 🚀
