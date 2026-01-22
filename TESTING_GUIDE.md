# 🧪 Guia de Testes - Features #2 e #4

## ✅ Checklist Antes de Começar

- [ ] Tem acesso ao Supabase dashboard
- [ ] Projeto Next.js pronto para dev (`npm run dev`)
- [ ] Está logado na aplicação
- [ ] Abrir DevTools (F12) para ver console e erros

---

## PASSO 1: EXECUTAR MIGRATION SQL NO SUPABASE

### 1.1 Acesse o Supabase

1. Vá para: https://supabase.com/dashboard
2. Clique em seu projeto (ex: "AppControleDespesas")

### 1.2 Abra o SQL Editor

```
Menu esquerdo → SQL Editor → New Query
```

### 1.3 Cole o SQL Migration

**Abra o arquivo**: `scripts/add_recurring_and_goals.sql`

**Selecione TODO** o conteúdo (Ctrl+A)

**Copie** (Ctrl+C)

**No editor do Supabase**:
- Clique na janela vazia
- Cole (Ctrl+V)

Você verá algo assim:
```sql
-- Tabela para gastos recorrentes (assinaturas, contas periódicas)
CREATE TABLE IF NOT EXISTS recurring_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
```

### 1.4 Execute a Query

Pressione: **Ctrl+Enter** (ou clique no botão "Run")

Aguarde o resultado. Você deve ver:
```
✅ Success. No rows returned.
```

### 1.5 Confirme as Tabelas (Opcional)

Vá para: **Table Editor** (menu esquerdo)

Procure por:
- [ ] `recurring_expenses` - deve estar lá com os campos
- [ ] `financial_goals` - deve estar lá com os campos

Se vir as 2 tabelas, você está pronto! ✅

---

## PASSO 2: INICIAR O DEV SERVER

### 2.1 Terminal

```bash
cd c:\Users\juansilva\Documents\GitHub\AppControleDespesas
npm run dev
```

Aguarde até ver:
```
✓ Ready in 2.3s

  ▲ Next.js 15.5.9
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.3s
```

### 2.2 Abra o Navegador

Vá para: `http://localhost:3000/dashboard`

Você deve ver:
- Seu nome no topo (ex: "Bem-vindo, Juan!")
- Stat Cards (Receitas, Despesas, Saldo)
- Gráfico
- **NOVO**: Seção "💰 Gastos Recorrentes"
- **NOVO**: Seção "🏆 Metas Financeiras"

Se vir as 2 novas seções, está funcionando! ✅

---

## PASSO 3: TESTAR FEATURE #2 - GASTOS RECORRENTES

### 3.1 Abra o Formulário

Na seção **"💰 Gastos Recorrentes"**, clique no botão:
```
➕ Adicionar Gasto Recorrente
```

Você verá um formulário aparecer com campos:
- [ ] Descrição
- [ ] Valor (R$)
- [ ] Categoria
- [ ] Frequência
- [ ] Próxima cobrança
- [ ] Notas (opcional)

### 3.2 Preencha os Dados

Exemplo de teste #1 - Netflix:

| Campo | Valor |
|-------|-------|
| Descrição | Netflix |
| Valor | 29.90 |
| Categoria | Streaming |
| Frequência | Mensal |
| Próxima cobrança | 2025-02-15 |
| Notas | (deixe em branco) |

### 3.3 Envie o Formulário

Clique no botão azul: **"Adicionar"**

Você verá:
1. O botão ficar com carregamento (spinner)
2. O formulário desaparecer
3. **UMA LINHA NOVA** aparecer na lista abaixo com:
   - 🎬 Netflix | R$ 29.90 | Mensal | Data
   - Botão 🗑️ para deletar

✅ **Sucesso se conseguir ver o item na lista!**

### 3.4 Teste #2 - Adicione Mais um

Clique novamente em "➕ Adicionar Gasto Recorrente" e adicione:

| Campo | Valor |
|-------|-------|
| Descrição | Seguro Do Carro |
| Valor | 150.00 |
| Categoria | Seguros |
| Frequência | Mensal |
| Próxima cobrança | 2025-02-20 |

Após adicionar, você deve ter **2 itens** na lista.

### 3.5 Verifique o Total Mensal

Procure pela seção **"📊 Resumo"** que mostra:

```
TOTAL MENSAL: R$ 179.90
```

(29.90 + 150.00 = 179.90)

