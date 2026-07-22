import "server-only";

import snapshot from "@/app/data/cms-articles.json";

const SITE_ACCENT = "#00F4C8";
const PRODUCTION_CMS_API = "https://panel.softwaretestingbasics.io/api";
const FETCH_TIMEOUT_MS = Number(process.env.CMS_FETCH_TIMEOUT_MS || 3000);
let activeCmsOrigin = null;
const snapshotBySlug = new Map(snapshot.articles.flatMap((article) => [
  [article.slug, article],
  ...(article.sourceSlug && article.sourceSlug !== article.slug ? [[article.sourceSlug, article]] : []),
]));

function cmsBases() {
  return [...new Set([
    process.env.CMS_API_URL,
    process.env.NEXT_PUBLIC_CMS_API_URL,
    process.env.NODE_ENV === "production" ? PRODUCTION_CMS_API : null,
  ].filter(Boolean).map((base) => base.trim().replace(/\/$/, "")))];
}

async function fetchCms(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  for (const base of cmsBases()) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(`${base}${normalizedPath}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "softwaretestingbasics-website/1.0",
        },
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) continue;
      activeCmsOrigin = new URL(base).origin;
      return await response.json();
    } catch {
      // The generated snapshot keeps the site available while the CMS is offline.
    } finally {
      clearTimeout(timeout);
    }
  }

  return null;
}

function decodeText(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cmsAssetOrigin() {
  const configured = process.env.CMS_ASSET_URL
    || process.env.NEXT_PUBLIC_CMS_ASSET_URL
    || activeCmsOrigin
    || cmsBases()[0]
    || PRODUCTION_CMS_API;

  try {
    return new URL(configured).origin;
  } catch {
    return new URL(PRODUCTION_CMS_API).origin;
  }
}

function normalizeCmsAssetUrl(value) {
  const source = String(value || "").trim();
  if (!source) return source;
  if (/^(?:https?:)?\/\//i.test(source) || /^(?:data|blob):/i.test(source)) return source;

  const storagePath = source.match(/^(?:\.\.\/|\.\/)*\/?storage\/(.+)$/i);
  if (storagePath) return `${cmsAssetOrigin()}/storage/${storagePath[1]}`;

  return source;
}

function normalizeContentAssets(rawHtml) {
  return String(rawHtml || "").replace(
    /(<(?:img|source)\b[^>]*?\s(?:src|srcset)=)(["'])(.*?)\2/gi,
    (match, prefix, quote, value) => {
      const isSourceSet = /srcset\s*=$/i.test(prefix);
      const normalized = isSourceSet
        ? value.split(",").map((candidate) => {
            const parts = candidate.trim().split(/\s+/);
            const url = normalizeCmsAssetUrl(parts.shift());
            return [url, ...parts].filter(Boolean).join(" ");
          }).join(", ")
        : normalizeCmsAssetUrl(value);
      return `${prefix}${quote}${normalized}${quote}`;
    },
  );
}

function formatArticleDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function slugify(value) {
  return decodeText(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function prepareContent(rawHtml) {
  const toc = [];
  const used = new Map();
  const content = normalizeContentAssets(rawHtml).replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attributes, innerHtml) => {
    const text = decodeText(innerHtml);
    const base = slugify(text) || "section";
    const count = (used.get(base) || 0) + 1;
    used.set(base, count);
    const generatedId = count === 1 ? base : `${base}-${count}`;
    const existingId = attributes.match(/\sid=(['"])(.*?)\1/i)?.[2];
    const id = existingId || generatedId;
    const cleanAttributes = attributes.replace(/\sid=(['"]).*?\1/i, "");
    toc.push(text);
    return `<h2${cleanAttributes} id="${id}">${innerHtml}</h2>`;
  });

  return { content, toc };
}

function normalizeAuthor(author) {
  if (!author || typeof author !== "object") return null;
  return {
    id: author.id,
    name: author.name || "Software Testing Basics",
    slug: author.slug || "software-testing-basics-team",
    role: author.role || "Editorial Team",
    bio: author.bio || "",
    avatar: author.avatar || null,
    avatar_url: normalizeCmsAssetUrl(author.avatar_url || author.avatar) || null,
    website_url: author.website_url || null,
    social_links: author.social_links && typeof author.social_links === "object" ? author.social_links : {},
  };
}

function normalizeFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .filter((faq) => faq?.question && faq?.answer)
    .map((faq, index) => ({
      question: faq.question,
      answer: faq.answer,
      sortOrder: Number(faq.sortOrder ?? faq.sort_order ?? index),
      includeInSchema: faq.includeInSchema ?? faq.include_in_schema ?? true,
      schemaQuestion: faq.schemaQuestion ?? faq.schema_question ?? null,
      schemaAnswer: faq.schemaAnswer ?? faq.schema_answer ?? null,
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

function fallbackFor(raw) {
  const slug = raw?.slug || raw?.id || "";
  return snapshotBySlug.get(slug) || {};
}

function normalizeArticle(raw, includeContent = false, index = 0, useSnapshotFallback = true) {
  const snapshotFallback = fallbackFor(raw);
  const fallback = useSnapshotFallback ? snapshotFallback : {};
  const slug = raw.slug || raw.id || fallback.slug;
  const category = raw.categoryTitle || raw.category || raw.tag || raw.cat || fallback.cat || "Fundamentals";
  const accent = raw.accent || raw.accent_color || raw.catColor || fallback.catColor || SITE_ACCENT;
  const sortOrder = Number(raw.sortOrder ?? raw.sort_order ?? fallback.sortOrder ?? index + 1);
  const rawContent = raw.content ?? raw.descriptionHtml ?? fallback.content ?? "";
  const prepared = includeContent ? prepareContent(rawContent) : { content: "", toc: [] };
  const heroImage = raw.image !== undefined
    ? raw.image
    : (raw.heroImage !== undefined ? raw.heroImage : fallback.heroImage);
  const author = raw.author !== undefined ? raw.author : fallback.author;
  const updatedBy = raw.updatedBy !== undefined
    ? raw.updatedBy
    : (raw.updated_by !== undefined ? raw.updated_by : fallback.updatedBy);
  const additionalAuthors = raw.additionalAuthors !== undefined
    ? raw.additionalAuthors
    : (raw.additional_authors !== undefined ? raw.additional_authors : fallback.additionalAuthors);
  const reviewers = raw.reviewers !== undefined ? raw.reviewers : fallback.reviewers;
  const editors = raw.editors !== undefined ? raw.editors : fallback.editors;
  const tags = Array.isArray(raw.tags) ? raw.tags : (fallback.tags || [category]);
  const publishedAt = raw.publishedAt ?? raw.published_at ?? raw.date ?? fallback.publishedAt ?? null;
  const updatedOn = raw.updatedOnIso
    ?? raw.updated_on_iso
    ?? raw.updatedOn
    ?? raw.updated_on
    ?? raw.updatedAt
    ?? fallback.updatedOn
    ?? null;

  return {
    id: slug,
    slug,
    cat: category,
    catColor: accent,
    catBg: raw.catBg || snapshotFallback.catBg || `${accent}14`,
    iconName: raw.iconName || snapshotFallback.iconName || "BookOpen",
    iconColor: raw.iconColor || snapshotFallback.iconColor || accent,
    num: String(Number.isFinite(sortOrder) ? sortOrder : index + 1).padStart(2, "0"),
    sortOrder,
    title: raw.title ?? fallback.title ?? "Untitled article",
    cardTitle: raw.cardTitle ?? raw.card_title ?? raw.title ?? fallback.cardTitle ?? fallback.title,
    subtitle: decodeText(raw.subtitle ?? raw.excerpt ?? fallback.subtitle ?? fallback.description),
    description: decodeText(raw.metaDescription ?? raw.meta_description ?? raw.descriptionText ?? raw.excerpt ?? fallback.description),
    seoTitle: raw.metaTitle ?? raw.meta_title ?? raw.seoTitle ?? raw.title ?? fallback.seoTitle ?? fallback.title,
    readTime: raw.readTime ?? raw.read_time ?? fallback.readTime ?? "5 min",
    tags,
    toc: includeContent ? (prepared.toc.length ? prepared.toc : (raw.toc || fallback.toc || [])) : [],
    heroImage: normalizeCmsAssetUrl(heroImage) || null,
    content: prepared.content,
    faqs: includeContent ? normalizeFaqs(Array.isArray(raw.faqs) ? raw.faqs : fallback.faqs) : [],
    date: raw.date ?? fallback.date ?? "",
    publishedAt,
    publishedLabel: formatArticleDate(publishedAt),
    updatedOn,
    updatedLabel: formatArticleDate(updatedOn),
    isFeatured: Boolean(raw.isFeatured ?? raw.featured ?? fallback.isFeatured),
    author: normalizeAuthor(author),
    updatedBy: normalizeAuthor(updatedBy),
    additionalAuthors: (additionalAuthors || []).map(normalizeAuthor).filter(Boolean),
    reviewers: (reviewers || []).map(normalizeAuthor).filter(Boolean),
    editors: (editors || []).map(normalizeAuthor).filter(Boolean),
  };
}

function responseCollection(response) {
  const payload = response?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export async function getArticles() {
  const response = await fetchCms("/site/blogs?per_page=50");
  const cmsArticles = responseCollection(response);
  const source = cmsArticles.length ? cmsArticles : snapshot.articles;
  const useSnapshotFallback = !cmsArticles.length;
  return source
    .map((article, index) => normalizeArticle(article, false, index, useSnapshotFallback))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function getArticle(slug) {
  const response = await fetchCms(`/site/blogs/${encodeURIComponent(slug)}`);
  if (response?.data) return normalizeArticle(response.data, true, 0, false);

  const fallback = snapshotBySlug.get(slug);
  return fallback ? normalizeArticle(fallback, true) : null;
}

export async function getAuthors() {
  const response = await fetchCms("/site/authors");
  const authors = responseCollection(response);
  return authors.map(normalizeAuthor).filter(Boolean);
}

export async function getAuthor(slug) {
  const response = await fetchCms(`/site/authors/${encodeURIComponent(slug)}`);
  if (!response?.data) return null;

  const author = normalizeAuthor(response.data);
  return {
    ...author,
    bio: response.data.bio || author.bio,
    updatedAt: response.data.updated_at || null,
    articles: Array.isArray(response.data.articles)
      ? response.data.articles.map((article, index) => normalizeArticle(article, false, index, false))
      : [],
  };
}

export async function getSiteSettings() {
  const response = await fetchCms("/site/settings");
  const settings = response?.data || {};

  return {
    brandName: settings.brand_name || "Software Testing Basics",
    siteUrl: settings.site_url || "https://softwaretestingbasics.io",
    defaultThumbnail: normalizeCmsAssetUrl(settings.default_thumbnail) || null,
  };
}

export function getSnapshotArticleCount() {
  return snapshot.articles.length;
}
