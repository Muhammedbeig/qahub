"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Slugify helper for generating IDs from heading text ─── */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
import {
  Menu, X, ArrowLeft, Search, Clock, ChevronRight,
  BookOpen, Code, Zap, Shield, Settings, Bug, FileText,
  Activity, Award, BarChart2, Info, AlertTriangle,
  CheckCircle, Layers, Hash
} from "lucide-react";
import { ARTICLES, CATS, getIconComponent } from "@/app/data/articles";

/* ─── Test code snippets for the ticker bar ─── */
const TICKER_TERMS = [
  "assert(true)", "expect(result).toBe(42)", "describe('QA')", "it('should pass')",
  "cy.visit('/')", "jest.mock()", "page.goto(url)", "test.each()", "beforeAll()",
  "expect.assertions(3)", "screen.getByRole()", "render(<App />)", "waitFor(() => {})",
];

/* ─── Nav items for header and mobile bottom nav ─── */
const NAV_ITEMS = [
  { label: "Fundamentals", cat: "Fundamentals", icon: BookOpen },
  { label: "Types", cat: "Testing Types", icon: Layers },
  { label: "Strategy", cat: "Strategy", icon: Zap },
  { label: "Tools", cat: "Tools", icon: Settings },
  { label: "Practices", cat: "Best Practices", icon: Award },
];

