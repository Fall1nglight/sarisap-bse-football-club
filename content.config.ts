import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const person = z.object({
  name: z.string(),
  role: z.string(),
})

export default defineContentConfig({
  collections: {
    news: defineCollection({
      type: 'page',
      source: 'hirek/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        excerpt: z.string(),
        publishedAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }).optional(),
        category: z.enum(['Felnőtt', 'Utánpótlás', 'Egyesület', 'Közösség']),
        author: z.string(),
        cover: z.string(),
        coverAlt: z.string(),
        featured: z.boolean().default(false),
      }),
    }),
    club: defineCollection({
      type: 'data',
      source: 'data/club.yml',
      schema: z.object({
        name: z.string(),
        shortName: z.string(),
        founded: z.number(),
        introduction: z.string(),
        history: z.string(),
        venue: z.object({ name: z.string(), address: z.string(), mapUrl: z.string() }),
        contacts: z.array(person.extend({ value: z.string(), href: z.string() })),
        socials: z.array(z.object({ name: z.string(), href: z.string() })),
      }),
    }),
    teams: defineCollection({
      type: 'data',
      source: 'data/teams.yml',
      schema: z.object({
        teams: z.array(z.object({
          id: z.number().int().min(0).max(4),
          staff: z.array(person),
          training: z.array(z.string()),
        })),
      }),
    }),
    sponsors: defineCollection({
      type: 'data',
      source: 'data/sponsors.yml',
      schema: z.object({
        sponsors: z.array(z.object({
          name: z.string(), level: z.enum(['Kiemelt', 'Közösségi']), logo: z.string(),
          description: z.string(),
        })),
      }),
    }),
    taoDocuments: defineCollection({
      type: 'data',
      source: 'data/tao.yml',
      schema: z.object({
        documents: z.array(z.object({
          season: z.string(), type: z.string(), date: z.string().date(), file: z.string(),
          fileSize: z.string(),
        })),
      }),
    }),
  },
})
