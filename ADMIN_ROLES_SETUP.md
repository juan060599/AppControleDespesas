# 👑 Sistema de Roles (Admin/Cliente) - Setup Completo

## ✅ O que foi implementado

### 1. **Chave Gemini Fixa no Banco**
- Sua chave `AIzaSyCYoVkXUxz_BHdqvu6vwTrV_j7S0qY3Z6M` está armazenada no banco de dados
- Todos os usuários usarão a mesma chave para análise de extratos
- Você pode cobrar pelo plano mensal com análises limitadas

### 2. **Sistema de Roles (Admin/Cliente)**
- Tabela `user_roles` criada para gerenciar permissões
- Funções no banco: `get_user_role()` e `is_admin()`
- Endpoints para atualizar roles de usuários

### 3. **Painel Admin Protegido**
- Componente `ApiKeySettings` agora só aparece para admins
- Novo componente `AdminPanel` para gerenciar usuários
- Página de Settings mostra tipo de usuário

### 4. **Proteção de Rotas**
- `/api/set-user-role` - protege atribuição de roles
- Componentes verificam permissões antes de renderizar

---

## 🚀 Próximas Ações (OBRIGATÓRIO)

### Passo 1: Executar Script SQL de Roles

No Supabase SQL Editor, execute:

```sql
-- Script para adicionar sistema de roles (Admin/Cliente)

-- Criar tabela de perfil de usuários
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Adicionar função para obter role do usuário
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  SELECT role INTO role FROM user_roles WHERE user_id = $1;
  RETURN COALESCE(role, 'cliente');
END;
$$ LANGUAGE plpgsql;

-- Adicionar função para verificar se é admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM user_roles WHERE user_id = $1) = 'admin';
END;
$$ LANGUAGE plpgsql;
```

### Passo 2: Executar Script SQL de Chaves (Se ainda não fez)

```sql
-- Atualizar tabela de API Keys com sua chave Gemini

-- Atualizar a chave Gemini com seu valor
UPDATE api_keys 
SET key_value = 'AIzaSyCYoVkXUxz_BHdqvu6vwTrV_j7S0qY3Z6M'
WHERE key_name = 'GEMINI_API_KEY';

-- Se não existir, inserir
INSERT INTO api_keys (key_name, key_value, description)
VALUES 
  ('GEMINI_API_KEY', 'AIzaSyCYoVkXUxz_BHdqvu6vwTrV_j7S0qY3Z6M', 'Google Gemini API Key - Chave principal')
ON CONFLICT (key_name) DO UPDATE SET key_value = 'AIzaSyCYoVkXUxz_BHdqvu6vwTrV_j7S0qY3Z6M';
```

### Passo 3: Promover Você a Administrador

1. Pegue seu **UUID de usuário** em `/settings` (Informações da Conta)
2. Vá para o **Painel Admin** (você já verá se tiver a tabela criada)
3. Cole seu UUID no campo "ID do Usuário"
4. Selecione "👑 Administrador"
5. Clique "Atualizar Role"

