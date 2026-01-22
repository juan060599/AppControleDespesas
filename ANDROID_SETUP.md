# Guia de Configuração para Android

Este documento fornece instruções para converter este projeto Next.js em um aplicativo Android nativo.

## Opção 1: React Native (Recomendado para Web + Mobile)

### Pré-requisitos
- Node.js (v16+)
- Android Studio
- Java Development Kit (JDK) 11+
- Android SDK

### Passos de Configuração

1. **Instale o CLI do React Native:**
```bash
npm install -g react-native-cli
npm install -g @react-native-community/cli
```

2. **Crie um novo projeto React Native:**
```bash
npx react-native init AppControleDespesas
cd AppControleDespesas
```

3. **Copie os componentes do projeto web:**
- Copie a pasta `components/` para `app/`
- Copie a pasta `lib/` para a raiz do projeto
- Adapte os estilos Tailwind para React Native StyleSheet

4. **Abra no Android Studio:**
```bash
cd android
# Abra a pasta android no Android Studio
```

## Opção 2: Flutter (Melhor Performance)

Se preferir Flutter:

1. **Instale Flutter:**
   - Baixe do site oficial: https://flutter.dev/docs/get-started/install

2. **Crie um novo projeto:**
```bash
flutter create app_controle_despesas
```

3. **Abra no Android Studio:**
```bash
cd app_controle_despesas
flutter pub get
```

4. **Copie a lógica Supabase** da pasta `lib/` do projeto Next.js

## Estrutura para Desenvolvimento Híbrido

Para manter sincronizado entre Web e Mobile, organize assim:

```
AppControleDespesas/
├── web/              # Next.js (atual)
├── mobile/           # React Native ou Flutter
├── shared/           # Código compartilhado
│   ├── lib/
│   │   ├── api.ts    # Chamadas Supabase
│   │   ├── types.ts  # Types compartilhados
│   └── constants.ts
└── docs/
```

## Componentes Android Nativos

### Converter Componentes React para Android:

Exemplo - Criar forma reativa com Material Design:

```tsx
// Web (React)
<input className="border-2 border-blue-500" />

// Android (React Native)
<TextInput
  style={styles.input}
  placeholderTextColor="#999"
/>

// Styles
const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: '#0066FF',
    padding: 12,
    borderRadius: 8,
  }
});
```

## Configuração do Supabase para Mobile

1. **Instale pacotes necessários:**
```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage
```

2. **Configure no `app.json` ou `.env.local`:**
```json
{
  "supabaseUrl": "your_supabase_url",
  "supabaseKey": "your_anon_key"
}
```

## Testando no Emulador Android

```bash
# Via React Native
npm run android

# Ou via Android Studio
# File > Open > pasta /android
```

## Build para Produção

```bash
# Gerar APK
cd android
./gradlew assembleRelease

# Ou use Android Studio
# Build > Generate Signed Bundle
```

## Recursos Úteis

- [React Native Docs](https://reactnative.dev)
- [Flutter Docs](https://flutter.dev)
- [Supabase Mobile Guide](https://supabase.com/docs/guides/mobile)
- [Material Design 3](https://m3.material.io/)

## Próximos Passos

1. Escolha entre React Native ou Flutter
2. Configure o ambiente Android
3. Adapte os componentes para a plataforma escolhida
4. Implemente testes no emulador
5. Build e deploy na Play Store
