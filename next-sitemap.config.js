module.exports = {
  siteUrl: 'https://setube.garcessebastian.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 1.0,
  sitemapSize: 7000,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/']
      }
    ]
  },
  robotsTxt: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/']
      }
    ],
    sitemap: 'https://setube.garcessebastian.com/sitemap.xml',
    host: 'https://setube.garcessebastian.com'
  },
  exclude: [
    '/admin/**',
    '/api/**',
    '/private/**'
  ],
  generateIndexSitemap: true,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/']
      }
    ]
  }
}
