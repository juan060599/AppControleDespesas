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
  // output: 'export' foi removido para permitir Route Handlers (API routes)
  // Se precisar de geração estática, use ISR (Incremental Static Regeneration) ou SSG parcial
}

module.exports = withPWA(nextConfig)
