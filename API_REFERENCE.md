# 🔌 Referência de API

Documentação das funções e APIs disponíveis na aplicação.

## 📦 Funções de Autenticação

### `signUp(email, password, name)`
Cria uma nova conta de usuário.

**Parâmetros:**
- `email` (string): Email do usuário
- `password` (string): Senha (mínimo 6 caracteres)
- `name` (string): Nome do usuário

**Retorno:**
```typescript
{
  data: {
    user: User,
    session: Session
  },
  error: Error | null
}
```

**Exemplo:**
```typescript
const { data, error } = await signUp('user@email.com', 'senha123', 'João Silva')
```

---

### `signIn(email, password)`
Faz login com email e senha.

**Parâmetros:**
- `email` (string): Email registrado
- `password` (string): Senha

**Retorno:**
```typescript
{
  data: {
    user: User,
    session: Session
  },
  error: Error | null
}
```

**Exemplo:**
```typescript
const { data, error } = await signIn('user@email.com', 'senha123')
```

---

### `signOut()`
Faz logout do usuário atual.

**Retorno:**
```typescript
{
  error: Error | null
}
```

**Exemplo:**
```typescript
const { error } = await signOut()
```

---

### `getCurrentUser()`
Retorna o usuário autenticado atual.

**Retorno:**
```typescript
User | undefined
```

**Exemplo:**
```typescript
const user = await getCurrentUser()
```

---

## 💳 Funções de Transações

### `addTransaction(transaction)`
Adiciona uma nova transação.

**Parâmetros:**
```typescript
{
  user_id: string (UUID do usuário)
  description: string (descrição da transação)
  amount: number (valor em reais)
  type: 'income' | 'expense' (tipo)
  category: string (categoria)
  date: string (data em formato YYYY-MM-DD)
}
```

**Retorno:**
```typescript
{
  data: Transaction[],
  error: Error | null
}
```

**Exemplo:**
```typescript
const { data, error } = await addTransaction({
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  description: 'Almoço no restaurante',
  amount: 45.50,
  type: 'expense',
  category: 'Alimentação',
  date: '2024-01-21'
})
```

---

### `getTransactions(userId)`
Obtém todas as transações de um usuário.

**Parâmetros:**
- `userId` (string): UUID do usuário

**Retorno:**
```typescript
{
  data: Transaction[],
  error: Error | null
}
```

**Exemplo:**
```typescript
const { data: transactions, error } = await getTransactions('123e4567-e89b-12d3-a456-426614174000')
```

---

### `updateTransaction(id, updates)`
Atualiza uma transação existente.

**Parâmetros:**
- `id` (string): UUID da transação
- `updates` (object): Campos a atualizar (opcionais)

**Retorno:**
```typescript
{
  data: Transaction[],
  error: Error | null
}
```

**Exemplo:**
```typescript
const { data, error } = await updateTransaction('trans-id-123', {
  description: 'Almoço no outro restaurante',
  amount: 50.00
})
```

---

### `deleteTransaction(id)`
Deleta uma transação.

**Parâmetros:**
- `id` (string): UUID da transação

**Retorno:**
```typescript
{
  error: Error | null
}
```

**Exemplo:**
```typescript
const { error } = await deleteTransaction('trans-id-123')
```

---

## 💰 Funções de Orçamento

### `addBudget(budget)`
Adiciona um novo orçamento (limite de gasto).

**Parâmetros:**
```typescript
{
  user_id: string (UUID do usuário)
  category: string (categoria)
  limit: number (limite em reais)
  month: string (mês em formato YYYY-MM)
}
```

**Retorno:**
```typescript
{
  data: Budget[],
  error: Error | null
}
```

**Exemplo:**
```typescript
const { data, error } = await addBudget({
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  category: 'Alimentação',
  limit: 500.00,
  month: '2024-01'
})
```

---

### `getBudgets(userId)`
Obtém todos os orçamentos de um usuário.

**Parâmetros:**
- `userId` (string): UUID do usuário

**Retorno:**
```typescript
{
  data: Budget[],
  error: Error | null
}
```

---

### `updateBudget(id, updates)`
Atualiza um orçamento.

**Parâmetros:**
- `id` (string): UUID do orçamento
- `updates` (object): Campos a atualizar

**Retorno:**
```typescript
{
  data: Budget[],
  error: Error | null
}
```

---

### `deleteBudget(id)`
Deleta um orçamento.

**Parâmetros:**
- `id` (string): UUID do orçamento

**Retorno:**
```typescript
{
  error: Error | null
}
```

---

## 🎨 Componentes React

### `<Dashboard transactions={transactions} />`
Componente que exibe os gráficos do dashboard.

**Props:**
```typescript
{
  transactions: Transaction[] // Array de transações
}
```

**Gráficos Inclusos:**
- Resumo de receitas, despesas e saldo
- Gráfico de Pizza: Despesas por categoria
- Gráfico de Barras: Receitas vs Despesas
- Gráfico de Linhas: Tendência mensal

---

### `<TransactionForm userId={userId} onSuccess={callback} />`
Formulário para adicionar novas transações.

**Props:**
```typescript
{
  userId: string // UUID do usuário
  onSuccess?: () => void // Callback executado após sucesso
}
```

---

### `<TransactionList transactions={transactions} />`
Lista de transações com opções de editar e deletar.

**Props:**
```typescript
{
  transactions: Transaction[] // Array de transações
}
```

---

### `<SignInForm />`
Formulário de login.

**Funcionalidade:**
- Valida email e senha
- Redireciona para dashboard ao fazer login
- Link para criar conta

---

### `<SignUpForm />`
Formulário de registro.

**Funcionalidade:**
- Valida nome, email e senha
- Cria nova conta no Supabase
- Redireciona para login após sucesso

---

## 📊 Interfaces TypeScript

### `User`
```typescript
{
  id: string
  email: string
  name: string
}
```

### `Transaction`
```typescript
{
  id: string
  user_id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  created_at: string
}
```

### `Budget`
```typescript
{
  id: string
  user_id: string
  category: string
  limit: number
  month: string
  created_at: string
}
```

---

## 🔗 Endpoints

A aplicação não usa endpoints tradicionais. Todos os dados são gerenciados através do cliente Supabase JavaScript.

Para consultas do lado do servidor, use:
```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
```

---

## 🆘 Tratamento de Erros

Todos os retornos incluem um campo `error`. Sempre verifique:

```typescript
const { data, error } = await someFunction()

if (error) {
  console.error('Erro:', error.message)
  // Exiba mensagem de erro ao usuário
} else {
  // Processe os dados com sucesso
  console.log(data)
}
```

---

## 📚 Exemplos de Uso

### Adicionar e Listar Transações
```typescript
// Adicionar
const { data: newTransaction, error } = await addTransaction({
  user_id: user.id,
  description: 'Café da manhã',
  amount: 15.00,
  type: 'expense',
  category: 'Alimentação',
  date: '2024-01-21'
})

// Listar todas
const { data: transactions } = await getTransactions(user.id)

// Filtrar apenas despesas
const expenses = transactions.filter(t => t.type === 'expense')

// Calcular total
const total = expenses.reduce((sum, t) => sum + t.amount, 0)
```

---

## 🚀 Rate Limiting

Supabase oferece:
- **Free tier**: 200,000 requisições/dia
- **Paid tier**: Limites muito maiores

Para produção, implemente cache se necessário.

---

Última atualização: Janeiro 2024
