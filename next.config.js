/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'production',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  buildExcludes: [/middleware-manifest.json$/],
  fallbacks: {
    document: '/',
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*.supabase.co/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-cache',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60,
        },
      },
    },
  ],
})

const nextConfig = {
  reactStrictMode: true,
  // Removido output: 'export' para permitir API routes no Vercel
  // Vercel vai fazer SSG automático das páginas estáticas
}

module.exports = withPWA(nextConfig)
