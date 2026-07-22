"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ChevronRight, Clock, Hash, CheckCircle,
  Code, Shield, Bug, FileText,
  Activity, Info, AlertTriangle, Search, BarChart2
} from "lucide-react";
import { ARTICLES, getIconComponent } from "@/app/data/articles";
import ArticleTableOfContents from "@/app/components/article/ArticleTableOfContents";
import CmsArticleContent from "@/app/components/article/CmsArticleContent";
import { HeaderArticlesSync } from "@/app/components/site/SiteShell";
import { SITE_NAV_ITEMS } from "@/app/components/site/navigation";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderInline(text) {
  if (typeof text !== "string") return text;
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part
  );
}

function renderSection(sec, idx) {
  const key = idx;
  switch (sec.type) {
    case "lead":
      return <p key={key} style={{ fontSize: "clamp(17px,2vw,20px)", color: "#D4D0E8", lineHeight: 1.8, marginBottom: "1.5rem", fontStyle: "italic", borderLeft: "3px solid var(--acc)", paddingLeft: "20px" }}>{renderInline(sec.text)}</p>;
    case "h2":
      return <h2 key={key} id={slugify(sec.text)}>{sec.text}</h2>;
    case "h3":
      return <h3 key={key}>{sec.text}</h3>;
    case "h4":
      return <h4 key={key}>{sec.text}</h4>;
    case "p":
      return <p key={key}>{renderInline(sec.text)}</p>;
    case "ul":
      return <ul key={key}>{sec.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}</ul>;
    case "ol":
      return <ol key={key}>{sec.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}</ol>;
    case "code":
      return <pre key={key}><code>{sec.code}</code></pre>;
    case "table":
      return (
        <table key={key}>
          <thead><tr>{sec.headers.map((h, i) => <th key={i}>{renderInline(h)}</th>)}</tr></thead>
          <tbody>{sec.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{renderInline(cell)}</td>)}</tr>)}</tbody>
        </table>
      );
    case "image":
      return (
        <figure key={key} className="article-figure">
          <Image
            src={sec.src}
            alt={sec.alt}
            width={sec.width || 1672}
            height={sec.height || 941}
            sizes="(min-width: 1060px) 780px, calc(100vw - 40px)"
            priority={sec.priority === true}
          />
          {sec.caption && <figcaption>{renderInline(sec.caption)}</figcaption>}
        </figure>
      );
    case "callout": {
      const variants = {
        info: { icon: <Info size={17} color="var(--acc)" />, cls: "callout-info" },
        warning: { icon: <AlertTriangle size={17} color="var(--warm)" />, cls: "callout-warning" },
        danger: { icon: <Shield size={17} color="var(--rose)" />, cls: "callout-danger" },
        success: { icon: <CheckCircle size={17} color="var(--grn)" />, cls: "callout-success" }
      };
      const v = variants[sec.variant] || variants.info;
      return <div key={key} className={`callout ${v.cls}`}><div className="callout-icon">{v.icon}</div><div className="callout-body"><strong>{sec.title}</strong>{sec.text}</div></div>;
    }
    default: return null;
  }
}

