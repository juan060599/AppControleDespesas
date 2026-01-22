# Configurações de Build do Capacitor Android

## gradle.properties - Adicionar otimizações

```properties
# Capacitor
capacitor.gradle=7.0.0

# Otimizações
org.gradle.jvmargs=-Xmx2048m
org.gradle.parallel=true
org.gradle.caching=true

# Android
android.useAndroidX=true
android.enableJetifier=true
```

## AndroidManifest.xml - Permissões

As seguintes permissões serão adicionadas automaticamente:

```xml
<!-- Internet (obrigatório) -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Câmera (opcional, para futuros uploads) -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Armazenamento (opcional) -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## build.gradle - Dependências

Capacitor adiciona automaticamente:
- `androidx.appcompat:appcompat`
- `androidx.webkit:webkit`
- Outras dependências do Android SDK

---

## 🚀 Build Otimizado

Para build mais rápido em desenvolvimento:

```bash
# Debug build (rápido)
./gradlew assembleDebug

# Release build (otimizado)
./gradlew assembleRelease
```

---

## 📦 Tamanho Final

Fatores que afetam:
- Assets e imagens (maior impacto)
- Dependências npm
- Código compilado
- Recursos do Capacitor

**Otimizações possíveis:**
1. Comprimir imagens de 512x512 para 256x256 quando possível
2. Usar webp em vez de png
3. Remover pacotes não utilizados
4. Tree-shaking de dependências

---

Seu APK será gerado automaticamente com `npm run build:apk`!
