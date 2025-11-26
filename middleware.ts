/**
 * Middleware Global do Next.js
 * CORS, Security Headers e Rate Limiting
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Origens permitidas (configurar conforme necessário)
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'https://vipassist.com.br',
  'https://www.vipassist.com.br',
]

// Rotas públicas (sem autenticação)
const PUBLIC_ROUTES = [
  '/api/auth',
  '/entrar',
  '/corrida',
]

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  
  // 1. CORS Headers
  const response = NextResponse.next()
  
  // Verificar origem
  const requestOrigin = request.headers.get('origin') || origin
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(requestOrigin) || 
                          process.env.NODE_ENV === 'development'
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin)
  }
  
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Max-Age', '86400') // 24 horas
  
  // 2. Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
  
  // 3. Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://maps.googleapis.com",
    "frame-src 'self'",
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // 4. Handle OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    })
  }
  
  return response
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
