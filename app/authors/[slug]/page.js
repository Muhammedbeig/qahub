import { notFound } from "next/navigation";
import AuthorProfile from "@/app/components/author/AuthorProfile";
import { getAuthor, getAuthors } from "@/app/lib/cms";
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

function descriptionFor(author) {
  return author.bio || author.role || `Read articles by ${author.name} on ${SITE_NAME}.`;
}

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return {};

  const canonical = authorProfileUrl(author);
  const description = descriptionFor(author);
  const image = absoluteUrl(author.avatar_url || author.avatar || DEFAULT_SOCIAL_IMAGE);

  return {
    title: author.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: `${author.name} | ${SITE_NAME}`,
      description,
      images: image ? [{ url: image, alt: author.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${author.name} | ${SITE_NAME}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const profileUrl = authorProfileUrl(author);
  const personId = `${profileUrl}#person`;
  const sameAs = authorSameAs(author);
  const image = absoluteUrl(author.avatar_url || author.avatar);
  const modifiedAt = author.updatedAt && !Number.isNaN(new Date(author.updatedAt).getTime())
    ? new Date(author.updatedAt).toISOString()
    : null;

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": profileUrl,
        url: profileUrl,
        name: `${author.name} | ${SITE_NAME}`,
        mainEntity: { "@id": personId },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${profileUrl}#breadcrumb` },
        ...(modifiedAt ? { dateModified: modifiedAt } : {}),
      },
      {
        "@type": "Person",
        "@id": personId,
        identifier: String(author.id || author.slug),
        name: author.name,
        url: profileUrl,
        ...(author.role ? { jobTitle: author.role } : {}),
        ...(author.bio ? { description: author.bio } : {}),
        ...(image ? { image } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${profileUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: author.name, item: profileUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(profileJsonLd) }}
      />
      <AuthorProfile author={author} />
    </>
  );
}
