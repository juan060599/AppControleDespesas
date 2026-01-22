# 🎬 PASSO A PASSO VISUAL - Configuração e Uso

## 📍 Pré-requisitos

- [x] Node.js 18+ instalado
- [x] Projeto FinControl rodando (`npm run dev`)
- [x] Conta no OpenAI (https://openai.com)
- [x] Um arquivo CSV/OFX/PDF do seu banco

---

## 🔑 PASSO 1: Obter API Key OpenAI

### 1.1 Acesse OpenAI

```
Abra navegador:
https://platform.openai.com/api/keys
```

**Visual**:
```
┌────────────────────────────────────────┐
│ OpenAI Platform - API Keys             │
├────────────────────────────────────────┤
│                                         │
│ 🔓 Login (se necessário)               │
│    Email: seu-email@exemplo.com        │
│    Senha: ••••••••••                   │
│    [Entrar]                             │
│                                         │
│ ✅ Autenticado!                         │
└────────────────────────────────────────┘
```

### 1.2 Crie Nova Chave

```
Clique em: "Create new secret key"
```

**Visual**:
```
┌────────────────────────────────────────┐
│ API Keys                               │
│                                         │
│ [Create new secret key] ← Clique aqui  │
│                                         │
│ Recent keys:                            │
│ • sk-proj-abc123... created 1 month ago│
│ • sk-proj-def456... created 2 months.. │
└────────────────────────────────────────┘
```

### 1.3 Copie a Chave

```
Uma popup vai aparecer com sua chave:
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

⚠️ IMPORTANTE: Copie AGORA!
   (Só aparece uma vez)
```

**Visual**:
```
┌────────────────────────────────────────┐
│ ⚠️ Copy your API Key                    │
├────────────────────────────────────────┤
│                                         │
│ ╔════════════════════════════════════╗ │
│ ║ sk-proj-...                        ║ │
│ ╚════════════════════════════════════╝ │
│                                         │
│ [Copy] ← Clique                       │
│                                         │
│ [ ] I have saved this key safely      │
│ [Confirm] [Done]                       │
└────────────────────────────────────────┘
```

---

## ⚙️ PASSO 2: Configurar Arquivo `.env.local`

### 2.1 Localize o Arquivo

```
Caminho:
C:\Users\juansilva\Documents\GitHub\AppControleDespesas\.env.local

No VS Code:
Abra a pasta do projeto
Pressione: Ctrl+K Ctrl+O (abrir pasta)
Selecione: AppControleDespesas
Procure arquivo: .env.local
```

**Visual**:
```
VS Code
├── AppControleDespesas/
│   ├── .env.local           ← Abra este arquivo
│   ├── .env.local.example
│   ├── components/
│   ├── app/
│   ├── lib/
│   └── ...
```

### 2.2 Edite o Arquivo

```
Abra .env.local
Procure por OPENAI_API_KEY (se existir)
Ou adicione no final:

OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

**Visual**:
```
.env.local

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...

OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxx
                ↑ Cole aqui sua chave (sem aspas)
```

### 2.3 Salve o Arquivo

```
Pressione: Ctrl+S
Ou: Arquivo → Salvar
```

---

## 🔄 PASSO 3: Reiniciar Servidor

### 3.1 Abra Terminal

```
No VS Code:
Pressione: Ctrl+J (ou Ctrl+`)
Ou: Terminal → New Terminal
```

**Visual**:
```
┌─────────────────────────────┐
│ VS Code                     │
├──────────────────┬──────────┤
│ Editor           │ Terminal │ ← Aqui
│                  │          │
│ .env.local       │ PS C:\..>│
│                  │>         │
└──────────────────┴──────────┘
```

### 3.2 Parar Servidor Atual

```
No terminal, pressione:
Ctrl+C
```

**Visual**:
```
> npm run dev
✓ Ready in 5.2s
- Local: http://localhost:3001

^C
PS C:\Users\...\AppControleDespesas>
```

### 3.3 Reiniciar Servidor

```
Type:
npm run dev

E pressione: Enter
```

**Visual**:
```
PS C:\Users\...\AppControleDespesas> npm run dev

> app-controle-despesas@0.1.0 dev
> next dev

  ▲ Next.js
  - Local: http://localhost:3001
  ✓ Compiled successfully
```

Aguarde:
```
✓ Ready in X.Xs
```

---

## 🧪 PASSO 4: Testar Sistema

### 4.1 Acesse Dashboard

```
Abra navegador:
http://localhost:3001/dashboard

Se pedir login:
Email: seu-email@supabase.com
Senha: sua-senha
```

**Visual**:
```
┌─────────────────────────────────────────────┐
│ FinControl Dashboard          [Seu Nome] [Sair]
├─────────────────────────────────────────────┤
│                                             │
│ [Stats Cards] [Gráficos]   [Form Lateral]  │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 📤 Importar Extrato Bancário ← AQUI!   │ │
│ │ IA analisa e lança automaticamente     │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Transações Recentes]                       │
│                                             │
└─────────────────────────────────────────────┘
```

### 4.2 Procure Componente de Upload

```
Procure por:
"Importar Extrato Bancário"
ou
"📤" (ícone de upload)
```

**Visual**:
```
┌──────────────────────────────────────────┐
│ 📤 IMPORTAR EXTRATO BANCÁRIO              │
│ IA analisa e lança automaticamente        │
├──────────────────────────────────────────┤
│                                           │
│  Arraste arquivo ou clique para selecionar
│  CSV, OFX ou PDF do seu banco             │
│                                           │
│  [Analisar com IA] [Limpar]              │
│                                           │
└──────────────────────────────────────────┘
```

### 4.3 Upload de Arquivo

```
Opção 1: Clicar
  → Clique no retângulo
  → Selecione arquivo CSV
  → Aguarde carregamento

Opção 2: Arrastar
  → Arraste arquivo para a caixa
  → Soltará para upload
```

**Visual**:
```
Antes:
┌──────────────────────────────┐
│ 📎 Arrastar ou clicar         │
│ CSV, OFX ou PDF do seu banco  │
└──────────────────────────────┘

Durante o hover (arrastar):
┌──────────────────────────────┐
│ 📎 Solte o arquivo aqui! ▼    │ ← Mudou cor
│ CSV, OFX ou PDF do seu banco  │
└──────────────────────────────┘

Depois (arquivo carregado):
┌──────────────────────────────┐
│ 📄 extrato_banco.csv          │
│ [Analisar com IA] [Limpar]   │
└──────────────────────────────┘
```

### 4.4 Analisar com IA

```
Clique em:
"Analisar com IA"

Aguarde 5-10 segundos...
```

**Visual**:
```
Carregando:
[Analisar com IA] ← Mudou para:
[🔄 Analisando...] (botão desabilitado)

Progresso:
- Lendo arquivo...
- Enviando para IA...
- Processando...
- Extraindo transações...

Sucesso:
✅ 50 transações encontradas!
```

### 4.5 Revisar Transações

```
Sistema mostra:
  ☑ Selecionar Tudo
  
  ☑ 15/01 | Supermercado ABC
    Alimentação | -R$ 250,50
    
  ☑ 16/01 | Salário Janeiro
    Salário | +R$ 3.000,00
    
  ... (mais transações)

Revise:
  ✓ Categorias corretas?
  ✓ Valores certos?
  ✓ Duplicatas?
  → Desselecione se erradas
```

**Visual**:
```
┌─────────────────────────────────────────┐
│ ✅ 50 transações encontradas!           │
├─────────────────────────────────────────┤
│ ☑ Selecionar Tudo (50)                  │
├─────────────────────────────────────────┤
│ ☑ 15/01 | Supermercado ABC              │
│    Alimentação | -R$ 250,50              │
│                                          │
│ ☑ 16/01 | Salário Janeiro               │
│    Salário | +R$ 3.000,00                │
│                                          │
│ ☑ 17/01 | Conta de Água                 │
│    Habitação | -R$ 180,00                │
│                                          │
│ ... (47 mais)                            │
├─────────────────────────────────────────┤
│        [Lançar 50 Transações]           │
└─────────────────────────────────────────┘
```

### 4.6 Lançar Transações

```
Clique em:
"Lançar 50 Transações"

(ou número de transações selecionadas)

Aguarde 2-3 segundos...
```

**Visual**:
```
Enviando:
[Lançar 50 Transações] → [🔄 Inserindo...]

Progresso:
- Validando dados...
- Conectando banco de dados...
- Inserindo transações...
- Atualizando dashboard...

Sucesso:
┌──────────────────────────────┐
│ ✅ Sucesso! 50 transações    │
│ inseridas com sucesso!       │
│                              │
│ Dashboard atualizado em      │
│ tempo real...                │
│                              │
│ [Aguardando redireção...]   │
└──────────────────────────────┘
```

### 4.7 Verificar Resultado

```
Dashboard atualiza automaticamente:

Stats Cards:
  ✓ Receita Total (aumentou)
  ✓ Despesa Total (aumentou)
  ✓ Saldo (atualizado)

Gráficos:
  ✓ Despesas por Categoria (novos dados)
  ✓ Receitas vs Despesas (atualizado)
  ✓ Tendência Mensal (novos dados)

Transações:
  ✓ Lista mostra as 50 novas transações
  ✓ Pode editar/deletar individualmente
```

**Visual**:
```
ANTES:
─────────────────────────────
Receita:    R$ 3.000,00
Despesa:    -R$ 500,00
Saldo:      +R$ 2.500,00
─────────────────────────────

DEPOIS:
─────────────────────────────
Receita:    R$ 6.500,00 ↑ (+3.500)
Despesa:    -R$ 1.216,30 ↑ (-716,30)
Saldo:      +R$ 5.283,70 ↑ (+2.783,70)
─────────────────────────────
```

---

## ✅ Pronto!

Parabéns! 🎉 Seu sistema de análise de extratos está funcionando!

### Agora você pode:

1. **Semanal**: Upload de novos extratos
2. **Rápido**: Análise automática (30 segundos)
3. **Preciso**: Categorização inteligente
4. **Fácil**: Revisão antes de lançar
5. **Rastreado**: Tudo no dashboard

### Próximas Semanas:

- Importe seus históricos anteriores
- Ajuste categorias conforme necessário
- Use o sistema regularmente
- Aproveite as análises do dashboard!

---

## 🆘 Se Algo Não Funcionar

### Erro: API Key não reconhecida
```
1. Verifique .env.local tem OPENAI_API_KEY
2. Nenhum espaço extra antes/depois
3. Reinicie servidor: npm run dev
```

### Erro: Nenhuma transação encontrada
```
1. Arquivo CSV tem dados reais?
2. Tente converter para outro formato
3. Valide se é CSV, OFX ou PDF
```

### Erro: 401 Unauthorized
```
1. API key expirou?
2. Gere nova em platform.openai.com
3. Atualize .env.local
4. Reinicie servidor
```

---

## 📚 Documentação Completa

Para mais informações, leia:

1. `QUICK_BANK_IMPORT_GUIDE.md` - Guia rápido
2. `BANK_IMPORT_SETUP.md` - Setup detalhado
3. `BANK_IMPORT_SUMMARY.md` - Arquitetura
4. `README_BANK_IMPORT.md` - Resumo

---

**Pronto para começar?** 🚀

**Próximo passo**: Obtenha sua chave OpenAI e siga os passos acima!
