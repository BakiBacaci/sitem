import { getCollection } from 'astro:content';

/** Taslak olmayan yazılar, en yeni önce. */
export async function publishedPosts() {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
