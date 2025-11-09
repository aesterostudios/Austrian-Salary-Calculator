import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://austriansalary.xyz'
  const lastModified = new Date('2025-01-09')

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
      alternates: {
        languages: {
          en: baseUrl,
          de: baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/faq`,
          de: `${baseUrl}/faq`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2025-01-09'),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/privacy`,
          de: `${baseUrl}/privacy`,
        },
      },
    },
  ]
}
