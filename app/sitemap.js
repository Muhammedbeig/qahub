import { getArticles, getAuthors } from "@/app/lib/cms";
import { SITE_URL } from "@/app/lib/site";

function validDate(value, fallback) {
  const date = new Date(value || fallback);
  return Number.isNaN(date.getTime()) ? new Date(fallback) : date;
}

export default async function sitemap() {
  const [articles, authors] = await Promise.all([getArticles(), getAuthors()]);
  const latestArticleDate = articles.reduce((latest, article) => {
    const candidate = validDate(article.updatedOn || article.publishedAt, "2026-05-30");
    return candidate > latest ? candidate : latest;
  }, new Date("2026-05-30"));

  const articleEntries = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: validDate(article.updatedOn || article.publishedAt, "2026-05-30"),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const authorEntries = authors.map((author) => ({
    url: `${SITE_URL}/authors/${author.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: latestArticleDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...articleEntries,
    ...authorEntries,
  ];
}
