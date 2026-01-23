#!/bin/bash

echo "🔄 Limpando cache..."
rm -rf .next

echo "📦 Building Next.js for export..."
npm run build

echo "🔗 Sincronizando com Capacitor..."
npx cap sync android

echo "📱 Abrindo Android Studio..."
npx cap open android

echo "✅ Pronto! Faça o build do APK no Android Studio"
