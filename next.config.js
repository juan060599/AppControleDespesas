/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  buildExcludes: [/middleware-manifest.json$/],
})

const nextConfig = {
  reactStrictMode: true,
  // Removido output: 'export' para permitir API routes no Vercel
  // Vercel vai fazer SSG automático das páginas estáticas
}

module.exports = withPWA(nextConfig)
