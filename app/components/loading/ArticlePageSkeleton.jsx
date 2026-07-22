import SkeletonBlock from "@/app/components/loading/SkeletonBlock";

function TocSkeleton({ className = "" }) {
  return (
    <aside className={`skeleton-toc ${className}`.trim()} aria-hidden="true">
      <SkeletonBlock className="skeleton-toc-title" />
      {Array.from({ length: 7 }, (_, index) => (
        <div key={index} className="skeleton-toc-row"><SkeletonBlock /><SkeletonBlock /></div>
      ))}
    </aside>
  );
}

export default function ArticlePageSkeleton() {
  return (
    <div className="route-skeleton" data-route-loading="article">
      <p className="sr-only" role="status">Loading article.</p>
      <main className="skeleton-article-main">
        <section className="skeleton-article-hero">
          <div className="container">
            <div className="skeleton-breadcrumb"><SkeletonBlock /><SkeletonBlock /></div>
            <div className="skeleton-article-meta"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /></div>
            <SkeletonBlock className="skeleton-article-heading" />
            <SkeletonBlock className="skeleton-article-heading short" />
            <SkeletonBlock className="skeleton-article-summary" />
            <SkeletonBlock className="skeleton-article-summary short" />
            <div className="skeleton-article-tags"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /></div>
            <div className="skeleton-date-lines"><SkeletonBlock /><SkeletonBlock /></div>
          </div>
        </section>
        <section className="container skeleton-article-content">
          <TocSkeleton className="skeleton-toc-mobile" />
          <div className="skeleton-prose" aria-hidden="true">
            {Array.from({ length: 3 }, (_, section) => (
              <div key={section} className="skeleton-prose-section">
                <SkeletonBlock className="skeleton-prose-heading" />
                {Array.from({ length: section === 1 ? 5 : 4 }, (_, line) => (
                  <SkeletonBlock key={line} className={line === 3 ? "short" : ""} />
                ))}
              </div>
            ))}
            <div className="skeleton-contributors">
              <SkeletonBlock className="label" />
              <div><SkeletonBlock className="avatar" /><span><SkeletonBlock /><SkeletonBlock /></span></div>
              <div><SkeletonBlock className="avatar" /><span><SkeletonBlock /><SkeletonBlock /></span></div>
            </div>
          </div>
          <TocSkeleton className="skeleton-toc-desktop" />
        </section>
      </main>
    </div>
  );
}
