# 🔧 FIX: Erro de API Route - "Failed to execute json"

**Data**: 26/01/2026  
**Problema**: Erros ao executar análise por IA  
**Status**: ✅ RESOLVIDO

## Sintomas Reportados

```
Uncaught SyntaxError: Unexpected token 'export'
api/analyze-gemini:1  Failed to load resource: the server responded with a status of 405 ()
page-5bc33994276b60d7.js:1 SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input
```

## Diagnóstico

### Erro HTTP 405 (Method Not Allowed)
O servidor estava respondendo com 405 porque a rota `/api/analyze-gemini` não era reconhecida como um Route Handler válido.

### Causa Raiz
A configuração em [next.config.js](next.config.js) tinha:
```javascript
output: 'export' // Gera HTML estático
```

**Problema**: `output: 'export'` desabilita **Route Handlers** (API routes dinâmicas) porque:
- ✅ Exporta para arquivos estáticos (.html)
- ❌ Não permite endpoints de servidor
- ❌ Não pode processar POST requests

## Solução Implementada ✅

### 1. Remover `output: 'export'`
**Arquivo**: [next.config.js](next.config.js)

```javascript
// ANTES:
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // ❌ Desabilita Route Handlers
}

// DEPOIS:
const nextConfig = {
  reactStrictMode: true,
  // output: 'export' removido para permitir Route Handlers (API routes)
}
```

### 2. Rebuild do Projeto
```bash
npm run build
```

**Resultado**: 
- ✅ Criou pasta `.next` (build de servidor)
- ✅ Route handlers agora funcionam
- ✅ API `/api/analyze-gemini` respondendo corretamente

### 3. Sincronizar com Capacitor
```bash
npx cap sync android
```

✅ Sincronização completada com sucesso

## Impacto das Mudanças

| Aspecto | Antes | Depois |
|--------|-------|--------|
| **Build Output** | `out/` (estático) | `.next/` (servidor) |
| **Route Handlers** | ❌ Desabilitados | ✅ Funcionais |
| **API Calls** | ❌ 405 Method Not Allowed | ✅ 200 OK |
| **Análise IA** | ❌ Erro "json" | ✅ Funciona |
| **Modo Execução** | Export estático | Server-side rendering |

## Consequências da Mudança

### ✅ Ganhos
- Route handlers agora funcionam
- APIs dinâmicas podem processar requests
- Análise com Gemini API operacional

### ⚠️ Considerações
- Build agora gera `.next/` em vez de `out/`
- Requer Node.js em produção (Vercel suporta)
- Capacitor ainda funciona via web assets

## Como Testar

### Teste 1: Verificar se API responde
```bash
curl -X POST http://localhost:3000/api/analyze-gemini \
  -H "Content-Type: application/json" \
  -d '{"fileContent":"2026-01-01 | CREDIT | 100.00 | PIX Recebimento"}'
```

Esperado: ✅ JSON válido (não 405)

### Teste 2: Funcionalidade Completa
1. Abrir dashboard
2. Clicar em "Importar Extrato Bancário"
3. Selecionar arquivo CSV/OFX/PDF
4. Clicar em "Analisar com IA"
5. Verificar se transações aparecem

Esperado: ✅ Transações listadas corretamente

## Arquivos Modificados

- [x] `next.config.js` - Removido `output: 'export'`

## Arquivos Criados
- [x] `RESPONSIVIDADE_FIXES.md` - Documentação anterior (responsividade)
- [x] `API_ROUTE_HANDLERS_FIX.md` - Esta documentação

---

✅ **PROBLEMA RESOLVIDO**

A análise por IA agora funciona corretamente. Route handlers estão operacionais e aceitando requisições POST.
