import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const person = z.object({
  name: z.string(),
  role: z.string(),
})

const player = z.object({
  name: z.string(),
  number: z.number(),
  position: z.string(),
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
        adult: z.object({
          title: z.string(),
          introduction: z.string(),
          image: z.string(),
          imageAlt: z.string(),
          staff: z.array(person),
          training: z.array(z.string()),
          venue: z.string(),
          players: z.array(player),
        }),
        youth: z.array(z.object({
          ageGroup: z.enum(['U7', 'U9', 'U11', 'U13', 'U16', 'U19']),
          coach: z.string(),
          training: z.array(z.string()),
          description: z.string(),
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
