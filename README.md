# Controle de Despesas e Receitas

Aplicação web moderna para controle de receitas e despesas com dashboard interativo e análises visuais.

## 🎯 Características

- **Autenticação Segura**: Sistema de login e registro integrado com Supabase
- **Dashboard Interativo**: Gráficos em tempo real mostrando:
  - Total de receitas e despesas
  - Saldo atual
  - Despesas por categoria (Gráfico de Pizza)
  - Comparação receitas vs despesas (Gráfico de Barras)
  - Tendência mensal (Gráfico de Linhas)
- **Gerenciamento de Transações**: Adicionar, editar e deletar receitas/despesas
- **Categorização**: Organizador por categorias personalizadas
- **Banco de Dados Seguro**: Integração com Supabase com Row-Level Security (RLS)
- **Responsivo**: Design mobile-first com Tailwind CSS

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **Backend/Database**: Supabase
- **Autenticação**: Supabase Auth
- **UI Icons**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase (gratuita em https://supabase.com)

## 🚀 Instalação e Setup

### 1. Clonar o repositório

```bash
cd C:\Users\juansilva\StudioProjects\AppControleDespesas
```

### 2. Instalar dependências

```bash
npm install
```

Ou execute o script de setup:

**Windows:**
```bash
.\scripts\setup.bat
```

**Linux/Mac:**
```bash
bash scripts/setup.sh
```

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rgxhxgigemncqkskaprj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_D9M6qWPxdZ_aZ52k0mKfCA_Sn9RJHZU
SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key_aqui
```

### 4. Criar Tabelas no Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **SQL Editor**
3. Copie e execute o script em `scripts/setup_database.sql`

Ou execute pelo terminal:
```bash
npm run setup:db
```

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📊 Estrutura do Projeto

```
AppControleDespesas/
├── app/
│   ├── layout.tsx           # Layout raiz
│   ├── page.tsx             # Página inicial (redireciona para login)
│   ├── signin/
│   │   └── page.tsx         # Página de login
│   ├── signup/
│   │   └── page.tsx         # Página de registro
│   └── dashboard/
│       └── page.tsx         # Dashboard principal
├── components/
│   ├── SignInForm.tsx       # Formulário de login
│   ├── SignUpForm.tsx       # Formulário de registro
│   ├── Dashboard.tsx        # Componente de dashboard com gráficos
│   ├── TransactionForm.tsx  # Formulário para adicionar transações
│   └── TransactionList.tsx  # Lista de transações
├── lib/
│   ├── supabase.ts          # Cliente Supabase
│   └── database.ts          # Funções de banco de dados
├── scripts/
│   ├── setup_database.sql   # Script SQL para criar tabelas
│   ├── setup.bat            # Script de setup Windows
│   └── setup.sh             # Script de setup Linux/Mac
├── styles/
│   └── globals.css          # Estilos globais
├── .env.local               # Variáveis de ambiente
├── package.json             # Dependências do projeto
├── tsconfig.json            # Configuração TypeScript
├── tailwind.config.ts       # Configuração Tailwind CSS
├── next.config.js           # Configuração Next.js
└── README.md                # Este arquivo
```

## 🔐 Segurança

A aplicação utiliza:
- **Row-Level Security (RLS)** no Supabase
- Cada usuário só pode acessar suas próprias transações
- Autenticação JWT via Supabase Auth
- Variáveis de ambiente para credenciais sensíveis

## 💻 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Verificar linting
npm run lint
```

## 📱 Funcionalidades Principais

### Dashboard
- Resumo visual de receitas, despesas e saldo
- Gráficos interativos e em tempo real
- Dados categorizados
- Análise de tendências mensais

### Gerenciamento de Transações
- Adicionar receitas e despesas
- Categorizar transações
- Editar informações de transações
- Deletar transações
- Visualizar histórico completo

### Autenticação
- Criar nova conta
- Login seguro
- Logout
- Sessão persistente

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se `.env.local` foi criado corretamente
- Confirme que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` estão preenchidos

### Erro: "Relation 'transactions' does not exist"
- Execute o script SQL em `scripts/setup_database.sql` no Supabase SQL Editor
- Verifique se todas as tabelas foram criadas

### Usuário não consegue fazer login
- Confirme que criou uma conta no Supabase
- Verifique se o email de confirmação foi verificado (se RLS está habilitado)

## 📝 Categorias Padrão

**Despesas:**
- Alimentação
- Transporte
- Habitação
- Saúde
- Educação
- Lazer
- Outros

**Receitas:**
- Salário
- Freelance
- Investimentos
- Outros

## 🚀 Próximos Passos para Melhorias

- [ ] Adicionar gráficos de previsão de gastos
- [ ] Sistema de metas de orçamento por categoria
- [ ] Exportar dados em PDF/Excel
- [ ] Notificações de limite de orçamento
- [ ] Integração com banco de dados
- [ ] Modo escuro
- [ ] Suporte a múltiplas moedas
- [ ] Análises avançadas e relatórios

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para fazer um fork do projeto e enviar pull requests.

## 📧 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando Next.js e Supabase
