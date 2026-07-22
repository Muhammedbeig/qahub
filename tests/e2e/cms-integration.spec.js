import { test, expect } from "@playwright/test";

const PANEL_URL = "http://127.0.0.1:8000";
const PUBLIC_CMS_URL = process.env.PUBLIC_CMS_URL || "https://panel.softwaretestingbasics.io/api";

function watchLocalFailures(page) {
  const failures = [];
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.stack || error.message}`));
  page.on("response", (response) => {
    if (/(?:127\.0\.0\.1:(?:3000|3001|8000)|(?:panel\.)?softwaretestingbasics\.io)/.test(response.url()) && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });
  return failures;
}

async function cmsArticle(request, slug) {
  const response = await request.get(`${PUBLIC_CMS_URL}/site/blogs/${slug}`);
  expect(response.ok()).toBe(true);
  return (await response.json()).data;
}

test("homepage is CMS-backed and lists every imported article", async ({ page, request }) => {
  const failures = watchLocalFailures(page);
  const softwareTestingBasics = await cmsArticle(request, "software-testing-basics");
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Start Here" })).toBeVisible();
  await expect(page.locator(".articles-grid .card")).toHaveCount(31);
  await expect(page.locator(".articles-grid").getByRole("heading", { name: softwareTestingBasics.title, exact: true })).toBeVisible();
  await expect(page.locator(".articles-grid").getByRole("heading", { name: "Software Testing Basics", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Best Automation Testing Tools" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Types of Software Tests: Methods, Levels, Techniques, and Examples" })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  expect(failures).toEqual([]);
});

test("updated tools article keeps the site theme, tables, TOC, and contributors", async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.goto("/articles/testing-tools-frameworks", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Best Automation Testing Tools" })).toBeVisible();
  await expect(page.locator(".cms-rich-content table")).toHaveCount(2);
  await expect(page.locator(".toc-aside a")).toHaveCount(13);
  await expect(page.locator(".cms-rich-content .citation-ref")).toHaveCount(22);
  await expect(page.locator(".cms-rich-content .article-sources li")).toHaveCount(19);
  await expect(page.getByRole("heading", { name: "Authoritative Sources" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "About the Contributors" })).toBeVisible();
  await expect(page.getByText("Muhammad Baig", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Imdad Ullah Khan, Ph\.D\./ }).first()).toHaveAttribute(
    "href",
    "/authors/imdad-ullah-khan-phd",
  );
  await expect(page.locator(".contributors-panel").getByRole("link", { name: /Muhammad Furquan/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How We Use Playwright in Agentic Engineering Tasks" })).toBeVisible();

  const accent = await page.locator(".cms-rich-content h3").first().evaluate((element) => getComputedStyle(element).color);
  expect(accent).toBe("rgb(0, 244, 200)");

  const firstCitation = page.locator(".cms-rich-content .citation-ref").first();
  await expect(firstCitation).toHaveCSS("color", "rgb(0, 244, 200)");
  await firstCitation.hover();
  await expect(firstCitation.locator(".citation-popover")).toBeVisible();
  await expect(firstCitation.locator(".citation-popover-link")).toHaveText("View source ↗");
  await firstCitation.click();
  await expect(page).toHaveURL(/#source-\d+$/);
  expect(failures).toEqual([]);
});

test("full testing-types replacement renders sources, links, FAQs, and wide tables", async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.goto("/articles/types-of-software-testing", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Types of Software Tests: Methods, Levels, Techniques, and Examples" })).toBeVisible();
  await expect(page.locator(".cms-rich-content table")).toHaveCount(15);
  await expect(page.locator('.cms-rich-content .article-sources li a[href^="https://"]')).toHaveCount(5);
  await expect(page.locator(".cms-rich-content .citation-ref")).toHaveCount(5);
  await expect(page.locator(".cms-rich-content .article-sources li")).toHaveCount(5);
  await expect(page.getByRole("heading", { name: "Authoritative Sources" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Frequently Asked Questions" })).toBeVisible();

  const owaspLink = page.locator('.cms-rich-content a[href*="owasp.org"]').first();
  await expect(owaspLink).toHaveAttribute("target", "_blank");
  await expect(owaspLink).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator('#software-testing-basics-a-quick-definition')).toHaveCount(1);
  await expect(page.getByText("Updated by:")).toBeVisible();
  await expect(page.getByRole("link", { name: "Imdad Ullah Khan, Ph.D." }).first()).toHaveAttribute("href", "/authors/imdad-ullah-khan-phd");
  expect(failures).toEqual([]);
});

test("software testing basics images, CMS metadata, and structured data stay connected", async ({ page, request }) => {
  const failures = watchLocalFailures(page);
  const cms = await cmsArticle(request, "software-testing-basics");
  await page.goto("/articles/software-testing-basics", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: cms.title, exact: true })).toBeVisible();

  const contentImages = page.locator(".cms-rich-content img");
  await expect(contentImages).toHaveCount(10);
  for (const image of await contentImages.all()) {
    await expect(image).toHaveAttribute("src", /^https:\/\/panel\.softwaretestingbasics\.io\/storage\//);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
  }

  const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent || "{}")),
  );
  const nodes = jsonLd.flatMap((entry) => entry["@graph"] || [entry]);
  const types = nodes.flatMap((node) => Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]).filter(Boolean);

  expect(types).toContain("Article");
  expect(types).toContain("WebPage");
  expect(types).toContain("BreadcrumbList");
  expect(types).toContain("Person");
  expect(types).toContain("FAQPage");
  expect(types).not.toContain("LearningResource");

  const article = nodes.find((node) => node["@type"] === "Article");
  const webPage = nodes.find((node) => node["@type"] === "WebPage");
  const people = nodes.filter((node) => node["@type"] === "Person");
  expect(article.headline).toBe(cms.title);
  expect(article.image.url).toMatch(/^https:\/\//);
  expect(article.author[0]["@id"]).toContain("/authors/muhammad-baig#person");
  expect(article.editor[0]["@id"]).toContain("/authors/muhammad-furquan#person");
  expect(webPage.reviewedBy[0]["@id"]).toContain("/authors/imdad-ullah-khan-phd#person");
  expect(people.find((person) => person.name === "Muhammad Baig").sameAs).toEqual(expect.arrayContaining([expect.stringMatching(/^https:\/\//)]));
  expect(article.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}T/);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/articles\/software-testing-basics$/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", cms.metaTitle || cms.title);
  const socialImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(socialImage).toMatch(/^https?:\/\//);
  expect(socialImage).not.toMatch(/https?:\/\/.*https?:\/\//);
  const socialImageResponse = await request.get(socialImage);
  expect(socialImageResponse.ok()).toBe(true);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  expect(failures).toEqual([]);
});

test("CMS author profile is an on-site destination with ProfilePage schema", async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.goto("/authors/muhammad-baig", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Muhammad Baig" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Articles" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Basics of Software Testing/ })).toBeVisible();

  const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent || "{}")),
  );
  const nodes = jsonLd.flatMap((entry) => entry["@graph"] || [entry]);
  expect(nodes.some((node) => node["@type"] === "ProfilePage")).toBe(true);
  const person = nodes.find((node) => node["@type"] === "Person");
  expect(person.url).toMatch(/\/authors\/muhammad-baig$/);
  expect(person.sameAs).toEqual(expect.arrayContaining([expect.stringMatching(/^https:\/\//)]));
  expect(failures).toEqual([]);
});

test("mobile article navigation and table containment do not change the layout", async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/articles/types-of-software-testing", { waitUntil: "networkidle" });

  const mobileToc = page.locator(".toc-aside");
  await expect(mobileToc).toBeVisible();
  await expect(mobileToc.locator("a")).toHaveCount(21);
  const articleOrder = await page.evaluate(() => {
    const toc = document.querySelector(".toc-aside");
    const article = document.querySelector(".article-2col > article");
    return toc && article ? toc.getBoundingClientRect().top < article.getBoundingClientRect().top : false;
  });
  expect(articleOrder).toBe(true);

  await page.locator(".hamburger").click();
  await expect(page.locator(".mobile-dropdown.open")).toBeVisible();
  await expect(page.locator('.mobile-dropdown.open a[href^="/articles/"]')).toHaveCount(32);

  const dimensions = await page.evaluate(() => {
    const table = document.querySelector(".table-scroll");
    return {
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      tableContained: table ? table.getBoundingClientRect().right <= window.innerWidth + 1 : false,
    };
  });
  expect(dimensions.documentOverflow).toBeLessThanOrEqual(1);
  expect(dimensions.tableContained).toBe(true);
  expect(failures).toEqual([]);
});

test("admin can log in and edit the imported rich article with connected authors", async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.goto(`${PANEL_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill("admin@gmail.com");
  await page.getByLabel("Password").fill("admin123");
  await Promise.all([
    page.waitForURL(/\/home$/),
    page.getByRole("button", { name: "Log in" }).click(),
  ]);

  await expect(page.getByText("Software Testing Basics CMS", { exact: true })).toBeVisible();
  await page.goto(`${PANEL_URL}/blog/3/edit`, { waitUntil: "domcontentloaded" });
  await expect(page.locator('input[name="title[1]"]')).toHaveValue("Types of Software Tests: Methods, Levels, Techniques, and Examples");
  await expect(page.locator('select[name="author_id"] option:checked')).toHaveText("Muhammad Baig");
  await expect(page.locator('select[name="reviewers[]"] option:checked')).toHaveText("Imdad Ullah Khan, Ph.D.");
  await expect(page.locator('select[name="editors[]"] option:checked')).toHaveText("Muhammad Furquan");

  const editorFrame = page.frameLocator(".tox-edit-area iframe").first();
  await expect(editorFrame.locator("body")).toBeVisible({ timeout: 15_000 });
  await expect(editorFrame.locator("table")).toHaveCount(15);
  await expect(editorFrame.locator('a[href*="owasp.org"]')).toHaveCount(1);
  await expect(page.locator("#preset-attribute-color")).toHaveValue("#00f4c8");
  await expect(page.locator('select[name="author_id"] option')).toHaveCount(4);
  expect(failures).toEqual([]);
});
