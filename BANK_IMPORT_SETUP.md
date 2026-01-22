# 🏦 Setup - Análise de Extratos com IA

## 📋 O que é

Um sistema inteligente que permite:
1. **Upload de Extrato** - Carregar arquivo CSV, OFX ou PDF do banco
2. **Análise com IA** - Claude/OpenAI analisa e extrai transações automaticamente
3. **Auto-lançamento** - Insere as transações no FinControl em segundos

---

## 🔑 Configuração - OpenAI API

### 1. Obter Chave API OpenAI

```bash
# Acesse: https://platform.openai.com/api/keys
# Crie uma nova API key
# Copie a chave (só aparece uma vez!)
```

### 2. Configurar `.env.local`

```bash
# Na raiz do projeto, crie/edite .env.local:

OPENAI_API_KEY=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

# Outros (já existentes):
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Instalar dependências (se necessário)

```bash
npm install
```

### 4. Reiniciar servidor

```bash
npm run dev
```

---

## 💰 Custo

- **Modelo**: GPT-4o-mini (muito barato)
- **Custo estimado**: ~$0.01 por extrato com 50 transações
- **Free tier**: $5 de crédito inicial (OpenAI)

---

## 📁 Formatos Suportados

### CSV (Bradesco, Itaú, BB, etc.)

```csv
Data,Descrição,Débito,Crédito
15/01/2024,Compra mercado,150.00,
16/01/2024,Salário,,3000.00
```

### OFX (Abrir conta)

```xml
<STMTTRN>
  <TRNTYPE>DEBIT
  <DTPOSTED>20240115
  <TRNAMT>-150.00
  <MEMO>Compra mercado
</STMTTRN>
```

### PDF (Banco do Brasil, Caixa, etc.)

```
15/01/2024 - Compra mercado - Débito - R$ 150,00
16/01/2024 - Salário janeiro - Crédito - R$ 3.000,00
```

---

## 🚀 Como Usar

### Passo 1: Baixar Extrato do Banco

```
1. Acesse seu banco online
2. Vai para "Extrato" ou "Transações"
3. Selecione período (última semana, mês, etc.)
4. Clique "Baixar" → CSV ou PDF
```

### Passo 2: Upload no FinControl

```
1. Acesse Dashboard
2. Procure por "Importar Extrato Bancário"
3. Arraste o arquivo ou clique para selecionar
4. Clique "Analisar com IA"
```

### Passo 3: Revisar e Confirmar

```
1. Sistema mostra transações encontradas
2. Desselecione as que não quer (duplicatas, etc.)
3. Clique "Lançar X Transações"
4. Pronto! ✅ Inseridas no banco de dados
```

---

## 🤖 Como a IA Funciona

1. **Lê** o arquivo (CSV, OFX ou PDF)
2. **Identifica** cada transação
3. **Extrai** data, descrição, valor
4. **Classifica**:
   - Tipo: income (receita) ou expense (despesa)
   - Categoria: Alimentação, Transporte, Salário, etc.
5. **Retorna** como lista formatada

### Exemplo

**Entrada (PDF do banco):**
```
15/01/2024 - Compra Magazine Luiza - Débito - R$ 250,50
16/01/2024 - Transferência recebida - Crédito - R$ 1.500,00
```

**Saída (IA analisa):**
```json
[
  {
    "date": "2024-01-15",
    "description": "Compra Magazine Luiza",
    "amount": 250.50,
    "type": "expense",
    "category": "Lazer"
  },
  {
    "date": "2024-01-16",
    "description": "Transferência recebida",
    "amount": 1500.00,
    "type": "income",
    "category": "Outros"
  }
]
```

---

## ⚙️ Arquivos Criados

- `lib/aiAnalysis.ts` - Funções de análise e parsing
- `components/BankStatementUpload.tsx` - Componente de upload
- `.env.local` - Configuração com OPENAI_API_KEY

---

## 🔐 Segurança

- ✅ API key fica em `.env.local` (nunca em código)
- ✅ Upload processado no servidor (não no browser)
- ✅ Transações inseridas apenas com confirmação do usuário
- ✅ Dados encriptados no Supabase

---

## 🐛 Troubleshooting

### Erro: "OPENAI_API_KEY não configurada"
```
❌ .env.local faltando ou sem chave
✅ Adicione OPENAI_API_KEY=sk-proj-...
✅ Reinicie servidor (npm run dev)
```

### Erro: "Nenhuma transação encontrada"
```
❌ Arquivo vazio ou formato inválido
✅ Verifique se arquivo tem dados reais
✅ Tente converter CSV em OFX online
```

### Erro: "401 Unauthorized"
```
❌ API key inválida ou expirada
✅ Gere nova chave em platform.openai.com
✅ Atualize .env.local
```

### Erro: "Rate limit exceeded"
```
❌ Muitos requisitos em pouco tempo
✅ Aguarde 1 minuto
✅ Combine extratos se possível
```

---

## 📊 Dicas

1. **Verificar Duplicatas**
   - Sistema mostra transações de forma legível
   - Desselecione se houver duplicação automática

2. **Categorizar Melhor**
   - Revise categorias atribuídas pela IA
   - Se erradas, edite diretamente no FinControl

3. **Combinar Períodos**
   - Se tiver 3 meses de dados, pode subir tudo de uma vez
   - IA identifica corretamente

4. **Contas Múltiplas**
   - Uno de uma conta por vez
   - Todas rastreadas por usuário

---

## 🎯 Próximas Features

- [ ] Detectar e alertar sobre duplicatas automáticas
- [ ] Regras customizadas de categorização
- [ ] Histórico de importações
- [ ] Exportar relatórios dos extratos
- [ ] Suporte a múltiplas contas bancárias

---

**Status**: ✅ Pronto para usar!

Qualquer dúvida, consulte a documentação de API da OpenAI:
https://platform.openai.com/docs/guides/text-generation
