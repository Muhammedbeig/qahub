import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ARTICLES } from "../app/data/articles.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const panelDirectory = "C:\\xampp\\htdocs\\softtestpanel";

const markdownOverrides = new Map([
  [
    "testing-tools-frameworks",
    "C:\\Users\\Muham\\Downloads\\Software Testing Basics\\testing frameworks and tools\\testing frameworks and tools.md",
  ],
  [
    "types-of-software-testing",
    "C:\\Users\\Muham\\Downloads\\Software Testing Basics\\types of software testing\\types of software testng.md",
  ],
]);

const authors = {
  primary: {
    id: 1,
    name: "Muhammad Baig",
    slug: "muhammad-baig",
    role: "Software Engineer & Technical Reviewer",
    bio: "Muhammad Baig is a software engineer who reviews testing guidance, automation examples, technical claims, and practical QA workflows for correctness and reproducibility.",
    avatar: null,
    avatar_url: null,
  },
  reviewer: {
    id: 2,
    name: "Imdad Ullah Khan, Ph.D.",
    slug: "imdad-ullah-khan-phd",
    role: "Data Science & ML Researcher | Content Evaluator & Approver",
    bio: "Imdad Ullah Khan holds a Ph.D. in Computer Science from Rutgers University and evaluates technical material for accuracy, depth, methodological soundness, and intellectual honesty.",
    avatar: null,
    avatar_url: null,
  },
  editor: {
    id: 3,
    name: "Muhammad Furquan",
    slug: "muhammad-furquan",
    role: "Legal & Compliance Reviewer",
    bio: "Muhammad Furquan is a qualified barrister who reviews published material for copyright, compliance, consumer-protection, and digital-publishing concerns.",
    avatar: null,
    avatar_url: null,
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function renderInline(value) {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function uniqueHeadingId(text, headingIds) {
  const base = slugify(text) || "section";
  const count = (headingIds.get(base) ?? 0) + 1;
  headingIds.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
}

function renderSections(sections) {
  const headingIds = new Map();

  return sections.map((section) => {
    switch (section.type) {
      case "lead":
        return `<p class="article-lead">${renderInline(section.text)}</p>`;
      case "h2":
      case "h3":
      case "h4": {
        const level = section.type.slice(1);
        const id = uniqueHeadingId(section.text, headingIds);
        return `<h${level} id="${id}">${escapeHtml(section.text)}</h${level}>`;
      }
      case "p":
        return `<p>${renderInline(section.text)}</p>`;
      case "ul":
      case "ol":
        return `<${section.type}>${(section.items ?? []).map((item) => `<li>${renderInline(item)}</li>`).join("")}</${section.type}>`;
      case "code":
        return `<pre><code class="language-${escapeHtml(section.language || "text")}">${escapeHtml(section.code)}</code></pre>`;
      case "table":
        return `<div class="table-scroll"><table><thead><tr>${(section.headers ?? []).map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead><tbody>${(section.rows ?? []).map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      case "image":
        return `<figure class="article-figure"><img src="${escapeHtml(section.src)}" alt="${escapeHtml(section.alt)}" width="${Number(section.width) || 1672}" height="${Number(section.height) || 941}" loading="lazy">${section.caption ? `<figcaption>${renderInline(section.caption)}</figcaption>` : ""}</figure>`;
      case "callout":
        return `<aside class="callout callout-${escapeHtml(section.variant || "info")}"><div class="callout-body"><strong>${escapeHtml(section.title || "Note")}</strong><p>${renderInline(section.text)}</p></div></aside>`;
      default:
        return "";
    }
  }).join("\n");
}

function isTableDivider(line) {
  return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(line);
}

function tableCells(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function startsBlock(lines, index) {
  const line = lines[index] ?? "";
  const next = lines[index + 1] ?? "";
  return /^#{2,4}\s+/.test(line)
    || /^```/.test(line)
    || /^>\s?/.test(line)
    || /^[-*]\s+/.test(line)
    || /^\d+\.\s+/.test(line)
    || (line.trim().startsWith("|") && isTableDivider(next));
}

function markdownBodyToHtml(lines) {
  const html = [];
  const headingIds = new Map();

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      html.push(`<h${level} id="${uniqueHeadingId(text, headingIds)}">${renderInline(text)}</h${level}>`);
      index += 1;
      continue;
    }

    const fence = line.match(/^```\s*([\w-]+)?\s*$/);
    if (fence) {
      const code = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      html.push(`<pre><code class="language-${escapeHtml(fence[1] || "text")}">${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    if (line.trim().startsWith("|") && isTableDivider(lines[index + 1] ?? "")) {
      const headers = tableCells(line);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      html.push(`<div class="table-scroll"><table><thead><tr>${headers.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const pattern = ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;
      const items = [];
      while (index < lines.length) {
        const match = lines[index].match(pattern);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      const tag = ordered ? "ol" : "ul";
      html.push(`<${tag}>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${tag}>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote><p>${renderInline(quote.join(" "))}</p></blockquote>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !startsBlock(lines, index)) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
  }

  return html.join("\n");
}

function extractMarkdownFaqs(lines) {
  const faqStart = lines.findIndex((line) => /^##\s+Frequently Asked Questions\s*$/i.test(line.trim()));
  if (faqStart < 0) return [];

  const faqs = [];
  for (let index = faqStart + 1; index < lines.length;) {
    if (/^##\s+/.test(lines[index])) break;
    const question = lines[index].match(/^###\s+(.+)$/);
    if (!question) {
      index += 1;
      continue;
    }

    const answerLines = [];
    index += 1;
    while (index < lines.length && !/^#{2,3}\s+/.test(lines[index])) {
      answerLines.push(lines[index]);
      index += 1;
    }
    faqs.push({
      question: question[1].trim(),
      answer: markdownBodyToHtml(answerLines),
      sortOrder: faqs.length,
      includeInSchema: true,
    });
  }
  return faqs;
}

function markdownArticle(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const metadata = {};

  for (const line of lines.slice(0, 12)) {
    const match = line.match(/^(SEO Title|Meta Description|URL Slug|Suggested Schema):\s*(.+)$/i);
    if (match) metadata[match[1].toLowerCase()] = match[2].trim();
  }

  const titleIndex = lines.findIndex((line) => /^#\s+/.test(line));
  if (titleIndex < 0) throw new Error(`No H1 title found in ${filePath}`);
  const title = lines[titleIndex].replace(/^#\s+/, "").trim();
  const bodyLines = lines.slice(titleIndex + 1);
  const content = markdownBodyToHtml(bodyLines);
  const toc = bodyLines
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, "").trim());

  return {
    title,
    seoTitle: metadata["seo title"] || title,
    description: metadata["meta description"] || "",
    subtitle: metadata["meta description"] || "",
    sourceSlug: metadata["url slug"]?.replace(/^\//, "").replace(/\/$/, ""),
    content,
    toc,
    faqs: extractMarkdownFaqs(bodyLines),
  };
}

function sectionFaqs(sections) {
  const faqStart = sections.findIndex((section) => section.type === "h2" && /frequently asked questions/i.test(section.text));
  if (faqStart < 0) return [];

  const faqs = [];
  for (let index = faqStart + 1; index < sections.length;) {
    if (sections[index].type === "h2") break;
    if (sections[index].type !== "h3") {
      index += 1;
      continue;
    }
    const question = sections[index].text;
    const answers = [];
    index += 1;
    while (index < sections.length && !["h2", "h3"].includes(sections[index].type)) {
      answers.push(sections[index]);
      index += 1;
    }
    faqs.push({
      question,
      answer: renderSections(answers),
      sortOrder: faqs.length,
      includeInSchema: true,
    });
  }
  return faqs;
}

function wordCount(html) {
  return html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
}

function articleRecord(article) {
  const overridePath = markdownOverrides.get(article.id);
  const override = overridePath ? markdownArticle(overridePath) : null;
  const content = override?.content || renderSections(article.sections ?? []);
  const title = override?.title || article.title;
  const description = override?.description || article.description || article.subtitle;

  return {
    id: article.id,
    slug: article.id,
    sourceSlug: override?.sourceSlug || article.id,
    cat: article.cat,
    catColor: article.catColor,
    catBg: article.catBg,
    iconName: article.iconName,
    iconColor: article.iconColor,
    num: article.num,
    sortOrder: Number.parseInt(article.num, 10) || 0,
    title,
    cardTitle: override ? title : (article.cardTitle || title),
    subtitle: override?.subtitle || article.subtitle || description,
    description,
    seoTitle: override?.seoTitle || article.seoTitle || title,
    readTime: `${Math.max(1, Math.ceil(wordCount(content) / 220))} min`,
    tags: article.tags ?? [article.cat],
    toc: override?.toc || article.toc || [],
    heroImage: article.heroImage || null,
    content,
    faqs: override?.faqs || sectionFaqs(article.sections ?? []),
    publishedAt: "2026-05-30T09:00:00+05:00",
    updatedOn: override ? "2026-07-20" : (article.id === "software-testing-basics" ? "2026-07-17" : "2026-05-30"),
    isFeatured: article.id === "software-testing-basics",
    author: authors.primary,
    additionalAuthors: [],
    reviewers: [authors.reviewer],
    editors: [authors.editor],
  };
}

const records = ARTICLES.map(articleRecord).sort((left, right) => left.sortOrder - right.sortOrder);
const json = `${JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), articles: records }, null, 2)}\n`;
const outputs = [
  path.join(projectDirectory, "app", "data", "cms-articles.json"),
  path.join(panelDirectory, "database", "seeders", "content", "software-testing-basics", "articles.json"),
];

for (const output of outputs) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, json, "utf8");
  console.log(`Wrote ${records.length} articles to ${output}`);
}

for (const record of records.filter((article) => article.heroImage?.startsWith("/images/"))) {
  const relativeImagePath = record.heroImage.replace(/^\/images\//, "");
  const source = path.join(projectDirectory, "public", "images", relativeImagePath);
  const destination = path.join(
    panelDirectory,
    "database",
    "seeders",
    "content",
    "software-testing-basics",
    "assets",
    "articles",
    relativeImagePath,
  );
  if (!fs.existsSync(source)) continue;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}
