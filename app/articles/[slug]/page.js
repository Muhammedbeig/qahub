import { notFound } from "next/navigation";
import ArticleView from "@/app/components/ArticleView";
import { getArticle, getArticles } from "@/app/lib/cms";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://softwaretestingbasics.io";
const SITE_NAME = "Software Testing Basics";

export const revalidate = 0;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  const metadataTitle = article.seoTitle || article.title;
  const images = article.heroImage
    ? [{ url: article.heroImage, width: 1672, height: 941, alt: article.title }]
    : undefined;
  return {
    title: metadataTitle,
    description: article.description,
    authors: article.author
      ? [{ name: article.author.name, url: article.author.website_url || SITE_URL }]
      : [{ name: SITE_NAME, url: SITE_URL }],
    alternates: { canonical: `${SITE_URL}/articles/${slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/articles/${slug}`,
      siteName: SITE_NAME,
      title: metadataTitle,
      description: article.description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: article.description,
      creator: "@swtestingbasics",
      images,
    },
  };
}

export default async function ArticlePageRoute({ params }) {
  const { slug } = await params;
  const [article, articles] = await Promise.all([getArticle(slug), getArticles()]);
  if (!article) notFound();

  const faqs = article.faqs || [];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.name,
          url: article.author.website_url || SITE_URL,
        }
      : { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
    url: `${SITE_URL}/articles/${slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/articles/${slug}` },
    inLanguage: "en",
    isAccessibleForFree: true,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedOn ? { dateModified: article.updatedOn } : {}),
    ...(article.heroImage ? { image: `${SITE_URL}${article.heroImage}` } : {}),
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.filter((faq) => faq.includeInSchema !== false).map((faq) => ({
            "@type": "Question",
            name: faq.schemaQuestion || faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.schemaAnswer || faq.answer.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ArticleView article={article} articles={articles} />
    </>
  );
}
