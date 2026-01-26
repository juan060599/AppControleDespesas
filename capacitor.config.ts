import type { CapacitorConfig } from '@capacitor/cli';

const isDev = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  appId: 'com.fincontrol.app',
  appName: 'FinControl',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Usar localhost em desenvolvimento, Vercel em produção
    url: isDev ? 'http://localhost:3000' : 'https://app-controle-despesas.vercel.app',
    cleartext: isDev,
  },
  android: {
    allowMixedContent: isDev,
    webContentsDebuggingEnabled: isDev,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
