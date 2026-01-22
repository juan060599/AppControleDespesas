# 📱 APK Android - FinControl

## 📋 Pré-requisitos

Antes de gerar o APK, certifique-se que tem instalado:

### 1. **Java Development Kit (JDK) 11+**
```bash
# Verificar instalação
java -version
```
**Download:** https://adoptopenjdk.net/

### 2. **Android SDK / Android Studio**
```bash
# Verificar Android SDK
echo %ANDROID_HOME%
```
**Download:** https://developer.android.com/studio

### 3. **Node.js 16+**
```bash
node --version
npm --version
```

---

## 🚀 Gerar APK

### **Opção 1: Automático (Recomendado)**

```bash
npm run build:apk
```

Este comando automaticamente:
1. ✅ Build Next.js para produção
2. ✅ Sincroniza com Capacitor
3. ✅ Compila APK de release
4. ✅ Gera arquivo final

**Tempo estimado:** 5-10 minutos

### **Opção 2: Passo a Passo**

```bash
# 1. Build Next.js
npm run build

# 2. Sincronizar Capacitor
npm run cap:sync

# 3. Abrir Android Studio para compilar
npm run cap:open

# 4. No Android Studio:
# - Menu Build > Generate Signed APK
# - Selecionar release
# - Gerar APK
```

---

## 📦 Localização do APK

Após compilação, o APK estará em:

```
android/app/build/outputs/apk/release/app-release.apk
```

**Tamanho estimado:** 50-80 MB

---

## 📱 Instalar no Celular

### **Via Adb (USB)**

```bash
# Conectar celular via USB com debug ativado
adb install android/app/build/outputs/apk/release/app-release.apk
```

### **Via Arquivo**

1. **Transferir APK para celular** (USB, email, Google Drive, etc)
2. **No celular:**
   - Abrir gerenciador de arquivos
   - Localizar arquivo APK
   - Clicar para instalar
   - Permitir instalação de fontes desconhecidas

### **Via Play Store (Futuro)**

Para distribuir publicamente:
1. Criar conta Google Play Console
2. Assinar APK digitalmente
3. Upload para Play Store
4. Aguardar aprovação

---

## 🔒 Assinatura Digital

O APK deve ser assinado. Capacitor faz isso automaticamente na release.

Para asinar manualmente:

```bash
# Criar keystore (apenas primeira vez)
keytool -genkey -v -keystore release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias fincontrol-key

# Assinar APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore release-key.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  fincontrol-key
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` com suas configurações:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=seu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

---

## 🔧 Troubleshooting

### **Erro: "Java not found"**
```bash
# Instalar Java
# Download: https://adoptopenjdk.net/
# Ou via Chocolatey (Windows):
choco install openjdk11
```

### **Erro: "Android SDK not found"**
```bash
# Configurar variável de ambiente
set ANDROID_HOME=C:\Users\SEU_USER\AppData\Local\Android\sdk

# Ou permanentemente no Windows:
# Painel de Controle > Variáveis de Ambiente > Novo
```

### **APK muito grande**
- Remover assets não utilizados
- Minificar imagens
- Usar ProGuard/R8 para código

### **Erro ao sincronizar**
```bash
# Limpar cache Capacitor
rm -rf node_modules package-lock.json
npm install
npm run cap:sync
```

---

## 📊 Versão do APK

Editar `capacitor.config.ts`:

```typescript
// Incrementar versão a cada release
versionCode: 1,  // Número interno (sempre aumenta)
versionName: '1.0.0',  // Versão pública
```

---

## 🎯 Checklist Antes de Publicar

- [ ] Todas as funcionalidades testadas no APK
- [ ] Sem erros console
- [ ] Icons visíveis corretamente
- [ ] App funciona offline (PWA features)
- [ ] Notificações funcionam
- [ ] Supabase conecta corretamente
- [ ] Versão incrementada
- [ ] APK assinado digitalmente
- [ ] Documentação atualizada

---

## 📚 Recursos Úteis

- [Capacitor Docs](https://capacitorjs.com/)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Gradle Build System](https://gradle.org/)
- [Google Play Console](https://play.google.com/console)

---

## 🔄 Atualizações

Para atualizar o app após lançamento:

```bash
# 1. Alterar código
# 2. Incrementar versionCode em capacitor.config.ts
# 3. Build novo APK
npm run build:apk
# 4. Publicar novo APK
```

---

**Suporte:** Para dúvidas, consulte a documentação do Capacitor ou entre em contato com o time de desenvolvimento.
