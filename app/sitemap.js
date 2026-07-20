import { getArticles } from "@/app/lib/cms";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://softwaretestingbasics.io';
  const articles = await getArticles();

  const articleEntries = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updatedOn || article.publishedAt || '2026-05-30'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-07-17'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...articleEntries,
  ];
}
