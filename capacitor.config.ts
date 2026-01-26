import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fincontrol.app',
  appName: 'FinControl',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Usar a URL do Vercel em produção
    url: 'https://app-controle-despesas.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