**OU** execute diretamente no SQL (substitua UUID):

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('seu-uuid-aqui', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

---

## 📋 O que Muda no App

### Para Administradores (Você)
✅ Vê a seção **🔑 Chave Google Gemini API** em Settings
✅ Vê o **👑 Painel Admin** para gerenciar usuários
✅ Pode promover outros usuários a admin ou regredir para cliente

### Para Clientes (Seus Usuários)
❌ NÃO veem a seção de chaves de API
❌ NÃO veem o Painel Admin
✅ Veem seu tipo de usuário em Settings
✅ Usam a chave Gemini do servidor para análises
✅ Limitados a 2 testes grátis por mês (no plano Free)

---

## 🔐 Como Funciona a Segurança

### Antes (Inseguro)
```
Cliente pede upgrade → Página Settings → Input de chave → localStorage
                                          ↓
                                    Chave exposta!
```

### Depois (Seguro)
```
Cliente pede upgrade → Página Settings → NÃO vê input de chave
                                          ↓
                                    Admin configura em Settings
                                          ↓
                                    Chave armazenada no banco
                                          ↓
                                    API usa chave do servidor
                                          ↓
                                    Cliente não vê a chave!
```

---

## 💰 Modelo de Monetização

### Plano Free (Padrão)
- 2 testes grátis por mês
- Usa a chave Gemini do servidor (sua chave)
- Usuário não paga

### Plano Pro (R$ 19,90/mês)
- Análises ilimitadas no mês
- Mesmo usa a chave do servidor
- **Você recebe pagamento via Stripe**

---

## 📊 Arquivos Atualizados

```
✅ lib/database.ts
   ├─ Adicionadas funções: getUserRole, isUserAdmin, setUserRole, getAllUsers
   └─ Interface User agora inclui role

✅ lib/designSystem.ts
   └─ Adicionado background.default

✅ app/settings/page.tsx
   ├─ Importa AdminPanel
   ├─ Verifica userRole com getUserRole()
   ├─ Mostra ApiKeySettings só para admins
   └─ Mostra AdminPanel só para admins

✅ components/ApiKeySettings.tsx
   ├─ Verifica isUserAdmin() no useEffect
   ├─ Mostra lock icon se não for admin
   └─ Retorna early se não for admin

✅ components/AdminPanel.tsx (Novo)
   ├─ Interface para gerenciar usuários
   ├─ Input de UUID + seleção de role
   ├─ Chama /api/set-user-role
   └─ Mostra próximas etapas

✅ app/api/set-user-role/route.ts (Novo)
   ├─ POST /api/set-user-role
   ├─ Valida userId e role
   └─ Chama setUserRole() do banco

✅ scripts/setup_user_roles.sql (Novo)
   ├─ Cria tabela user_roles
   ├─ Cria índice
   └─ Cria funções SQL get_user_role e is_admin

✅ scripts/setup_api_keys.sql (Atualizado)
   └─ Gemini key agora tem valor: AIzaSyCYoVkXUxz_BHdqvu6vwTrV_j7S0qY3Z6M
```

---

## 🧪 Testando o Sistema

### Teste 1: Admin vê configurações
1. Login com sua conta
2. Vá para `/settings`
3. Deve ver **"🔑 Chave Google Gemini API"**
4. Deve ver **"👑 Painel Admin"**

### Teste 2: Cliente não vê configurações
1. Crie nova conta
2. Deixe como cliente (padrão)
3. Vá para `/settings`
4. NÃO deve ver seção de chaves
5. NÃO deve ver painel admin

### Teste 3: Promover cliente a admin
1. Vá para `/settings` com sua conta (admin)
2. Vá ao Painel Admin
3. Cole UUID de outro usuário
4. Clique "Atualizar Role" para "Administrador"
5. O outro usuário deve ver configurações agora

### Teste 4: Análises funcionam para ambos
1. Cliente faz upload de extrato
2. Usa sua chave Gemini automaticamente
3. Admin também faz upload
4. Usa mesma chave Gemini

---

## 🐛 Troubleshooting

**"Não vejo o Painel Admin"**
→ Você precisa rodar o script SQL para criar a tabela user_roles
→ Depois promova você mesmo a admin

**"Erro ao atualizar role"**
→ Verifique se a tabela user_roles foi criada
→ Verifique se o UUID está correto

**"Não consigo ver a seção de chaves"**
→ Você não é admin ainda
→ Peça para outro admin (ou rode SQL direto) promover você

**"Análises não funcionam"**
→ Chave Gemini pode estar vazia no banco
→ Execute: `SELECT * FROM api_keys WHERE key_name = 'GEMINI_API_KEY'`
→ Verifique se tem o valor correto

---

## ✨ Benefícios

✅ **Segurança**: Chaves nunca são vistas por clientes
✅ **Monetização**: Você controla quantas análises cada plano tem
✅ **Escalabilidade**: Pode adicionar mais chaves ou admins facilmente
✅ **Profissional**: Sistema robusto de gerenciamento de usuários

---

**Pronto! Seu app agora tem um sistema profissional de roles. 🎉**

Próximos passos:
1. ✅ Execute o SQL em Supabase
2. ✅ Promova-se a admin
3. ✅ Teste com múltiplos usuários
4. ✅ Configure sua estratégia de monetização
