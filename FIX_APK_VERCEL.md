# 🚀 GUIA: CONFIGURAR APK PARA VERCEL

## O Problema
Você tem a app publicada no Vercel (`https://app-controle-despesas.vercel.app`), mas o APK estava tentando acessar `https://localhost`, causando erro de "Failed to fetch".

## A Solução
Configurar o Capacitor para apontar para a URL do Vercel.

---

## ✅ Mudança Feita

### Arquivo: `capacitor.config.ts`

**Alterado de:**
```typescript
server: {
  androidScheme: 'https'
}
```

**Para:**
```typescript
server: {
  androidScheme: 'https',
  url: 'https://app-controle-despesas.vercel.app',
  cleartext: false,
}
```

Agora o APK acessa: `https://app-controle-despesas.vercel.app` ✅

---

## 🔧 Próximos Passos

### 1. Garantir que o .env esteja configurado
No seu Vercel, certifique-se que as variáveis estão configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (se usar análise IA)
- `STRIPE_SECRET_KEY` (se usar checkout)

### 2. Fazer o build novamente
```bash
npm run build
```

### 3. Gerar APK
```bash
cd android
./gradlew assembleDebug
cd ..
```

### 4. Instalar APK
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### 5. Testar no APK
- Abra o APK
- Verifique se carrega a página de login do Vercel
- Teste o login
- Teste a navegação para Pricing e Dashboard

---

## 🎯 Resultado Esperado

**Antes:** ❌
```
APK tenta acessar: https://localhost
Erro: "Failed to fetch"
Login não funciona
```

**Depois:** ✅
```
APK tenta acessar: https://app-controle-despesas.vercel.app
Conecta ao Vercel normalmente
Login funciona perfeitamente
```

---

## ✨ Como Funciona Agora

```
APK (Android) 
    ↓
Vercel Backend (https://app-controle-despesas.vercel.app)
    ↓
Supabase Auth
    ↓
Login bem-sucedido ✅
```

---

## 🔍 Se Ainda Não Funcionar

### Sintoma 1: Ainda diz "Failed to fetch"

**Verificar:**
1. O URL está correto? `https://app-controle-despesas.vercel.app`
2. A app está publicada no Vercel?
3. Há CORS habilitado?

**Solução:**
- Verifique em `next.config.js` se CORS está habilitado
- Cheque se variáveis de ambiente estão no Vercel

### Sintoma 2: Carrega mas login falha

**Verificar:**
1. Variáveis de ambiente no Vercel
2. Supabase está online?
3. RLS está corrigido?

**Solução:**
- Acesse Vercel Dashboard
- Verifique "Environment Variables"
- Confirme todas as chaves do Supabase

### Sintoma 3: Conecta mas não persiste sessão

**Solução:**
- A sessão agora é persistida via `capacitorStorage`
- Aguarde 2-3 segundos após login para certeza

---

## 📝 Checklist

- [x] `capacitor.config.ts` atualizado
- [ ] `npm run build` executado
- [ ] APK gerado
- [ ] APK instalado no dispositivo
- [ ] APK testado
- [ ] Login funciona
- [ ] Navegação fluida
- [ ] Sem erros de "Failed to fetch"

---

## 🎁 Resumo

Agora seu APK aponta para `https://app-controle-despesas.vercel.app` em vez de localhost.

**Status**: ✅ Configurado e pronto para testar

---

**Próximo**: Execute os comandos acima e teste no APK!
