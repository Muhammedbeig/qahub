export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://softwaretestingbasics.io").replace(/\/$/, "");
export const SITE_NAME = "Software Testing Basics";
export const DEFAULT_SOCIAL_IMAGE = "/images/software-testing-basics/software-testing-foundations.avif";

export function absoluteUrl(value, base = SITE_URL) {
  if (!value) return null;

  try {
    return new URL(String(value), `${base}/`).href;
  } catch {
    return null;
  }
}

export function authorProfilePath(author) {
  return author?.slug ? `/authors/${encodeURIComponent(author.slug)}` : "/";
}

export function authorProfileUrl(author) {
  return absoluteUrl(authorProfilePath(author));
}

export function authorSameAs(author) {
  const socialLinks = author?.social_links && typeof author.social_links === "object"
    ? Object.values(author.social_links)
    : [];

  return [...new Set([author?.website_url, ...socialLinks]
    .map((value) => absoluteUrl(value))
    .filter((value) => value && !value.startsWith(`${SITE_URL}/`)))];
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
