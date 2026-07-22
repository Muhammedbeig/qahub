import { notFound } from "next/navigation";
import ArticleView from "@/app/components/ArticleView";
import { getArticle, getArticles, getSiteSettings } from "@/app/lib/cms";
import {
  absoluteUrl,
  authorProfileUrl,
  authorSameAs,
  DEFAULT_SOCIAL_IMAGE,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
} from "@/app/lib/site";

export const revalidate = 0;

function cleanText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function uniquePeople(people) {
  const seen = new Set();
  return people.filter((person) => {
    if (!person?.name) return false;
    const key = person.slug || person.id || person.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function personId(person) {
  return `${authorProfileUrl(person)}#person`;
}

function personReference(person) {
  return { "@id": personId(person) };
}

function personNode(person) {
  const sameAs = authorSameAs(person);
  const image = absoluteUrl(person.avatar_url || person.avatar);

  return {
    "@type": "Person",
    "@id": personId(person),
    name: person.name,
    url: authorProfileUrl(person),
    ...(person.role ? { jobTitle: person.role } : {}),
    ...(person.bio ? { description: cleanText(person.bio) } : {}),
    ...(image ? { image } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([getArticle(slug), getSiteSettings()]);
  if (!article) return {};

  const metadataTitle = article.seoTitle || article.title;
  const canonical = `${SITE_URL}/articles/${encodeURIComponent(slug)}`;
  const heroImage = absoluteUrl(article.heroImage || settings.defaultThumbnail || DEFAULT_SOCIAL_IMAGE);
  const images = heroImage
    ? [{ url: heroImage, width: 1672, height: 941, alt: article.title }]
    : undefined;
  const authors = uniquePeople([article.author, ...(article.additionalAuthors || [])]);
  const publishedAt = isoDate(article.publishedAt);
  const modifiedAt = isoDate(article.updatedOn);

  return {
    title: metadataTitle,
    description: article.description,
    authors: authors.length
      ? authors.map((author) => ({ name: author.name, url: authorProfileUrl(author) }))
      : [{ name: SITE_NAME, url: SITE_URL }],
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: metadataTitle,
      description: article.description,
      images,
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(modifiedAt ? { modifiedTime: modifiedAt } : {}),
      ...(authors.length ? { authors: authors.map(authorProfileUrl) } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: article.description,
      creator: "@swtestingbasics",
      images: heroImage ? [heroImage] : undefined,
    },
  };
}

export default async function ArticlePageRoute({ params }) {
  const { slug } = await params;
  const [article, articles, settings] = await Promise.all([getArticle(slug), getArticles(), getSiteSettings()]);
  if (!article) notFound();

  const pageUrl = `${SITE_URL}/articles/${encodeURIComponent(slug)}`;
  const articleId = `${pageUrl}#article`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const heroImage = absoluteUrl(article.heroImage || settings.defaultThumbnail || DEFAULT_SOCIAL_IMAGE);
  const publishedAt = isoDate(article.publishedAt);
  const modifiedAt = isoDate(article.updatedOn) || publishedAt;
  const authors = uniquePeople([article.author, ...(article.additionalAuthors || [])]);
  const reviewers = uniquePeople(article.reviewers || []);
  const editors = uniquePeople(article.editors || []);
  const people = uniquePeople([...authors, ...reviewers, ...editors, article.updatedBy]);
  const minutes = Number.parseInt(article.readTime, 10);
  const wordCount = cleanText(article.content).split(/\s+/).filter(Boolean).length;

  const articleGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: article.title,
        description: article.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": articleId },
        ...(reviewers.length ? { reviewedBy: reviewers.map(personReference) } : {}),
        ...(publishedAt ? { datePublished: publishedAt } : {}),
        ...(modifiedAt ? { dateModified: modifiedAt } : {}),
      },
      {
        "@type": "Article",
        "@id": articleId,
        url: pageUrl,
        headline: article.title,
        description: article.description,
        mainEntityOfPage: { "@id": pageUrl },
        publisher: { "@id": `${SITE_URL}/#organization` },
        author: authors.length
          ? authors.map(personReference)
          : [{ "@type": "Organization", "@id": `${SITE_URL}/#organization` }],
        ...(editors.length ? { editor: editors.map(personReference) } : {}),
        ...(article.updatedBy ? { contributor: personReference(article.updatedBy) } : {}),
        ...(heroImage ? {
          image: {
            "@type": "ImageObject",
            url: heroImage,
            contentUrl: heroImage,
            width: 1672,
            height: 941,
          },
          thumbnailUrl: heroImage,
        } : {}),
        ...(publishedAt ? { datePublished: publishedAt } : {}),
        ...(modifiedAt ? { dateModified: modifiedAt } : {}),
        ...(article.cat ? { articleSection: article.cat } : {}),
        ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
        ...(wordCount ? { wordCount } : {}),
        ...(Number.isFinite(minutes) ? { timeRequired: `PT${minutes}M` } : {}),
        inLanguage: "en",
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: article.title, item: pageUrl },
        ],
      },
      ...people.map(personNode),
    ],
  };

  const schemaFaqs = (article.faqs || []).filter((faq) => faq.includeInSchema !== false);
  const faqJsonLd = schemaFaqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        url: pageUrl,
        isPartOf: { "@id": pageUrl },
        mainEntity: schemaFaqs.map((faq) => ({
          "@type": "Question",
          name: cleanText(faq.schemaQuestion || faq.question),
          acceptedAnswer: {
            "@type": "Answer",
            text: cleanText(faq.schemaAnswer || faq.answer),
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleGraph) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      )}
      <ArticleView article={article} articles={articles} />
    </>
  );
}
