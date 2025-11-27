/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para Google Fonts
  env: {
    NEXT_PUBLIC_GOOGLE_FONTS_TIMEOUT: '60000', // 60 segundos
  },
  // ✅ CORREÇÃO CRÍTICA: Habilitar validações no build
  // Antes: ignoreDuringBuilds: true (PERIGOSO!)
  // Agora: Validar sempre para prevenir bugs em produção
  eslint: {
    ignoreDuringBuilds: false, // ✅ Validar ESLint sempre
    dirs: ['src'], // Validar apenas diretório src
  },
  typescript: {
    ignoreBuildErrors: false, // ✅ Validar TypeScript sempre
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  
  // Otimizações de Build e Bundle
  swcMinify: true, // Usar SWC para minificação (mais rápido)
  compiler: {
    // ✅ SEGURANÇA: Remover TODOS os console.* em produção (exceto console.error)
    removeConsole: process.env.NODE_ENV === 'production' 
      ? {
          exclude: ['error'], // Manter apenas console.error para debugging crítico
        }
      : false,
  },
  
  // Experimental features para melhor performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'], // Tree-shaking otimizado
  },
  
  // ✅ CRÍTICO: Habilitar output standalone para Docker
  output: 'standalone',
  
  // Configurações de bundle
  webpack: (config, { isServer }) => {
    // Otimizar chunks para melhor caching
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendors principais em chunk separado
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // React/Next.js em chunk separado
          react: {
            name: 'react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 30,
          },
          // UI components em chunk separado
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]src[\\/]componentes[\\/]ui[\\/]/,
            priority: 10,
          },
          // Common code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      }
    }
    
    return config
  },
  
  // Security Headers (HTTP-compatible for development)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Enable XSS protection (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // DNS prefetch control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy (disable dangerous features)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // Content Security Policy (CSP) - HTTP-compatible
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https: http:",
              "font-src 'self' data:",
              "connect-src 'self' ws: wss: https: http:",
              "media-src 'self' blob: data:",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