function ArticleFooter({ articles }) {
  return (
    <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--bdr)", padding: "60px 0 40px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 40, marginBottom: 50 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={18} color="#000" />
              </span>
              <span style={{ fontFamily: "var(--fD)", fontWeight: 700, fontSize: 17 }}>Testing<span style={{ color: "var(--acc)" }}>Basics</span></span>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, maxWidth: 240 }}>A comprehensive resource for software testing fundamentals — from principles to practice.</p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--fD)", fontSize: 12, color: "var(--acc)", letterSpacing: ".8px", textTransform: "uppercase", marginBottom: 16 }}>Core Topics</p>
            {articles.slice(0, 5).map(a => (
              <Link key={a.id} href={`/articles/${a.id}`} className="nav-btn" style={{ display: "block", marginBottom: 10, fontSize: 13, textDecoration: "none" }}>{a.cardTitle || a.title}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: "var(--fD)", fontSize: 12, color: "var(--acc)", letterSpacing: ".8px", textTransform: "uppercase", marginBottom: 16 }}>Advanced Topics</p>
            {articles.slice(5).map(a => (
              <Link key={a.id} href={`/articles/${a.id}`} className="nav-btn" style={{ display: "block", marginBottom: 10, fontSize: 13, textDecoration: "none" }}>{a.cardTitle || a.title}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: "var(--fD)", fontSize: 12, color: "var(--acc)", letterSpacing: ".8px", textTransform: "uppercase", marginBottom: 16 }}>Categories</p>
            {["Fundamentals", "Testing Types", "Strategy", "Methodology", "Techniques", "Tools", "Lifecycle", "Process", "Performance", "Best Practices"].map(c => (
              <Link key={c} href="/" className="nav-btn" style={{ display: "block", marginBottom: 8, fontSize: 12, textDecoration: "none" }}>{c}</Link>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: 28, borderTop: "1px solid var(--bdr)", display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 12, color: "var(--muted2)" }}>© {new Date().getFullYear()} Software Testing Basics. All rights reserved.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Unit Testing", "Integration", "TDD", "Performance", "Black Box", "White Box", "Selenium", "Jest", "Cypress"].map(t => (
              <span key={t} className="tag" style={{ background: "rgba(255,255,255,.03)", color: "var(--muted2)", border: "1px solid var(--bdr)", fontSize: 11 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function MobileBottomNav() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (currentY < 40 || delta < -4) setHidden(false);
      else if (delta > 8 && currentY > 120) setHidden(true);
      lastScrollY.current = currentY;
    };
    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`mobile-bottom-nav${hidden ? " hidden" : ""}`}>
      <div className="mobile-bottom-nav-inner">
        {SITE_NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.category}
              href={`/?category=${encodeURIComponent(item.category)}#articles-section`}
              className="mobile-nav-item"
              style={{ textDecoration: "none" }}
            >
              <span className="mobile-nav-icon"><Icon size={20} color="var(--muted)" /></span>
              <span className="mobile-nav-label" style={{ color: "var(--muted)" }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AuthorIdentity({ author }) {
  const avatar = author?.avatar_url || author?.avatar;
  const content = (
    <>
      <span className="contributor-avatar" aria-hidden={avatar ? undefined : true}>
        {avatar ? (
          <Image src={avatar} alt={author.name} width={46} height={46} loading="lazy" unoptimized />
        ) : (
          author.name.charAt(0).toUpperCase()
        )}
      </span>
      <span className="contributor-copy">
        <strong>{author.name}</strong>
        {author.role && <span>{author.role}</span>}
        {author.bio && <small>{author.bio}</small>}
      </span>
    </>
  );

  return author.slug ? (
    <Link className="contributor-identity" href={`/authors/${author.slug}`}>
      {content}
    </Link>
  ) : (
    <div className="contributor-identity">{content}</div>
  );
}

function ContributorGroup({ label, authors }) {
  if (!authors?.length) return null;
  return (
    <div className="contributor-group">
      <p>{label}</p>
      <div className="contributor-list">
        {authors.map((author) => <AuthorIdentity key={author.id || author.slug} author={author} />)}
      </div>
    </div>
  );
}

function ArticleContributors({ article }) {
  const hasContributors = article.author
    || article.additionalAuthors?.length
    || article.reviewers?.length
    || article.editors?.length;
  if (!hasContributors) return null;

  return (
    <section className="contributors-panel" aria-labelledby="about-contributors">
      <h2 id="about-contributors">About the Contributors</h2>
      {article.author && <ContributorGroup label="Written by" authors={[article.author]} />}
      <ContributorGroup label="Co-Authors" authors={article.additionalAuthors} />
      <ContributorGroup label="Reviewed by" authors={article.reviewers} />
      <ContributorGroup label="Edited by" authors={article.editors} />
    </section>
  );
}

export default function ArticleView({ article, articles = ARTICLES }) {
  const [progress, setProgress] = useState(0);
  const [activeTocId, setActiveTocId] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!article.toc || article.toc.length === 0) return;
    const slugs = article.toc.map(t => slugify(t));
    const elements = slugs.map(s => document.getElementById(s)).filter(Boolean);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveTocId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [article.toc]);

  const scrollToSection = useCallback((slug) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveTocId(slug);
  }, []);

  const IconComp = getIconComponent(article.iconName);
  const idx = articles.findIndex(a => a.id === article.id);
  const next = articles[idx + 1];
  const relatedArticles = articles.filter(a => a.id !== article.id).slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderArticlesSync articles={articles} />

      <div className="progress-bar" style={{ width: `${progress}%` }} />

      <main id="main-content" style={{ flex: 1, paddingTop: 66 }} role="main">
        {/* Article hero */}
        <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#080912,#0C0D20)", borderBottom: "1px solid var(--bdr)", padding: "60px 0 50px" }}>
          <div className="orb" style={{ width: 300, height: 300, background: article.catColor, top: "-10%", right: "-5%", opacity: .06, filter: "blur(60px)" }} />
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
              <Link href="/" className="btn-out" style={{ padding: "9px 14px", gap: 6, fontSize: 13, display: "flex", alignItems: "center", textDecoration: "none" }}>
                <ArrowLeft size={14} /> All Articles
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
                <span>Software Testing</span>
                <ChevronRight size={12} />
                <span style={{ color: article.catColor, fontFamily: "var(--fD)" }}>{article.cat}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <span className="tag" style={{ background: article.catBg, color: article.catColor }}>{article.cat}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}>
                <Clock size={12} /> {article.readTime} read
              </span>
              <span style={{ fontFamily: "var(--fD)", fontSize: 11, color: "var(--muted2)", letterSpacing: ".4px" }}>ARTICLE {article.num}</span>
            </div>
            <h1 style={{ fontFamily: "var(--fD)", fontWeight: 700, fontSize: "clamp(28px,5vw,52px)", letterSpacing: ".2px", lineHeight: 1.1, marginBottom: 16, maxWidth: 700 }}>{article.title}</h1>
            <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "var(--muted)", maxWidth: 620, lineHeight: 1.65, marginBottom: 24 }}>{article.subtitle}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {article.tags.map(t => (
                <span key={t} className="tag" style={{ background: "rgba(255,255,255,.05)", color: "var(--muted)", border: "1px solid var(--bdr)" }}><Hash size={10} style={{ marginRight: 3 }} />{t}</span>
              ))}
            </div>
            {(article.publishedAt || article.updatedOn || article.updatedBy) && (
              <div className="article-date-metadata">
                {article.publishedAt && (
                  <p>
                    <span>{article.publishedLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime} read</span>
                  </p>
                )}
                {(article.updatedOn || article.updatedBy) && (
                  <p>
                    {article.updatedOn && <span><strong>Updated on:</strong> {article.updatedLabel}</span>}
                    {article.updatedBy && (
                      <span>
                        <strong>Updated by:</strong>{" "}
                        {article.updatedBy.slug ? (
                          <Link href={`/authors/${article.updatedBy.slug}`}>{article.updatedBy.name}</Link>
                        ) : article.updatedBy.name}
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container" style={{ padding: "60px 20px" }} ref={contentRef}>
          <div className="article-2col">
            <ArticleTableOfContents
              items={article.toc}
              activeId={activeTocId}
              slugify={slugify}
              onSelect={scrollToSection}
            />
            <article>
              <div className="prose">
                {article.content ? (
                  <CmsArticleContent html={article.content} />
                ) : (
                  article.sections?.map((sec, i) => renderSection(sec, i))
                )}
              </div>
              <ArticleContributors article={article} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--bdr)" }}>
                {next && (
                  <Link href={`/articles/${next.id}`} className="btn-acc" style={{ gap: 8, display: "flex", alignItems: "center", textDecoration: "none" }}>
                    Next: {(next.cardTitle || next.title).split(":")[0]} <ChevronRight size={15} />
                  </Link>
                )}
              </div>
            </article>

          </div>

          {/* Related articles */}
          <div style={{ marginTop: 70, paddingTop: 50, borderTop: "1px solid var(--bdr)" }}>
            <p style={{ fontFamily: "var(--fD)", fontSize: 12, color: "var(--acc)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>— Continue Learning</p>
            <h3 style={{ fontFamily: "var(--fD)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, marginBottom: 28 }}>Related Articles</h3>
            <div className="related-grid">
              {relatedArticles.map(a => {
                const RelIcon = getIconComponent(a.iconName);
                return (
                  <Link key={a.id} href={`/articles/${a.id}`} className="card" style={{ cursor: "pointer", display: "flex", gap: 14, padding: "18px", alignItems: "flex-start", textDecoration: "none" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: a.catBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <RelIcon size={18} color={a.catColor} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="tag" style={{ background: a.catBg, color: a.catColor, marginBottom: 6, display: "inline-flex" }}>{a.cat}</span>
                      <p style={{ fontFamily: "var(--fD)", fontSize: 14, fontWeight: 600, color: "var(--txt)", lineHeight: 1.3, marginTop: 4 }}>{a.cardTitle || a.title}</p>
                      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{a.readTime} read</p>
                    </div>
                    <ChevronRight size={15} color="var(--muted)" style={{ flexShrink: 0, marginTop: 4 }} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <ArticleFooter articles={articles} />
      <MobileBottomNav />
    </div>
  );
}
