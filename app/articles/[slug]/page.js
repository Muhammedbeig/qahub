import { ARTICLES } from "@/app/data/articles";
import { notFound } from "next/navigation";
import ArticleView from "@/app/components/ArticleView";
import { extractFAQs } from "@/app/lib/extractFAQs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://softwaretestingbasics.io";
const SITE_NAME = "Software Testing Basics";

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.id === slug);
  if (!article) return {};
  const metadataTitle = article.seoTitle || article.title;
  const images = article.heroImage
    ? [{ url: article.heroImage, width: 1672, height: 941, alt: article.title }]
    : undefined;
  return {
    title: metadataTitle,
    description: article.description,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
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
  const article = ARTICLES.find((a) => a.id === slug);
  if (!article) notFound();

  const faqs = extractFAQs(article.sections);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
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
    ...(article.heroImage ? { image: `${SITE_URL}${article.heroImage}` } : {}),
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
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
      <ArticleView article={article} />
    </>
  );
}
