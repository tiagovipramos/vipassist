import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kortex.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/painel',
          '/conversas',
          '/tickets',
          '/atendentes',
          '/crm',
          '/campanhas',
          '/relatorios',
          '/equipe',
          '/ia',
          '/canais',
          '/pagamentos',
          '/suporte',
          '/inbox',
          '/chat',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
