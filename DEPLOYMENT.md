# 🚢 DEPLOYMENT - Guia de Publicação

Este guia mostra como publicar sua aplicação em produção.

## 🔥 Opção 1: Deploy no Vercel (RECOMENDADO)

Vercel é a plataforma oficial de hosting para Next.js.

### Pré-requisitos:
- Conta GitHub (para conectar repositório)
- Conta Vercel (gratuita em https://vercel.com)

### Passos:

1. **Push para GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conectar ao Vercel:**
   - Acesse https://vercel.com/new
   - Clique em "Import Git Repository"
   - Selecione seu repositório GitHub
   - Clique em "Import"

3. **Configurar Variáveis de Ambiente:**
   - Na página de configuração do Vercel
   - Vá para "Environment Variables"
   - Adicione:
     ```
     NEXT_PUBLIC_SUPABASE_URL=seu_url
     NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sua_chave_publica
     ```
   - Clique em "Deploy"

4. **Aguardar Build:**
   - O Vercel vai fazer o build automaticamente
   - URL será gerada automaticamente
   - Seu app estará online em segundos!

### Benefícios:
- ✅ Deploy automático a cada push no GitHub
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Rollback automático
- ✅ Gratuito para projetos pessoais
- ✅ Domínio customizado

---

## 🐳 Opção 2: Deploy com Docker

### Dockerfile:

Crie um arquivo `Dockerfile` na raiz do projeto:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
```

### Build e Run:

```bash
# Build
docker build -t controle-despesas .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=seu_url \
  -e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sua_chave \
  controle-despesas
```

---

## ☁️ Opção 3: Deploy no Heroku

### Pré-requisitos:
- Conta Heroku (https://heroku.com)
- Heroku CLI instalado

### Passos:

1. **Login no Heroku:**
   ```bash
   heroku login
   ```

2. **Criar App:**
   ```bash
   heroku create seu-app-name
   ```

3. **Configurar Variáveis:**
   ```bash
   heroku config:set NEXT_PUBLIC_SUPABASE_URL=seu_url
   heroku config:set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sua_chave
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

---

## 📦 Opção 4: Deploy no AWS

### Com AWS Amplify:

1. Acesse AWS Amplify Console
2. Conecte seu repositório GitHub
3. Configure ambiente
4. Deploy automático

### Com EC2:

1. Crie uma instância EC2
2. Instale Node.js
3. Clone o repositório
4. Execute:
   ```bash
   npm install
   npm run build
   npm start
   ```

---

## 🌐 Opção 5: Deploy no Railway

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Configure variáveis de ambiente
5. Deploy automático

---

## ✅ Checklist Pré-Deployment

Antes de fazer deploy:

- [ ] Código está testado localmente
- [ ] Todas as funcionalidades funcionam
- [ ] Variáveis de ambiente estão corretas
- [ ] Banco de dados (Supabase) está configurado
- [ ] Não há logs de erro no console
- [ ] Build local passa sem erros: `npm run build`
- [ ] Performance foi verificada: `npm run build && npm start`
- [ ] README está atualizado
- [ ] Repositório Git está atualizado
- [ ] Issues conhecidas foram documentadas

---

## 🔒 Segurança em Produção

### Antes de fazer deploy:

1. **Variáveis de Ambiente:**
   - NUNCA adicione chaves no código
   - Use apenas chaves públicas no frontend
   - Service Keys só no backend

2. **CORS:**
   - Configure domínios permitidos no Supabase
   - Restrinja origem das requisições

3. **Rate Limiting:**
   - Implementar rate limiting
   - Monitorar uso de API

4. **Monitoramento:**
   - Use ferramentas como Sentry
   - Configure alertas de erro
   - Monitore performance

### Configurar CORS no Supabase:

1. Vá para Settings > API
2. Adicione domínio em "Allowed Origins"
3. Exemplo: `https://seu-dominio.com`

---

## 📊 Monitoramento em Produção

### Ferramentas Recomendadas:

1. **Vercel Analytics** (se usar Vercel)
   - Incluído gratuitamente
   - Web Vitals
   - Performance insights

2. **Sentry** (erros)
   ```bash
   npm install @sentry/nextjs
   ```

3. **LogRocket** (user sessions)
   - Grava interações do usuário
   - Ajuda a debugar problemas

4. **Google Analytics**
   - Rastreie visitantes
   - Analise comportamento

---

## 🚀 Domínio Customizado

### No Vercel:

1. Vá para Project Settings > Domains
2. Adicione seu domínio
3. Atualize DNS records
4. HTTPS automático em minutos

### No Heroku:

```bash
heroku domains:add www.seu-dominio.com
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Automático):

O Vercel já configura CI/CD automaticamente.

Para outros, crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

---

## 📈 Escalabilidade

Se sua aplicação crescer:

1. **Supabase:**
   - Upgrade para plano pago
   - Configure backups automáticos
   - Configure replicação

2. **Vercel:**
   - Upgrade para Pro
   - Configure analytics
   - Otimize imagens

3. **Database:**
   - Índices nas colunas frequentes
   - Partição de dados grandes
   - Cache com Redis

4. **Frontend:**
   - Otimizar imagens
   - Code splitting
   - Lazy loading

---

## 🆘 Troubleshooting Deployment

### Build falha
```bash
npm ci  # Clean install
npm run build  # Verificar erro
```

### Timeout na API
- Aumentar timeout
- Otimizar queries
- Usar cache

### Problema com variáveis
- Verificar nome exato
- Sem espaços extras
- NEXT_PUBLIC_ para frontend

### Banco de dados não conecta
- Verificar URL
- Verificar credenciais
- Testar localmente

---

## 📚 Recursos Úteis

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)
- [Docker Docs](https://docs.docker.com/)
- [GitHub Actions](https://github.com/features/actions)

---

## ✨ Depois do Deploy

1. **Teste em produção:**
   - Crie conta
   - Adicione transações
   - Verifique gráficos

2. **Monitore:**
   - Erros
   - Performance
   - Uso de usuários

3. **Otimize:**
   - Baseado em metrics
   - Feedback de usuários
   - Performance logs

4. **Mantenha:**
   - Updates de dependências
   - Backup de dados
   - Patches de segurança

---

Parabéns! Sua aplicação está em produção! 🎉