✅ **Sucesso se o total está correto!**

### 3.6 Teste Deleção

No item Netflix, clique no botão **🗑️ Trash**

Uma janela de confirmação aparecerá:
```
Tem certeza?
```

Clique em **"OK"**

O item Netflix desaparece da lista.

Total Mensal agora deve ser: **R$ 150.00** ✅

### 3.7 Teste Frequências

Adicione gastos com diferentes frequências:

| Descrição | Valor | Frequência | Resultado |
|-----------|-------|-----------|-----------|
| Jornal | 5.00 | Diária | Não conta no total mensal |
| Café | 10.00 | Semanal | Não conta no total mensal |
| Internet | 100.00 | Mensal | ✅ Conta |
| IPTU | 200.00 | Trimestral | Não conta |
| Seguro | 50.00 | Anual | Não conta |

Total Mensal esperado: **R$ 100.00**

(Só gasto "Mensal" é contado)

---

## PASSO 4: TESTAR FEATURE #4 - METAS FINANCEIRAS

### 4.1 Abra o Formulário

Na seção **"🏆 Metas Financeiras"**, clique no botão:
```
➕ Adicionar Meta
```

Você verá um formulário com campos:
- [ ] Nome da meta
- [ ] Valor alvo (R$)
- [ ] Tipo de meta
- [ ] Data alvo
- [ ] Descrição (opcional)

### 4.2 Preencha os Dados - Meta #1

Vamos criar uma meta de **Viagem**:

| Campo | Valor |
|-------|-------|
| Nome | Viagem para Paris |
| Valor alvo | 10000.00 |
| Tipo | Viagem (✈️) |
| Data alvo | 2025-12-31 |
| Descrição | Férias com a família em Paris |

### 4.3 Envie o Formulário

Clique em: **"Criar Meta"**

Você verá um **CARD** aparecer com:

```
┌─────────────────────────────┐
│ ✈️                          │
│ Viagem para Paris           │
│ [████░░░░░░░░░░░░░░] 0%    │
│ R$ 0.00 / R$ 10000.00       │
│ Faltam 320 dias             │
│ [─────────────────────────] │
│   Slider para ajustar ↕     │
└─────────────────────────────┘
```

✅ **Sucesso se o card aparecer!**

### 4.4 Atualize o Progresso com Slider

No slider dentro do card, **arraste para a direita** para aumentar o valor economizado.

Tente deixar em **R$ 5000.00** (50%)

Você verá em tempo real:
- A barra de progresso ficar pela metade 📊
- O percentual mudar para **50%**
- O valor mudar para **R$ 5000.00 / R$ 10000.00**

✅ **Sucesso se atualizar em tempo real!**

### 4.5 Teste Mais Tipos de Metas

Crie outras metas com tipos diferentes:

#### Meta #2 - Fundo de Emergência
| Campo | Valor |
|-------|-------|
| Nome | Fundo de Emergência 6 meses |
| Valor alvo | 5000.00 |
| Tipo | Fundo de Emergência (🛡️) |
| Data alvo | 2025-06-30 |
| Descrição | 6 meses de salário guardado |

Atualize para **R$ 2000.00** no slider

#### Meta #3 - Investimento
| Campo | Valor |
|-------|-------|
| Nome | Investimento em Ações |
| Valor alvo | 20000.00 |
| Tipo | Investimento (📈) |
| Data alvo | 2026-12-31 |

Deixe em 0

