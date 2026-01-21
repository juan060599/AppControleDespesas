# 🔧 Guia de Configuração Supabase

## Pré-requisitos

- Conta Supabase (crie em https://supabase.com)
- Projeto Supabase criado
- Acesso ao Supabase Dashboard

## 📋 Passos de Configuração

### 1. Acessar o Supabase Dashboard

1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login com sua conta
3. Selecione seu projeto

### 2. Configurar SQL Editor

1. No painel lateral esquerdo, clique em **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo do arquivo `scripts/setup_database.sql`
4. Clique em **Run** ou pressione Ctrl+Enter

### 3. Verificar Tabelas Criadas

1. Vá para **Table Editor** no painel lateral
2. Verifique se as tabelas foram criadas:
   - `transactions`
   - `budgets`
3. Confirme que as colunas estão corretas

### 4. Habilitar Autenticação

1. Vá para **Authentication** > **Providers**
2. Certifique-se de que **Email** está habilitado
3. Vá para **Authentication** > **Email Templates**
4. Configure os templates de email (opcional)

### 5. Configurar Políticas de RLS

As políticas já estão criadas pelo script SQL, mas você pode verificar:

1. Vá para **Authentication** > **Policies**
2. Selecione a tabela `transactions`
3. Verifique que as 4 políticas existem:
   - Select: Usuários podem ver suas próprias transações
   - Insert: Usuários podem inserir suas próprias transações
   - Update: Usuários podem atualizar suas próprias transações
   - Delete: Usuários podem deletar suas próprias transações

### 6. Obter Credenciais

1. Vá para **Settings** > **API**
2. Copie:
   - **Project URL** (será `NEXT_PUBLIC_SUPABASE_URL`)
   - **Project API Keys > Public key** (será `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`)
   - **Project API Keys > Service Role Key** (será `SUPABASE_SERVICE_ROLE_KEY`)

3. Cole essas credenciais no arquivo `.env.local`

## ✅ Checklist de Configuração

- [ ] Projeto Supabase criado
- [ ] Script SQL executado
- [ ] Tabelas `transactions` e `budgets` criadas
- [ ] RLS habilitado nas tabelas
- [ ] Políticas de RLS configuradas
- [ ] Autenticação de Email habilitada
- [ ] Credenciais copiadas para `.env.local`
- [ ] Arquivo `.env.local` atualizado

## 🔐 Segurança

### Row Level Security (RLS)

O RLS garante que:
- Cada usuário só pode ver suas próprias transações
- Um usuário não pode acessar dados de outro usuário
- Mesmo com acesso direto ao banco de dados, os dados estão protegidos

### Chaves de API

- **Chave Pública (anon key)**: Usada no frontend, segura
- **Chave de Serviço**: Use apenas no backend, NUNCA exponha no frontend

## 📊 Estrutura das Tabelas

### Tabela: transactions
```sql
id              UUID PRIMARY KEY
user_id         UUID (referência ao usuário autenticado)
description     TEXT (descrição da transação)
amount          NUMERIC (valor)
type            TEXT (income ou expense)
category        TEXT (categoria)
date            DATE (data da transação)
created_at      TIMESTAMP (data de criação)
updated_at      TIMESTAMP (data de atualização)
```

### Tabela: budgets
```sql
id              UUID PRIMARY KEY
user_id         UUID (referência ao usuário autenticado)
category        TEXT (categoria)
limit           NUMERIC (limite de orçamento)
month           TEXT (mês no formato YYYY-MM)
created_at      TIMESTAMP (data de criação)
updated_at      TIMESTAMP (data de atualização)
```

## 🆘 Troubleshooting

### Erro: "Relation 'transactions' does not exist"
**Solução:** Execute o script SQL novamente. Verifique se não há erros.

### Erro: "User does not have permission"
**Solução:** Confirme que RLS está habilitado e as políticas estão corretas.

### Usuário não consegue inserir dados
**Solução:** Verifique a política INSERT da tabela - certifique-se de que `auth.uid() = user_id`

### Dados de outro usuário aparecem
**Solução:** Isso não deveria acontecer! Verifique as políticas RLS imediatamente.

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Referência SQL](https://supabase.com/docs/guides/database/sql)

## 🚀 Próximas Otimizações

1. **Backup Automático**: Configure backups no Supabase
2. **Replicação**: Para produção, considere replicação
3. **Monitoramento**: Configure alertas para uso de API

---

Se encontrar problemas, consulte a documentação oficial do Supabase ou abra uma issue.
