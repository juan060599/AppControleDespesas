import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FinControl - Controle de Despesas',
  description: 'App inteligente para controle de despesas pessoais com análises avançadas e insights financeiros',
  icons: {
    icon: '/icons/icon-192x192.svg',
    apple: '/icons/icon-192x192.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FinControl',
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FinControl" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, user-scalable=yes, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon-192x192.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (document.documentElement) {
                document.documentElement.style.width = '100vw';
                document.documentElement.style.height = '100vh';
                document.documentElement.style.margin = '0';
                document.documentElement.style.padding = '0';
              }
              if (document.body) {
                document.body.style.width = '100%';
                document.body.style.height = '100%';
                document.body.style.margin = '0';
                document.body.style.padding = '0';
                document.body.style.overflowX = 'hidden';
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
