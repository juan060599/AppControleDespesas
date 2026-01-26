## 🚀 GUIA PRÁTICO: TESTAR REFATORAÇÃO NO APK ANDROID

### Pre-requisitos
- ✅ Android Studio instalado
- ✅ Dispositivo Android conectado via USB (ou emulador rodando)
- ✅ `adb` disponível no terminal
- ✅ Build do projeto concluído

---

## PASSO 1: Compilar e Gerar APK

```bash
# 1. Compilar Next.js
npm run build

# 2. Gerar APK Debug
cd android
./gradlew assembleDebug
cd ..

# APK estará em: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## PASSO 2: Instalar no Dispositivo/Emulador

```bash
# Verificar se dispositivo está conectado
adb devices

# Instalar APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## PASSO 3: Abrir DevTools do APK

### Chrome DevTools (Recomendado)
1. Abra o APK
2. Pressione `F12` na tela do APK (se não funcionar, use Chrome Desktop)
3. No Chrome Desktop: `chrome://inspect`
4. Encontre seu dispositivo
5. Clique em "inspect" próximo ao WebView do APK

### Logcat (Alternative)
```bash
# Ver todos os logs
adb logcat | grep -i "fincontrol\|capacitor"

# Ver apenas erros
adb logcat | grep -i "error\|exception"

# Limpar e depois ver logs
adb logcat -c
adb logcat
```

---

## PASSO 4: TESTE 1 - Sem Login

### Ação
1. Abra o APK
2. Será redirecionado para `/signin` (tela de login) - ✅ ESPERADO
3. Não clique em nada por enquanto

### O que Verificar
- ❌ NÃO deve redirecionar de volta para uma tela anterior
- ❌ NÃO deve entrar em loop
- ❌ NÃO deve mostrar erro "useAuthSession not found"

### Se Passou ✅
→ Vá para TESTE 2

### Se Falhou ❌
→ Verifique logs: `adb logcat | grep -i "error"`

---

## PASSO 5: TESTE 2 - Acessar Dashboard Sem Login

### Ação (via DevTools Console)
```javascript
// No Console do Chrome DevTools:
window.location.href = 'https://localhost/dashboard'
```

### O que Verificar
- ✅ Dashboard deve CARREGAR mesmo sem estar logado
- ✅ Não deve redirecionar para signin
- ✅ Pode estar vazio (sem dados de transações)
- ❌ NÃO deve mostrar "useAuthSession" error

### Se Passou ✅
→ Vá para TESTE 3

### Se Falhou ❌
→ Há redirecionamento automático ainda. Verifique `app/dashboard/page.tsx`

---

## PASSO 6: TESTE 3 - Acessar Pricing Sem Login

### Ação (via DevTools Console)
```javascript
window.location.href = 'https://localhost/pricing'
```

### O que Verificar
- ✅ Página de Pricing deve CARREGAR
- ✅ Botão "Começar Agora" visível
- ✅ Não deve redirecionar para signin
- ❌ NÃO deve ficar em loading infinito

### Se Passou ✅
→ Vá para TESTE 4

### Se Falhou ❌
→ Há redirecionamento automático. Verifique `app/pricing/page.tsx`

---

## PASSO 7: TESTE 4 - Clicar em Checkout Sem Login

### Ação
1. Na página de Pricing (do TESTE 3)
2. Clique no botão "Começar Agora"

### O que Verificar
- ✅ Deve mostrar mensagem de erro: "Você precisa fazer login para continuar"
- ✅ Deve redirecionar para signin
- ❌ NÃO deve processar checkout
- ❌ NÃO deve abrir Stripe sem verificar

### Se Passou ✅
→ Vá para TESTE 5 (fazer login)

### Se Falhou ❌
→ Verificação de auth no checkout não funciona. Verifique `handleCheckout()` em pricing

---

## PASSO 8: TESTE 5 - Fazer Login

### Ação
1. Na tela de signin (do TESTE 4 ou início)
2. Preencha email e senha válidos
3. Clique em "Entrar"

### O que Verificar
- ✅ Deve redirecionar para `/dashboard`
- ✅ Deve carregar dados do usuário (transações, saldo)
- ✅ Header mostra nome/email do usuário
- ❌ NÃO deve redirecionar de volta para signin

### Se Passou ✅
→ Vá para TESTE 6

### Se Falhou ❌
→ Problema no fluxo de login. Verifique `SignInForm.tsx`

---

## PASSO 9: TESTE 6 - Navegar para Pricing Com Login

