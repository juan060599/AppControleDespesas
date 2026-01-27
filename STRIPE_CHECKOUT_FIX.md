# 🔧 FIX: Erro no Stripe Checkout "Unexpected token 'export'"

**Data**: 26/01/2026  
**Problema**: Erro ao clicar em "Comprar Plano" ($19,90)  
**Status**: ✅ RESOLVIDO

## Sintomas Reportados

```
<link rel=preload> uses an unsupported `as` value
webpage_content_reporter.js:1 Uncaught SyntaxError: Unexpected token 'export' (at webpage_content_reporter.js:1:115558)
```

## Diagnóstico

Este erro era causado por:

1. **Build com `output: 'export'`** ❌
   - Gerava HTML estático puro em `out/`
   - Arquivo gerado com syntax error (export em contexto HTML)
   - Não suportava Route Handlers

2. **Cachdados antigos** ❌
   - Build anterior estava em cache
   - Scripts `.js` tinham referências incorretas

3. **Falta de sincronização** ❌
   - Capacitor estava usando assets antigos do `out/`

## Solução Implementada ✅

### 1. Remover `output: 'export'` (Já feito anteriormente)
```javascript
// ❌ ANTES:
output: 'export'

// ✅ DEPOIS:
// output: 'export' removido
```

### 2. Limpar Build Antigos
```bash
Remove-Item -Recurse -Force out
Remove-Item -Recurse -Force .next
```

### 3. Rebuild Completo
```bash
npm run build
```

Resultado:
- ✅ Criou novo `.next/` com build servidor correto
- ✅ Nenhuma pasta `out/`
- ✅ Route handlers compilados corretamente

### 4. Sincronizar Capacitor
```bash
npx cap sync android
```

✅ Sincronização completa sem erros

## Verificação da Rota de Checkout

A rota `/api/create-checkout-session` está funcionando:

```typescript
✅ POST /api/create-checkout-session 200 OK
```

Fluxo correto:
1. Usuário clica em "Comprar"
2. `handleCheckout()` enviafetch POST
3. Rota retorna `{ url: session.url }` do Stripe
4. Redirect para `window.location.href = data.url`

## Arquivos Afetados

- [x] `next.config.js` - Remover `output: 'export'`
- [x] `.next/` - Rebuilded completo
- [x] `android/` - Sincronizado

## Como Testar

### Teste 1: Verificar Rota
```bash
curl -X POST http://localhost:3000/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","userEmail":"test@example.com"}'
```

Esperado: ✅ Retorna `{ url: "https://checkout.stripe.com/..." }`

### Teste 2: Fluxo Completo
1. Abrir Dashboard
2. Ir para "Planos"
3. Clicar em "Comprar $19,90"
4. Verificar se redireciona para Stripe Checkout

Esperado: ✅ Sem erros, redirecionamento para Stripe

## Avisos Resolvidos

⚠️ **Aviso Pendente** (Não afeta funcionalidade):
```
Unsupported metadata viewport is configured in metadata export in /dashboard
```

**Causa**: Next.js 15.5.9 prefere usar `viewport export` em vez de `metadata.viewport`

**Impacto**: Nenhum - funciona normalmente

**Possível fix futuro**: Mover viewport para `generateViewport()` em vez de metadata

## Status Final

✅ **API Route Handlers**: Funcionais  
✅ **Rota de Checkout**: Respondendo 200  
✅ **Sincronização Capacitor**: Sucesso  
✅ **Build Production-Ready**: Pronto para deploy  

---

O erro "Unexpected token 'export'" foi causado por resquícios de um build que usava `output: 'export'`. Ao limpar completamente e rebuildar, o problema foi resolvido.
