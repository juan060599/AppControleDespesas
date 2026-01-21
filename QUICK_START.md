# 🚀 Inicialização Rápida

Siga estes passos para colocar a aplicação em funcionamento em minutos!

## ⚡ 5 Minutos de Setup

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente
O arquivo `.env.local` já contém as credenciais. Se não, atualize com:
```
NEXT_PUBLIC_SUPABASE_URL=https://rgxhxgigemncqkskaprj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_D9M6qWPxdZ_aZ52k0mKfCA_Sn9RJHZU
```

### 3️⃣ Criar Tabelas no Supabase
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **SQL Editor**
3. Cole o conteúdo de `scripts/setup_database.sql`
4. Execute (Ctrl+Enter)

### 4️⃣ Iniciar Servidor
```bash
npm run dev
```

### 5️⃣ Acessar Aplicação
Abra no navegador: `http://localhost:3000`

---

## ✅ Pronto!

- ✓ Crie uma conta (`/signup`)
- ✓ Faça login (`/signin`)
- ✓ Comece a adicionar transações
- ✓ Veja os gráficos do dashboard

---

## 📚 Documentação Completa

- **Guia de Uso**: `USAGE_GUIDE.md`
- **Setup Supabase**: `SUPABASE_SETUP.md`
- **README**: `README.md`

## 🆘 Precisa de Ajuda?

Consulte a seção de troubleshooting em:
- `README.md` - Troubleshooting geral
- `SUPABASE_SETUP.md` - Problemas com Supabase
