# 📱 Executar no Android Studio - Guia Completo

Como executar a aplicação Next.js no emulador Android usando Android Studio.

## 🎯 Visão Geral

Você pode acessar sua aplicação Next.js rodando localmente no seu computador através do emulador Android usando:
- **IP Local**: `http://10.0.2.2:3000` (dentro do emulador)
- **IP da Rede**: `http://seu-ip-local:3000` (se no mesmo WiFi)

## 📋 Pré-requisitos

### No Computador:
- [ ] Node.js 18+ instalado
- [ ] npm instalado
- [ ] Android Studio instalado
- [ ] Dependências do projeto instaladas (`npm install`)

### No Android Studio:
- [ ] Emulador Android criado (Android 8+)
- [ ] Google Chrome ou outro navegador web instalado no emulador

## 🚀 PASSO 1: Instalar Dependências

```bash
cd C:\Users\juansilva\StudioProjects\AppControleDespesas
npm install
```

## 🚀 PASSO 2: Iniciar o Servidor Next.js

### Opção A: Modo Desenvolvimento (Com hot reload)
```bash
npm run dev
```

Isso iniciará o servidor em:
- **Localhost**: `http://localhost:3000`
- **IP Local da Máquina**: `http://seu-ip-local:3000`

Para encontrar seu IP local, execute:
```bash
ipconfig
```

Procure por "IPv4 Address" na saída. Será algo como `192.168.1.100`

### Opção B: Modo Build
```bash
npm run build
npm start
```

## 🎮 PASSO 3: Configurar Android Studio

### 1. Abrir ou Criar Emulador

1. Abra **Android Studio**
2. Clique em **Device Manager** (lado direito)
3. Clique em **Create Device** (ou use um existente)
4. Selecione um dispositivo (ex: Pixel 6)
5. Clique **Next**
6. Selecione Android versão (recomendado: Android 12+)
7. Clique **Finish**

### 2. Iniciar Emulador

1. Em **Device Manager**, clique no ícone de play ▶️
2. Aguarde o emulador inicializar (1-2 minutos)
3. Verifique que a tela inicial do Android apareceu

## 🌐 PASSO 4: Acessar a Aplicação

### Método 1: IP Especial do Emulador (Recomendado)

O emulador Android tem um IP especial `10.0.2.2` que aponta para o host local.

1. Clique no **Chrome** ou navegador no emulador
2. Na barra de endereços, digite:
   ```
   http://10.0.2.2:3000
   ```
3. Pressione Enter
4. Sua aplicação deve carregar! ✅

### Método 2: IP Local da Máquina

Se o método 1 não funcionar:

1. No **PC**, abra `cmd` ou PowerShell
2. Execute:
   ```bash
   ipconfig
   ```
3. Procure por algo como `192.168.1.100` (seu IP local)
4. No emulador, abra o navegador e acesse:
   ```
   http://192.168.1.100:3000
   ```

⚠️ **Importante**: PC e emulador devem estar na mesma rede WiFi para este método funcionar.

### Método 3: Tunelar pela Porta (Windows)

Se o método 2 não funcionar, use o tunelamento:

```bash
# No PC, abra Command Prompt e execute:
adb reverse tcp:3000 tcp:3000
```

Depois acesse no emulador:
```
http://localhost:3000
```

## ✅ PASSO 5: Testar a Aplicação

1. ✅ Página de login deve carregar
2. ✅ Clique em "Criar conta"
3. ✅ Preencha formulário
4. ✅ Clique "Criar conta"
5. ✅ Faça login
6. ✅ Dashboard deve aparecer
7. ✅ Adicione transações
8. ✅ Gráficos devem aparecer

## 🎮 Dicas do Emulador

### Teclado Virtual
- Pressione `Ctrl + K` para alternância
- Ou use a tecla `tilde (~)` no teclado

### Rotacionar Tela
- Pressione `Ctrl + F12` para rotacionar
- Ou use os botões de rotação no painel lateral

### Fazer Screenshot
- Clique no ícone de câmera no painel lateral
- Ou pressione `Ctrl + S`

### Resetar Emulador
- Clique em "..." > "Wipe Data"
- Emulador reinicia limpo

### Abrir Developer Tools
- Pressione `F12` no Chrome do emulador
- Funciona assim como no PC!

## 🔧 Configurar para Rede WiFi Real

Se você quiser acessar do seu celular real (Android):

### 1. Encontrar IP Local

