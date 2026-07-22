"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle, ChevronRight } from "lucide-react";
import { CATEGORY_NAV_EVENT, SITE_NAV_ITEMS } from "@/app/components/site/navigation";

export default function SiteHeader({ articles }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const selectCategory = (category) => {
    setMenuOpen(false);

    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent(CATEGORY_NAV_EVENT, { detail: category }));
      return;
    }

    router.push(`/?category=${encodeURIComponent(category)}#articles-section`);
  };

  const solid = scrolled || menuOpen || pathname.startsWith("/authors/");

  return (
    <header
      data-site-header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        transition: "all .3s",
        background: solid ? "rgba(6,7,18,.94)" : "rgba(6,7,18,.6)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${solid ? "rgba(0,244,200,.12)" : "transparent"}`,
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
        <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Software Testing Basics home" className="nav-btn" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, color: "var(--txt)", letterSpacing: ".3px", textDecoration: "none" }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={18} color="#000" />
          </span>
          <span style={{ lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--fD)", fontWeight: 700, display: "block" }}>Testing<span style={{ color: "var(--acc)" }}>Basics</span></span>
            <span style={{ fontFamily: "var(--fM)", fontSize: 9, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase" }}>software guide</span>
          </span>
        </Link>

        <nav className="desktop-nav" style={{ gap: 4 }} aria-label="Topics">
          {SITE_NAV_ITEMS.map(({ label, category, icon: Icon }) => (
            <button
              key={category}
              type="button"
              className="nav-btn"
              onClick={() => selectCategory(category)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13, borderRadius: 6, transition: "all .2s" }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/articles/software-testing-basics" onClick={() => setMenuOpen(false)} className="btn-acc desktop-nav" style={{ padding: "9px 18px", fontSize: 13, gap: 6, display: "flex", alignItems: "center", textDecoration: "none" }}>
            Start Learning <ChevronRight size={14} />
          </Link>
          <button
            type="button"
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
            style={{ display: "flex" }}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div id="site-mobile-menu" className={`mobile-dropdown ${menuOpen ? "open" : "closed"}`}>
        <div className="mobile-dropdown-inner">
          {SITE_NAV_ITEMS.map(({ label, category, icon: Icon }) => (
            <button key={category} type="button" className="mobile-dropdown-link" onClick={() => selectCategory(category)}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} color="var(--acc)" /> {label}
              </span>
            </button>
          ))}
          <div style={{ borderTop: "1px solid var(--bdr)", margin: "8px 0" }} />
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`} onClick={() => setMenuOpen(false)} className="mobile-dropdown-link" style={{ textDecoration: "none" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--fD)", fontSize: 11, color: article.catColor, fontWeight: 700, minWidth: 20 }}>{article.num}</span>
                {article.cardTitle || article.title}
              </span>
            </Link>
          ))}
          <Link href="/articles/software-testing-basics" onClick={() => setMenuOpen(false)} className="btn-acc" style={{ marginTop: 8, justifyContent: "center", padding: "11px 20px", fontSize: 13, display: "flex", alignItems: "center", textDecoration: "none" }}>
            Start Learning <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
