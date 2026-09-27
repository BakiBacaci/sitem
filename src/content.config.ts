import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    /** Başlığın dili; verilmezse Latin harfli adlar İngilizce sayılır (büyük harfte i → I). */
    lang: z.enum(['tr', 'en']).optional(),
    kind: z.string(),
    summary: z.string(),
    facts: z.array(z.string()),
    tech: z.array(z.string()),
    order: z.number(),
    featured: z.boolean(),
    cover: z.string().optional(),
    shots: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { works, posts };
