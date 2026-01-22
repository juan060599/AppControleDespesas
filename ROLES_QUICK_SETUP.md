# 🚀 Sistema de Roles - Próximas Ações

## ✅ O que foi implementado
- ✅ Sua chave Gemini: `AIzaSyCYoVkXUxz_BHdqvu6vwTrV_j7S0qY3Z6M` 
- ✅ Sistema de roles (Admin/Cliente)
- ✅ Painel Admin protegido
- ✅ ApiKeySettings visível apenas para admins

---

## 🎯 Execute Agora No Supabase

### Script 1: Adicionar Chaves de API
```sql
-- Criar tabela de chaves
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
  ('STRIPE_PUBLIC_KEY', 'pk_test_51Ss1eKKMF5dTadBUtJhH3LluwFOSDsQvLCVCqCYJp0PsrD6h35ygx48AR2Vvd8jmgVYWhVV0DWMBd8lOcjCm3ORP00KvmKBT3D', 'Stripe Key'),
  ('STRIPE_SECRET_KEY', 'sk_test_51Ss1eKKMF5dTadBUKXWhhY27XgDZ9BXNZ0pF6OAw6wjtSo9kZI1f8V8X0K70mf86SMUh4L4UA39AebODJkMQX7Cs00ZhHQlkhw', 'Stripe Secret'),
  ('GEMINI_API_KEY', 'AIzaSyCYoVkXUxz_BHdqvu6vwTrV_j7S0qY3Z6M', 'Gemini API')
ON CONFLICT (key_name) DO NOTHING;
```

### Script 2: Adicionar Sistema de Roles
```sql
-- Criar tabela de roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  SELECT role INTO role FROM user_roles WHERE user_id = $1;
  RETURN COALESCE(role, 'cliente');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM user_roles WHERE user_id = $1) = 'admin';
END;
$$ LANGUAGE plpgsql;
```

---

## 👑 Promover Você a Admin

**Opção 1: Via Painel (Após rodar os Scripts)**
1. Login em http://localhost:3000
2. Vá para `/settings`
3. Vá ao **Painel Admin**
4. Cole seu UUID (está em "ID do Usuário")
5. Selecione "👑 Administrador"
6. Clique "Atualizar Role"

**Opção 2: SQL Direto**
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('seu-uuid-aqui', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

---

## ✨ Arquivos Atualizados

| Arquivo | Mudança |
|---------|---------|
| `scripts/setup_api_keys.sql` | Gemini key preenchida ✅ |
| `scripts/setup_user_roles.sql` | Novo - Sistema de roles ✅ |
| `lib/database.ts` | +getUserRole, isUserAdmin, setUserRole ✅ |
| `lib/designSystem.ts` | +background.default ✅ |
| `app/settings/page.tsx` | Mostra AdminPanel só p/ admins ✅ |
| `components/ApiKeySettings.tsx` | Protegido p/ admins ✅ |
| `components/AdminPanel.tsx` | Novo - Gerenciar usuários ✅ |
| `app/api/set-user-role/route.ts` | Novo - Endpoint de roles ✅ |

---

## 💰 Como Monetizar

**Plano Free**
- 5 análises/mês (automático)
- Usa sua chave Gemini
- Sem custo

**Plano Pro**  
- Análises ilimitadas
- R$ 19,90/mês via Stripe
- Você recebe o pagamento

---

**Servidor está rodando! Próximo passo: Execute os scripts SQL acima. 🚀**
