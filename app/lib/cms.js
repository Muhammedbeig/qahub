import "server-only";

import snapshot from "@/app/data/cms-articles.json";

const SITE_ACCENT = "#00F4C8";
const PRODUCTION_CMS_API = "https://panel.softwaretestingbasics.io/api";
const FETCH_TIMEOUT_MS = Number(process.env.CMS_FETCH_TIMEOUT_MS || 5000);
const REVALIDATE_SECONDS = Number(process.env.CMS_REVALIDATE_SECONDS || 60);
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
        signal: controller.signal,
        next: {
          revalidate: Number.isFinite(REVALIDATE_SECONDS) ? REVALIDATE_SECONDS : 60,
          tags: ["software-testing-cms"],
        },
      });
      if (!response.ok) continue;
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
  const content = String(rawHtml || "").replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attributes, innerHtml) => {
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
    avatar_url: author.avatar_url || null,
    website_url: author.website_url || null,
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

function normalizeArticle(raw, includeContent = false, index = 0) {
  const fallback = fallbackFor(raw);
  const slug = raw.slug || raw.id || fallback.slug;
  const category = raw.categoryTitle || raw.category || raw.tag || raw.cat || fallback.cat || "Fundamentals";
  const accent = raw.accent || raw.accent_color || raw.catColor || fallback.catColor || SITE_ACCENT;
  const sortOrder = Number(raw.sortOrder ?? raw.sort_order ?? fallback.sortOrder ?? index + 1);
  const rawContent = raw.content || raw.descriptionHtml || fallback.content || "";
  const prepared = includeContent ? prepareContent(rawContent) : { content: "", toc: [] };

  return {
    id: slug,
    slug,
    cat: category,
    catColor: accent,
    catBg: raw.catBg || fallback.catBg || `${accent}14`,
    iconName: raw.iconName || fallback.iconName || "BookOpen",
    iconColor: raw.iconColor || fallback.iconColor || accent,
    num: String(Number.isFinite(sortOrder) ? sortOrder : index + 1).padStart(2, "0"),
    sortOrder,
    title: raw.title || fallback.title || "Untitled article",
    cardTitle: raw.cardTitle || fallback.cardTitle || raw.title || fallback.title,
    subtitle: decodeText(raw.subtitle || raw.excerpt || fallback.subtitle || fallback.description),
    description: decodeText(raw.metaDescription || raw.meta_description || raw.descriptionText || raw.excerpt || fallback.description),
    seoTitle: raw.metaTitle || raw.meta_title || raw.seoTitle || fallback.seoTitle || raw.title || fallback.title,
    readTime: raw.readTime || raw.read_time || fallback.readTime || "5 min",
    tags: Array.isArray(raw.tags) && raw.tags.length ? raw.tags : (fallback.tags || [category]),
    toc: includeContent ? (prepared.toc.length ? prepared.toc : (raw.toc || fallback.toc || [])) : [],
    heroImage: raw.image || raw.heroImage || fallback.heroImage || null,
    content: prepared.content,
    faqs: includeContent ? normalizeFaqs(raw.faqs?.length ? raw.faqs : fallback.faqs) : [],
    date: raw.date || fallback.date || "",
    publishedAt: raw.publishedAt || raw.published_at || fallback.publishedAt || null,
    updatedOn: raw.updatedOn || raw.updated_on || fallback.updatedOn || null,
    isFeatured: Boolean(raw.isFeatured ?? raw.featured ?? fallback.isFeatured),
    author: normalizeAuthor(raw.author || fallback.author),
    updatedBy: normalizeAuthor(raw.updatedBy || raw.updated_by || fallback.updatedBy),
    additionalAuthors: (raw.additionalAuthors || raw.additional_authors || fallback.additionalAuthors || []).map(normalizeAuthor).filter(Boolean),
    reviewers: (raw.reviewers || fallback.reviewers || []).map(normalizeAuthor).filter(Boolean),
    editors: (raw.editors || fallback.editors || []).map(normalizeAuthor).filter(Boolean),
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
  return source
    .map((article, index) => normalizeArticle(article, false, index))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function getArticle(slug) {
  const response = await fetchCms(`/site/blogs/${encodeURIComponent(slug)}`);
  if (response?.data) return normalizeArticle(response.data, true);

  const fallback = snapshotBySlug.get(slug);
  return fallback ? normalizeArticle(fallback, true) : null;
}

export function getSnapshotArticleCount() {
  return snapshot.articles.length;
}