/* ─────────────────────────── CONTENT RENDERER ─────────────────────────── */
function renderSection(sec, idx) {
  const key = idx;
  switch (sec.type) {
    case "lead":
      return <p key={key} style={{ fontSize: "clamp(17px,2vw,20px)", color: "#D4D0E8", lineHeight: 1.8, marginBottom: "1.5rem", fontStyle: "italic", borderLeft: "3px solid var(--acc)", paddingLeft: "20px" }}>{sec.text}</p>;
    case "h2":
      return <h2 key={key} id={slugify(sec.text)}>{sec.text}</h2>;
    case "h3":
      return <h3 key={key}>{sec.text}</h3>;
    case "p":
      return <p key={key}>{sec.text}</p>;
    case "ul":
      return <ul key={key}>{sec.items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
    case "ol":
      return <ol key={key}>{sec.items.map((it, i) => <li key={i}>{it}</li>)}</ol>;
    case "code":
      return <pre key={key}><code>{sec.code}</code></pre>;
    case "table":
      return (
        <table key={key}>
          <thead><tr>{sec.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>{sec.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
        </table>
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

/* ─────────────────────────── HERO TEST DASHBOARD VISUAL ─────────────────────────── */
const TERMINAL_LINES = [
  { type: "cmd", text: "$ npm test -- --coverage" },
  { type: "blank" },
  { type: "suite", text: " PASS  src/auth/login.test.js" },
  { type: "test", icon: "✓", color: "#10B981", text: "renders login form (12ms)" },
  { type: "test", icon: "✓", color: "#10B981", text: "validates email format (8ms)" },
  { type: "test", icon: "✓", color: "#10B981", text: "handles submit with valid credentials (45ms)" },
  { type: "test", icon: "✓", color: "#10B981", text: "shows error on invalid password (15ms)" },
  { type: "blank" },
  { type: "suite", text: " PASS  src/cart/checkout.test.js" },
  { type: "test", icon: "✓", color: "#10B981", text: "calculates total correctly (6ms)" },
  { type: "test", icon: "✓", color: "#10B981", text: "applies discount codes (22ms)" },
  { type: "test", icon: "✗", color: "#F43F5E", text: "handles empty cart edge case (3ms)" },
  { type: "test", icon: "✓", color: "#10B981", text: "processes payment API call (89ms)" },
  { type: "blank" },
  { type: "summary", text: "Test Suites: 2 passed, 2 total" },
  { type: "summary2", text: "Tests:       7 passed, 1 failed, 8 total" },
  { type: "summary3", text: "Coverage:    94.2%  |  Time: 1.847s" },
];

const PIPELINE_STAGES = [
  { label: "Build", status: "pass", icon: "⚙" },
  { label: "Unit", status: "pass", icon: "🧪" },
  { label: "Integration", status: "pass", icon: "🔗" },
  { label: "E2E", status: "running", icon: "🖥" },
  { label: "Deploy", status: "pending", icon: "🚀" },
];

function TestDashboardVisual() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [coveragePercent, setCoveragePercent] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Animate terminal lines appearing one by one
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= TERMINAL_LINES.length) {
          clearInterval(interval);
          setShowBadge(true);
          return prev;
        }
        return prev + 1;
      });
    }, 220);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal body to bottom as lines appear
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  useEffect(() => {
    // Animate coverage ring filling up after a delay
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCoveragePercent(prev => {
          if (prev >= 94) { clearInterval(interval); return 94; }
          return prev + 2;
        });
      }, 25);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (coveragePercent / 100) * circumference;

  return (
    <div className="test-dashboard" aria-hidden="true">
      {/* Terminal window */}
      <div className="test-terminal">
        {/* Title bar */}
        <div className="test-terminal-bar">
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F43F5E" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
          </div>
          <span style={{ fontFamily: "var(--fM)", fontSize: 10, color: "var(--muted)", letterSpacing: ".04em" }}>test-runner — sw-testing-basics</span>
          <div style={{ width: 42 }} />
        </div>
        {/* Floating result badge — inline between bar and body */}
        {showBadge && (
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 12px 0" }}>
            <div className="test-result-badge pass-badge" style={{ position: "relative", top: "auto", right: "auto" }}>✓ 7 PASSED</div>
          </div>
        )}
        {/* Terminal body */}
        <div className="test-terminal-body" ref={terminalRef}>
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => {
            const isLast = i === visibleLines - 1;
            if (line.type === "blank") return <div key={i} style={{ height: 4 }} />;
            if (line.type === "cmd") return (
              <div key={i} style={{ color: "var(--muted)", fontFamily: "var(--fM)" }}>
                {line.text}{isLast && <span className="terminal-cursor">_</span>}
              </div>
            );
            if (line.type === "suite") return (
              <div key={i} style={{ color: "#10B981", fontFamily: "var(--fM)", fontWeight: 700, marginTop: 2 }}>
                {line.text}
              </div>
            );
            if (line.type === "test") return (
              <div key={i} style={{ fontFamily: "var(--fM)", paddingLeft: 14, color: "#C8C5DD", opacity: isLast ? 1 : 0.9 }}>
                <span style={{ color: line.color, marginRight: 5, fontWeight: 700 }}>{line.icon}</span>
                {line.text}
              </div>
            );
            if (line.type === "summary") return (
              <div key={i} style={{ fontFamily: "var(--fM)", color: "#10B981", fontWeight: 700, marginTop: 2, borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 4 }}>
                {line.text}
              </div>
            );
            if (line.type === "summary2") return (
              <div key={i} style={{ fontFamily: "var(--fM)", color: "#F59E0B", fontWeight: 600 }}>
                {line.text}
              </div>
            );
            if (line.type === "summary3") return (
              <div key={i} style={{ fontFamily: "var(--fM)", color: "var(--acc)", fontWeight: 700 }}>
                {line.text}
              </div>
            );
            return null;
          })}
        </div>
      </div>

      {/* Bottom row: Coverage gauge + CI Pipeline */}
      <div className="test-dashboard-row">
        {/* Coverage donut */}
        <div className="test-coverage-card">
          <svg viewBox="0 0 100 100" style={{ width: "100%", maxWidth: 96, height: "auto" }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="url(#coverageGrad)" strokeWidth="6"
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset .3s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
            <defs>
              <linearGradient id="coverageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F4C8" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <text x="50" y="46" textAnchor="middle" fill="var(--txt)" fontFamily="var(--fD)" fontSize="20" fontWeight="700">{coveragePercent}%</text>
            <text x="50" y="60" textAnchor="middle" fill="var(--muted)" fontFamily="var(--fM)" fontSize="7" letterSpacing=".08em">COVERAGE</text>
          </svg>
        </div>

        {/* CI/CD Pipeline */}
        <div className="test-pipeline-card">
          <div style={{ fontFamily: "var(--fM)", fontSize: 9, color: "var(--acc)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>CI/CD Pipeline</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
            {PIPELINE_STAGES.map((stage, i) => (
              <div key={stage.label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div className={`pipeline-node ${stage.status}`}>
                    <span style={{ fontSize: 11, lineHeight: 1 }}>{stage.icon}</span>
                  </div>
                  <span style={{ fontFamily: "var(--fM)", fontSize: 7, color: "var(--muted)", letterSpacing: ".04em", whiteSpace: "nowrap" }}>{stage.label}</span>
                </div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <div className={`pipeline-line ${PIPELINE_STAGES[i + 1].status === "pending" ? "dim" : "lit"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── HEADER ─────────────────────────── */
function Header({ onNavigate, page, scrolled, onFilterCat }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  const handleNavClick = (cat) => {
    onNavigate("home");
    close();
    // Scroll to articles section and set category filter
    setTimeout(() => {
      onFilterCat(cat);
      document.getElementById("articles-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, transition: "all .3s", background: scrolled || menuOpen ? "rgba(6,7,18,.94)" : "rgba(6,7,18,.6)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${scrolled || menuOpen ? "rgba(0,244,200,.12)" : "transparent"}` }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
        {/* Logo */}
        <button onClick={() => onNavigate("home")} className="nav-btn" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, color: "var(--txt)", letterSpacing: ".3px" }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={18} color="#000" />
          </span>
          <div style={{ lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--fD)", fontWeight: 700, display: "block" }}>Testing<span style={{ color: "var(--acc)" }}>Basics</span></span>
            <span style={{ fontFamily: "var(--fM)", fontSize: 9, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase" }}>software guide</span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" style={{ gap: 4 }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.cat} className="nav-btn" onClick={() => handleNavClick(item.cat)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13, borderRadius: 6, transition: "all .2s" }}>
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop CTA + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="/articles/what-is-software-testing" className="btn-acc desktop-nav" style={{ padding: "9px 18px", fontSize: 13, gap: 6, display: "flex", alignItems: "center", textDecoration: "none" }}>
            Start Learning <ChevronRight size={14} />
          </a>
          {/* Hamburger — visible on mobile */}
          <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{ display: "flex" }}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (inside header, slides down) */}
      <div className={`mobile-dropdown ${menuOpen ? "open" : "closed"}`}>
        <div className="mobile-dropdown-inner">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.cat} className="mobile-dropdown-link" onClick={() => handleNavClick(item.cat)}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={14} color="var(--acc)" /> {item.label}
                </span>
              </button>
            );
          })}
          <div style={{ borderTop: "1px solid var(--bdr)", margin: "8px 0" }} />
          {ARTICLES.map(a => (
            <a key={a.id} href={`/articles/${a.id}`} className="mobile-dropdown-link" style={{ textDecoration: "none" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--fD)", fontSize: 11, color: a.catColor, fontWeight: 700, minWidth: 20 }}>{a.num}</span>
                {a.title}
              </span>
            </a>
          ))}
          <a href="/articles/what-is-software-testing" className="btn-acc" style={{ marginTop: 8, justifyContent: "center", padding: "11px 20px", fontSize: 13, display: "flex", alignItems: "center", textDecoration: "none" }}>
            Start Learning <ChevronRight size={14} />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────── MOBILE BOTTOM NAV ─────────────────────────── */
function MobileBottomNav({ onNavigate, onFilterCat }) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const show = () => setHidden(false);
    const hide = () => { if (window.scrollY > 80) setHidden(true); };

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (currentY < 40 || delta < -4) show();
      else if (delta > 8 && currentY > 120) hide();
      lastScrollY.current = currentY;
    };

    const onTouchStart = (e) => { lastScrollY.current = e.touches[0]?.clientY ?? 0; };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTap = (cat) => {
    onNavigate("home");
    setTimeout(() => {
      onFilterCat(cat);
      document.getElementById("articles-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <nav className={`mobile-bottom-nav${hidden ? " hidden" : ""}`}>
      <div className="mobile-bottom-nav-inner">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.cat} className="mobile-nav-item" onClick={() => handleTap(item.cat)}>
              <span className="mobile-nav-icon"><Icon size={20} color="var(--muted)" /></span>
              <span className="mobile-nav-label" style={{ color: "var(--muted)" }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */
function Hero({ onNavigate }) {
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 66, isolation: "isolate", background: "radial-gradient(circle at 74% 34%,rgba(0,244,200,.12),transparent 33%),radial-gradient(circle at 20% 18%,rgba(99,102,241,.10),transparent 34%),linear-gradient(135deg,#040314 0%,#061226 48%,#02030B 100%)" }}>
      {/* Aura */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 75% 36%,rgba(0,244,200,.14),transparent 38%),radial-gradient(circle at 48% 90%,rgba(244,63,94,.06),transparent 40%)", zIndex: 0 }} />
      {/* Grid bg */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(0,244,200,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,244,200,.06) 1px,transparent 1px)", backgroundSize: "52px 52px", maskImage: "linear-gradient(90deg,rgba(0,0,0,.92),rgba(0,0,0,.28) 72%,transparent)", WebkitMaskImage: "linear-gradient(90deg,rgba(0,0,0,.92),rgba(0,0,0,.28) 72%,transparent)" }} />

      <div className="container" style={{ position: "relative", zIndex: 1, width: "100%", paddingTop: 60, paddingBottom: 80 }}>
        <div style={{ display: "grid", width: "100%", alignItems: "center", gap: 48 }} className="hero-grid">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <div className="au1" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", background: "rgba(0,244,200,.08)", border: "1px solid rgba(0,244,200,.35)", borderRadius: 2, marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--acc)", boxShadow: "0 0 18px rgba(0,244,200,.75)", animation: "glowPulse 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "var(--fM)", fontSize: 11, color: "var(--acc)", letterSpacing: ".12em", textTransform: "uppercase" }}>Comprehensive QA Learning Resource</span>
            </div>
            <h1 className="au2" style={{ fontFamily: "var(--fD)", fontWeight: 700, fontSize: "clamp(38px,7vw,82px)", lineHeight: 1.05, letterSpacing: "-1px", marginBottom: 24, maxWidth: 780 }}>
              <span>Software</span><br />
              <span>Testing{" "}</span>
              <span style={{ color: "transparent", fontStyle: "normal", background: "linear-gradient(120deg,#00F4C8 0%,#6366F1 48%,#F43F5E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Basics</span>
            </h1>
            <p className="au3" style={{ fontSize: "clamp(16px,2vw,19px)", color: "var(--muted)", maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}>
              From first principles to professional practice, thirty comprehensive guides covering everything a modern QA engineer needs to build quality into every line of code.
            </p>
            <div className="au4" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 40 }}>
              <a href="/articles/what-is-software-testing" className="btn-acc" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                Start Learning <ChevronRight size={16} />
              </a>
              <button className="btn-out" onClick={() => document.getElementById("articles-section")?.scrollIntoView({ behavior: "smooth" })}>
                Browse Topics <BarChart2 size={16} />
              </button>
            </div>
            {/* Chips */}
            <div className="au5" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Concept-first", "Real examples", "Free forever"].map(item => (
                <span key={item} style={{ border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.04)", color: "#C5C8DE", fontFamily: "var(--fM)", fontSize: ".72rem", padding: ".42rem .7rem", borderRadius: 2 }}>{item}</span>
              ))}
            </div>
          </div>

          {/* Right: Test Dashboard visual */}
          <div className="au6" style={{ display: "grid", placeItems: "center" }}>
            <TestDashboardVisual />
          </div>
        </div>

        {/* Stats row */}
        <div className="au5" style={{ display: "flex", flexWrap: "wrap", gap: 40, paddingTop: 40, marginTop: 40, borderTop: "1px solid var(--bdr)" }}>
          {[["30", "Comprehensive Articles"], ["300+", "Minutes of Content"], ["150+", "Real Code Examples"], ["7", "Core Principles"]].map(([n, l]) => (
            <div key={l}>
              <div className="stat-num">{n}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker bar at bottom of hero */}
      <div className="hero-ticker" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <div>
          {[...TICKER_TERMS, ...TICKER_TERMS].map((term, i) => (
            <span key={`${term}-${i}`}>{term}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── ARTICLE CARD ─────────────────────────── */
function ArticleCard({ article, idx }) {
  const IconComp = getIconComponent(article.iconName);
  return (
    <a href={`/articles/${article.id}`} className={`card au${Math.min(idx + 1, 6)}`} style={{ cursor: "pointer", position: "relative", overflow: "hidden", textDecoration: "none", display: "block" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${article.catColor},transparent)` }} />
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span className="tag" style={{ background: article.catBg, color: article.catColor }}>{article.cat}</span>
          <span style={{ fontFamily: "var(--fD)", fontSize: 12, color: "var(--muted2)", fontWeight: 700 }}>{article.num}</span>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: article.catBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <IconComp size={22} color={article.catColor} />
        </div>
        <h3 style={{ fontFamily: "var(--fD)", fontSize: "clamp(17px,2vw,20px)", fontWeight: 700, color: "var(--txt)", marginBottom: 10, lineHeight: 1.2, letterSpacing: ".3px" }}>{article.title}</h3>
        <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.subtitle}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={13} color="var(--muted)" />
            <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--fD)", letterSpacing: ".3px" }}>{article.readTime} read</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {article.tags.slice(0, 2).map(t => (
              <span key={t} className="tag" style={{ background: "rgba(255,255,255,.04)", color: "var(--muted)", fontSize: 10 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

/* ─────────────────────────── HOME PAGE ─────────────────────────── */
function HomePage({ onNavigate, cat, setCat }) {
  const [q, setQ] = useState("");
  const filtered = ARTICLES.filter(a => {
    const catOk = cat === "All" || a.cat === cat;
    const qOk = !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.cat.toLowerCase().includes(q.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(q.toLowerCase()));
    return catOk && qOk;
  });
  const allCats = ["All", ...[...new Set(ARTICLES.map(a => a.cat))]];
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <section id="articles-section" style={{ padding: "80px 0 100px" }}>
        <div className="container">
          {/* Section header */}
          <div style={{ marginBottom: 40 }}>
            <p className="au1" style={{ fontFamily: "var(--fD)", fontSize: 12, color: "var(--acc)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>— Learning Paths</p>
            <h2 className="au2" style={{ fontFamily: "var(--fD)", fontWeight: 700, fontSize: "clamp(26px,4vw,40px)", letterSpacing: ".3px", marginBottom: 14 }}>All Articles</h2>
            <p className="au3" style={{ color: "var(--muted)", fontSize: 15, maxWidth: 520 }}>Thirty comprehensive guides covering every essential aspect of software testing: from first principles to professional best practices.</p>
          </div>
          {/* Search */}
          <div className="au4 search-wrap" style={{ marginBottom: 24, maxWidth: 480 }}>
            <Search className="search-icon" size={17} />
            <input placeholder="Search articles, topics, tags…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          {/* Category filter */}
          <div className="au4" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36, overflowX: "auto", paddingBottom: 4 }}>
            {allCats.map(c => (
              <button key={c} className={`cat-btn${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          {/* Grid */}
          {filtered.length > 0
            ? <div className="articles-grid">{filtered.map((a, i) => <ArticleCard key={a.id} article={a} idx={i} />)}</div>
            : <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
              <Search size={40} style={{ marginBottom: 16, opacity: .4 }} />
              <p style={{ fontFamily: "var(--fD)", fontSize: 16 }}>No articles match your search</p>
            </div>
          }
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────── ARTICLE PAGE ─────────────────────────── */
function ArticlePage({ article, onBack, onNavigate }) {
  const [progress, setProgress] = useState(0);
  const [activeTocId, setActiveTocId] = useState("");
  const contentRef = useRef(null);

  /* ─── Reading progress bar ─── */
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

  /* ─── IntersectionObserver for active TOC tracking ─── */
  useEffect(() => {
    if (!article.toc || article.toc.length === 0) return;
    const slugs = article.toc.map(t => slugify(t));
    const elements = slugs.map(s => document.getElementById(s)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveTocId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [article.toc]);

  /* ─── Smooth scroll to section ─── */
  const scrollToSection = useCallback((slug) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const offset = 90; // account for fixed header
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveTocId(slug);
  }, []);

  const IconComp = getIconComponent(article.iconName);
  const relatedArticles = ARTICLES.filter(a => a.id !== article.id).slice(0, 4);

  return (
    <div style={{ paddingTop: 66 }}>
      {/* Progress bar */}
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      {/* Article hero */}
      <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#080912,#0C0D20)", borderBottom: "1px solid var(--bdr)", padding: "60px 0 50px" }}>
        <div className="orb" style={{ width: 300, height: 300, background: article.catColor, top: "-10%", right: "-5%", opacity: .06, filter: "blur(60px)" }} />
        <div className="container">
          {/* Back + breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            <button onClick={onBack} className="btn-out" style={{ padding: "9px 14px", gap: 6, fontSize: 13 }}>
              <ArrowLeft size={14} /> All Articles
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
              <span>Software Testing</span>
              <ChevronRight size={12} />
              <span style={{ color: article.catColor, fontFamily: "var(--fD)" }}>{article.cat}</span>
            </div>
          </div>
          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span className="tag" style={{ background: article.catBg, color: article.catColor }}>{article.cat}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}>
              <Clock size={12} /> {article.readTime} read
            </span>
            <span style={{ fontFamily: "var(--fD)", fontSize: 11, color: "var(--muted2)", letterSpacing: ".4px" }}>ARTICLE {article.num}</span>
          </div>
          <h1 style={{ fontFamily: "var(--fD)", fontWeight: 700, fontSize: "clamp(28px,5vw,52px)", letterSpacing: ".2px", lineHeight: 1.1, marginBottom: 16, maxWidth: 700 }}>{article.title}</h1>
          <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "var(--muted)", maxWidth: 620, lineHeight: 1.65, marginBottom: 24 }}>{article.subtitle}</p>
          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {article.tags.map(t => (
              <span key={t} className="tag" style={{ background: "rgba(255,255,255,.05)", color: "var(--muted)", border: "1px solid var(--bdr)" }}><Hash size={10} style={{ marginRight: 3 }} />{t}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="container" style={{ padding: "60px 20px" }} ref={contentRef}>
        <div className="article-2col">
          {/* Main content */}
          <article>
            <div className="prose">
              {article.sections.map((sec, i) => renderSection(sec, i))}
            </div>
            {/* Nav between articles */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--bdr)" }}>
              {(() => {
                const idx = ARTICLES.findIndex(a => a.id === article.id);
                const next = ARTICLES[idx + 1];
                return next ? (
                  <button onClick={() => onNavigate("article", next.id)} className="btn-acc" style={{ gap: 8 }}>
                    Next: {next.title.split(":")[0]} <ChevronRight size={15} />
                  </button>
                ) : null;
              })()}
            </div>
          </article>
          {/* TOC panel — clickable with active state */}
          {article.toc && (
            <aside className="toc-sticky toc-aside" style={{ display: "none" }}>
              <nav style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: "var(--r)", padding: "20px" }}>
                <p style={{ fontFamily: "var(--fD)", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: "var(--acc)", marginBottom: 14 }}>On This Page</p>
                {article.toc.map((item, i) => {
                  const tocSlug = slugify(item);
                  const isActive = activeTocId === tocSlug;
                  return (
                    <a
                      key={i}
                      href={`#${tocSlug}`}
                      onClick={(e) => { e.preventDefault(); scrollToSection(tocSlug); }}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px",
                        borderRadius: 6, marginBottom: 2, textDecoration: "none", cursor: "pointer",
                        transition: "all .2s ease",
                        background: isActive ? "rgba(99,102,241,.1)" : "transparent",
                        borderLeft: isActive ? "2px solid var(--acc)" : "2px solid transparent",
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--fD)", fontSize: 11, minWidth: 18, marginTop: 2,
                        color: isActive ? "var(--acc)" : "var(--muted2)",
                        transition: "color .2s ease"
                      }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{
                        fontSize: 13, lineHeight: 1.5,
                        color: isActive ? "var(--txt)" : "var(--muted)",
                        fontWeight: isActive ? 600 : 400,
                        transition: "color .2s ease, font-weight .2s ease"
                      }}>{item}</span>
                    </a>
                  );
                })}
              </nav>
            </aside>
          )}
        </div>
        {/* Related */}
        <div style={{ marginTop: 70, paddingTop: 50, borderTop: "1px solid var(--bdr)" }}>
          <p style={{ fontFamily: "var(--fD)", fontSize: 12, color: "var(--acc)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>— Continue Learning</p>
          <h3 style={{ fontFamily: "var(--fD)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, marginBottom: 28 }}>Related Articles</h3>
          <div className="related-grid">
            {relatedArticles.map(a => {
              const RelIcon = getIconComponent(a.iconName);
              return (
                <div key={a.id} className="card" style={{ cursor: "pointer", display: "flex", gap: 14, padding: "18px", alignItems: "flex-start" }} onClick={() => onNavigate("article", a.id)}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: a.catBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <RelIcon size={18} color={a.catColor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="tag" style={{ background: a.catBg, color: a.catColor, marginBottom: 6, display: "inline-flex" }}>{a.cat}</span>
                    <p style={{ fontFamily: "var(--fD)", fontSize: 14, fontWeight: 600, color: "var(--txt)", lineHeight: 1.3, marginTop: 4 }}>{a.title}</p>
                    <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{a.readTime} read</p>
                  </div>
                  <ChevronRight size={15} color="var(--muted)" style={{ flexShrink: 0, marginTop: 4 }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── FOOTER ─────────────────────────── */
function Footer({ onNavigate }) {
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
            {ARTICLES.slice(0, 5).map(a => (
              <a key={a.id} href={`/articles/${a.id}`} className="nav-btn" style={{ display: "block", marginBottom: 10, fontSize: 13, textDecoration: "none" }}>{a.title}</a>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: "var(--fD)", fontSize: 12, color: "var(--acc)", letterSpacing: ".8px", textTransform: "uppercase", marginBottom: 16 }}>Advanced Topics</p>
            {ARTICLES.slice(5).map(a => (
              <a key={a.id} href={`/articles/${a.id}`} className="nav-btn" style={{ display: "block", marginBottom: 10, fontSize: 13, textDecoration: "none" }}>{a.title}</a>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: "var(--fD)", fontSize: 12, color: "var(--acc)", letterSpacing: ".8px", textTransform: "uppercase", marginBottom: 16 }}>Categories</p>
            {["Fundamentals", "Testing Types", "Strategy", "Methodology", "Techniques", "Tools", "Lifecycle", "Process", "Performance", "Best Practices"].map(c => (
              <a key={c} href="/" className="nav-btn" style={{ display: "block", marginBottom: 8, fontSize: 12, textDecoration: "none" }}>{c}</a>
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

/* ─────────────────────────── MAIN APP ─────────────────────────── */
export default function QAHubApp() {
  const [scrolled, setScrolled] = useState(false);
  const [cat, setCat] = useState("All");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <noscript>
        <div style={{ background: "#F59E0B", color: "#000", padding: "12px 20px", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
          This website requires JavaScript to function. Please enable JavaScript in your browser settings.
        </div>
      </noscript>
      <Header onNavigate={() => {}} page="home" scrolled={scrolled} onFilterCat={setCat} />
      <main id="main-content" style={{ flex: 1 }} role="main">
        <HomePage onNavigate={() => {}} cat={cat} setCat={setCat} />
      </main>
      <Footer onNavigate={() => {}} />
      <MobileBottomNav onNavigate={() => {}} onFilterCat={setCat} />
    </div>
  );
}