Após adicionar as 3 metas, você verá **3 cards** em grid:

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ ✈️ Paris │ │ 🛡️ Fundo│ │ 📈 Ações │
│ 50%      │ │ 40%      │ │ 0%       │
└──────────┘ └──────────┘ └──────────┘
```

✅ **Sucesso se todos aparecerem!**

### 4.6 Teste Deleção de Meta

No card de alguma meta, procure o botão **🗑️** no canto superior direito.

Clique nele. Confirmação:
```
Tem certeza?
```

Clique em **"OK"**

O card desaparece. ✅

---

## PASSO 5: VERIFICAR CONSOLE PARA ERROS

### 5.1 Abra DevTools

Pressione: **F12**

Vá para a aba: **Console**

### 5.2 Procure por Erros Vermelhos

Você **NÃO** deve ver mensagens de erro assim:

```
❌ Error loading recurring expenses: TypeError: Cannot read property 'data' of undefined
❌ RLS policy violation
❌ undefined is not a function
```

Se houver erro vermelho, anote e verifique:
1. SQL migration foi executado? (Verifique tabelas no Supabase)
2. Está logado? (Veja no canto superior)
3. Dev server reiniciado? (`npm run dev`)

### 5.3 Mensagens Normais

Você pode ver logs informativos (azuis) como:
```
✓ Loaded 2 recurring expenses
✓ Added new goal
```

Isso é normal! ✅

---

## PASSO 6: TESTE RESPONSIVIDADE (MOBILE)

### 6.1 Redimensione a Janela

No DevTools, clique no ícone de celular 📱 para mode responsivo.

Escolha tamanhos:
- iPhone 12 (390x844)
- iPad (768x1024)
- Desktop (1920x1080)

### 6.2 Verifique Layout

- [ ] **Desktop (1920px)**: 2 componentes lado-a-lado
- [ ] **Tablet (768px)**: 1 componente empilhado
- [ ] **Mobile (390px)**: Stack vertical, tudo responsivo

Se os componentes se reorganizarem corretamente, está bom! ✅

---

## PASSO 7: TESTE PERSISTÊNCIA DE DADOS

### 7.1 Recarregue a Página

Pressione: **F5** ou **Ctrl+R**

Aguarde a página carregar.

### 7.2 Verifique se os Dados Permaneceram

Os gastos recorrentes e metas que você criou devem estar lá!

Se desaparecerem, significa que não foram salvos no Supabase.

✅ **Sucesso se dados persistem após reload!**

---

## 🐛 TROUBLESHOOTING

### Problema: "Componentes não aparecem no Dashboard"

**Solução**:
1. Verifique se Dashboard.tsx foi modificado corretamente
2. Reinicie dev server: `npm run dev`
3. Limpe cache: `Ctrl+Shift+Delete` no navegador

---

### Problema: "Erro ao adicionar gasto recorrente"

**Solução**:
1. Abra DevTools (F12) e veja a mensagem de erro completa
2. Confirme que SQL migration foi executada (veja tabelas no Supabase)
3. Verifique se está logado (veja nome no topo)

---

### Problema: "Valores não atualizam no slider"

**Solução**:
1. Verifique se `handleUpdateProgress` foi definido corretamente
2. Confirme que função `updateFinancialGoal` existe em `lib/database.ts`
3. Limpe cache do navegador e tente novamente

---

### Problema: "RLS policy violation"

**Mensagem típica**:
```
Error: new row violates row-level security policy for table "recurring_expenses"
```

**Solução**:
1. Confirme que está logado com um usuário
2. Verifique que RLS policies foram criadas no SQL (veja em Supabase > Policies)
3. Certifique-se que o user_id está sendo passado corretamente

---

## ✅ CHECKLIST FINAL

Quando tudo funcionar, você deve conseguir:

- [ ] Ver 2 novas seções no Dashboard
- [ ] Adicionar gasto recorrente com sucesso
- [ ] Ver lista de gastos atualizar
- [ ] Deletar gasto sem erro
- [ ] Calcular total mensal automaticamente
- [ ] Adicionar meta financeira
- [ ] Arrastar slider para atualizar progresso
- [ ] Ver % de progresso mudar em tempo real
- [ ] Deletar meta
- [ ] Recarregar página e dados persistirem
- [ ] Nenhum erro vermelho no console
- [ ] Layout responsivo em mobile

Se tudo marcar ✅, as features estão **100% funcionais**! 🎉

---

## 📊 Dados de Teste Recomendados

Para ter uma boa experiência visual, crie:

**Gastos Recorrentes:**
- Netflix - R$ 29.90 - Mensal
- Spotify - R$ 9.90 - Mensal
- Seguro Carro - R$ 150.00 - Mensal
- Academia - R$ 80.00 - Mensal

**Total Mensal: R$ 269.80**

**Metas Financeiras:**
- Viagem para Paris - R$ 10000 - (Atualize para 50%)
- Fundo Emergência - R$ 5000 - (Atualize para 30%)
- Pagar Dívida - R$ 3000 - (Deixe em 10%)

Isso dará uma visão completa das features!

---

## 🎉 Próximas Steps (Após Testes Passarem)

1. ✅ Testes completos nas features
2. Deploy para staging (opcional)
3. Adicionar notificações de próximas cobranças
4. Iniciar Feature #3 (Insights "Humanos")

---

**Boa sorte com os testes! 🚀**

