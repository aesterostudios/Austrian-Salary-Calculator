import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://austriansalary.xyz',
      lastModified: '2025-01-09',
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: 'https://austriansalary.xyz',
          de: 'https://austriansalary.xyz',
        },
      },
    },
    {
      url: 'https://austriansalary.xyz/faq',
      lastModified: '2025-01-09',
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: 'https://austriansalary.xyz/faq',
          de: 'https://austriansalary.xyz/faq',
        },
      },
    },
    {
      url: 'https://austriansalary.xyz/privacy',
      lastModified: '2025-01-09',
      changeFrequency: 'yearly',
      priority: 0.5,
      alternates: {
        languages: {
          en: 'https://austriansalary.xyz/privacy',
          de: 'https://austriansalary.xyz/privacy',
        },
      },
    },
  ]
}