```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

Procure por IPv4 Address (algo como `192.168.1.100`)

### 2. Configurar Firewall

Abra a porta 3000 no Windows Firewall:
1. Abra **Windows Defender Firewall**
2. Clique **Allow an app through firewall**
3. Clique **Allow another app...**
4. Selecione `node.exe`
5. Clique **Add**

### 3. Acessar do Celular

1. Celular conectado na mesma WiFi
2. Abra navegador
3. Digite: `http://seu-ip-local:3000`
4. Pronto! ✅

## 🐛 Troubleshooting

### "Não consigo acessar 10.0.2.2:3000"

**Solução 1**: Certifique-se que o servidor está rodando
```bash
npm run dev
# Verifique se aparece "ready - started server on 0.0.0.0:3000"
```

**Solução 2**: Tente o IP local
```
http://192.168.1.100:3000
# Substitua pelo seu IP real
```

**Solução 3**: Reinicie o emulador
- Clique "..." > "Cold Boot Now"

### "Connection refused"

Isso significa que a conexão foi recusada. Possíveis causas:

1. **Servidor não está rodando**
   ```bash
   npm run dev
   ```

2. **Firewall bloqueando**
   - Abra porta 3000 no Windows Firewall
   - Veja instruções acima

3. **IP errado**
   - Verifique seu IP local com `ipconfig`
   - Tente `10.0.2.2` primeiro

### "Página não encontra Supabase"

Se vir erro de Supabase:

1. Certifique-se que `.env.local` está correto
2. Reinicie o servidor: `npm run dev`
3. Limpe cache do navegador: `Ctrl + Shift + Delete`

### "Gráficos não aparecem"

1. Abra DevTools (F12 no Chrome)
2. Verifique aba Console
3. Procure por erros vermelhos
4. Adicione uma transação primeiro
5. Atualize a página (F5)

## 🚀 Workflow de Desenvolvimento

### Seu Fluxo de Trabalho:

1. **PC**: Rode `npm run dev`
2. **Emulador**: Acesse `http://10.0.2.2:3000`
3. **VS Code**: Edite código
4. **Emulador**: Atualize página (Ctrl+R ou swipe)
5. **Veja mudanças ao vivo** ✨

### Hot Reload

O Next.js oferece hot reload:
- Edite um componente
- Salve o arquivo
- Atualize o navegador do emulador
- Mudanças aparecem imediatamente

## 📱 Layout Responsivo

A aplicação foi feita responsiva! Teste em:

- **Desktop**: 1920px (navegador do PC)
- **Tablet**: 768px (landscape)
- **Mobile**: 375px (portrait)

Para simular diferentes tamanhos no Chrome:
1. Abra DevTools (F12)
2. Clique em "Toggle device toolbar" (Ctrl+Shift+M)
3. Selecione dispositivo

## 💾 Salvar Dados

Os dados são salvos no **Supabase** automaticamente:
- Logout no emulador
- Abra no PC
- Veja os mesmos dados ✅

## 🔒 Segurança

⚠️ **IMPORTANTE**: O servidor rodando em `npm run dev` é apenas para desenvolvimento!

Para produção:
- Use Vercel ou outro serviço
- Não exponha a porta 3000 na internet
- Configure firewall corretamente

## ⚡ Performance

Se o emulador estiver lento:

1. Aumente a RAM:
   - No AVD Manager, configure 4GB+ de RAM

2. Use processador nativo:
   - Selecione CPU com suporte KVM (Linux) ou HAXM (Windows)

3. Desabilite snapshot:
   - Clique "..." > Boot options > desabilite snapshot

4. Use snapshot para inicialização rápida:
   - Clique "..." > "Save to snapshot"

## 🎓 Próximos Passos

### Para Testar UI:
1. Teste em diferentes tamanhos
2. Verifique botões em mobile
3. Teste scroll em listas
4. Teste gráficos responsivos

### Para Testar Funcionalidade:
1. Crie múltiplas contas
2. Teste permissões (RLS)
3. Teste offline (perde dados)
4. Teste sincronização entre abas

### Para Otimizar:
1. Teste performance
2. Verifique console para erros
3. Otimize imagens
4. Minimize JavaScript

## 🎉 Sucesso!

Parabéns! Agora você pode:
- ✅ Desenvolver localmente
- ✅ Testar no emulador
- ✅ Ver mudanças em tempo real
- ✅ Testar responsividade
- ✅ Debug com DevTools

---

## 📞 Resumo Rápido

**Para rodar rápido:**

1. Terminal 1:
   ```bash
   npm run dev
   ```

2. Android Studio:
   - Abra emulador

3. No Emulador:
   - Chrome: `http://10.0.2.2:3000`
   - Pronto! ✅

---

Dúvidas? Veja troubleshooting acima ou consulte a documentação principal.

Boa sorte! 🚀
