export default function ArticleTableOfContents({ items, activeId, slugify, onSelect }) {
  if (!items?.length) return null;

  return (
    <aside className="toc-sticky toc-aside">
      <nav className="article-toc-panel" aria-label="On this page">
        <p className="article-toc-title">On This Page</p>
        {items.map((item, index) => {
          const sectionId = slugify(item);
          const isActive = activeId === sectionId;

          return (
            <a
              key={`${sectionId}-${index}`}
              href={`#${sectionId}`}
              className={`article-toc-link${isActive ? " active" : ""}`}
              aria-current={isActive ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(sectionId);
              }}
            >
              <span className="article-toc-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="article-toc-label">{item}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
