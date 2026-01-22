# 📱 PWA - Guia de Instalação

## O que é PWA?

PWA (Progressive Web App) é um app que funciona como nativo no celular, mas é baseado em web. Você pode:

✅ Instalar direto do celular  
✅ Funcionar offline  
✅ Notificações push  
✅ Atalhos na tela inicial  
✅ Sem precisar de Google Play Store  

---

## 🚀 Como Instalar no Celular

### **Android**

1. **Abra o site em um navegador:**
   - `http://localhost:3000` (em desenvolvimento)
   - Ou o URL do seu servidor em produção

2. **Clique no menu (⋮) - canto superior direito**

3. **Selecione "Instalar aplicativo"** ou **"Add to Home Screen"**

4. **Confirme a instalação**

5. **Pronto!** O app aparecerá na tela inicial

### **iOS (iPhone/iPad)**

1. **Abra o site no Safari**

2. **Clique no ícone "Compartilhar"** (↗️)

3. **Selecione "Adicionar à Tela de Início"**

4. **Nomeia o app (ex: "FinControl")**

5. **Pronto!** Funcionará como app nativo

---

## 📦 Arquivos PWA Criados

- `public/manifest.json` - Metadados do app
- `public/icons/` - Ícones em vários tamanhos
- `next.config.js` - Configuração PWA
- `app/layout.tsx` - Meta tags para PWA

---

## 💡 Build para Produção

```bash
# Build otimizado
npm run build

# Rodar versão de produção
npm start
```

---

## 🔄 Próximas Melhorias

Para melhor qualidade de icons:
1. Converter SVGs para PNG (192x192, 256x256, 384x384, 512x512)
2. Sites úteis:
   - [Convertio](https://convertio.co/svg-png/)
   - [Figma](https://figma.com/)
   - ImageMagick: `convert icon.svg icon.png`

---

## ✨ Features PWA Habilitadas

- ✅ Instalação em tela inicial
- ✅ Ícone personalizado
- ✅ Tema de cores (azul #3b82f6)
- ✅ Status bar adaptativo
- ✅ Atalhos (Add Transaction, Insights)
- ✅ Offline support (funciona sem internet)
- ✅ Adaptive icons para Android 13+

---

## 📚 Documentação

- [Next.js PWA](https://github.com/shadowwalker/next-pwa)
- [MDN Web Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