### Ação
1. No Dashboard (após login do TESTE 5)
2. Clique em "Planos" (menu ou botão)
3. Ou use DevTools: `window.location.href = 'https://localhost/pricing'`

### O que Verificar
- ✅ Pricing page carrega normalmente
- ✅ Botão "Começar Agora" está ativo
- ✅ Header mostra seu email
- ❌ NÃO deve redirecionar

### Se Passou ✅
→ Vá para TESTE 7

### Se Falhou ❌
→ Verifique se a sessão foi mantida. Use DevTools Console:
```javascript
// Ver sessão
const { data } = await supabase.auth.getSession()
console.log(data)
```

---

## PASSO 10: TESTE 7 - Checkout Com Login

### Ação
1. Na página de Pricing (do TESTE 6)
2. Clique em "Começar Agora"

### O que Verificar
- ✅ Deve redirecionar para Stripe (ou sandbox de pagamento)
- ✅ NÃO deve mostrar erro "Você precisa fazer login"
- ✅ Session está válida

### Se Passou ✅
→ Refatoração de Pricing está OK! Vá para TESTE 8

### Se Falhou ❌
→ Sessão expirou ou não foi restaurada. Tente fazer login novamente.

---

## PASSO 11: TESTE 8 - Análise IA

### Ação
1. No Dashboard
2. Clique em "Enviar Extrato" ou "Analisar com IA"
3. Selecione um arquivo CSV ou OFX
4. Clique em "Analisar"

### O que Verificar
- ✅ Se logado: deve processar análise
- ✅ Mostra transações encontradas
- ✅ Se atingiu limite: mostra "Você atingiu o limite de 5 análises"
- ✅ NÃO deve redirecionar para login durante análise

### Se Passou ✅
→ Refatoração de IA está OK!

### Se Falhou ❌
→ Verifique `BankStatementUpload.tsx` - verificação de auth

---

## PASSO 12: TESTE 9 - Settings

### Ação
1. No Dashboard
2. Clique em Menu → Settings
3. Navegue pelas opções

### O que Verificar
- ✅ Página carrega normalmente
- ✅ Pode sair e voltar sem redirecionar
- ✅ Mostra dados do usuário logado

### Se Passou ✅
→ Settings refatorado com sucesso!

### Se Falhou ❌
→ Verifique se há ainda chamadas para `useAuthSession()` em settings

---

## PASSO 13: TESTE CRÍTICO - Logout e Voltar

### Ação
1. No Dashboard
2. Clique em Logout
3. Será redirecionado para signin
4. Acesse `/dashboard` via DevTools Console:
   ```javascript
   window.location.href = 'https://localhost/dashboard'
   ```

### O que Verificar
- ✅ Dashboard carrega SEM login
- ✅ NÃO redireciona para signin
- ✅ Mostra "sem dados" ou tela vazia
- ✅ Sem loops infinitos

### Se Passou ✅
→ 🎉 REFATORAÇÃO COMPLETA E FUNCIONAL!

### Se Falhou ❌
→ Ainda há redirecionamentos automáticos. Volte e revise as mudanças.

---

## CHECKLIST FINAL

```
FUNCIONANDO? ✅ ou ❌

☐ Teste 1: Tela de login sem redirecionar
☐ Teste 2: Dashboard acessível sem login
☐ Teste 3: Pricing acessível sem login
☐ Teste 4: Checkout pede login
☐ Teste 5: Login funciona normalmente
☐ Teste 6: Pricing carrega com login
☐ Teste 7: Checkout processa com login
☐ Teste 8: Análise IA funciona
☐ Teste 9: Settings funciona
☐ Teste 13: Logout e voltar ao dashboard funciona

RESULTADO: ✅ TODOS OS TESTES PASSARAM
```

---

## 🔍 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "useAuthSession not found" | Removeu todas as referências? Procure no código |
| Redireciona em cascata | Verifique se há `router.push('/signin')` em useEffect |
| Análise IA não funciona | Verifique se user existe antes de analisar |
| Sessão expira rapidamente | Verifique capacitorStorage e token refresh |
| DevTools não funciona | Use emulador ao invés de dispositivo real |

---

## 📱 Comandos Úteis

```bash
# Instalar APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Desinstalar APK
adb uninstall com.fincontrol.app

# Ver logs
adb logcat | grep -i "fincontrol"

# Limpar cache do app
adb shell pm clear com.fincontrol.app

# Ver dispositivos conectados
adb devices

# Abrir shell do dispositivo
adb shell
```

---

**Data**: 26/01/2026
**Projeto**: AppControleDespesas
**Status**: ✅ Refatoração Completa - Pronto para Testes APK
