import LoadingHeader from "@/app/components/loading/LoadingHeader";
import SkeletonBlock from "@/app/components/loading/SkeletonBlock";

function DashboardSkeleton() {
  return (
    <div className="skeleton-dashboard" aria-hidden="true">
      <div className="skeleton-terminal">
        <div className="skeleton-terminal-bar"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /><SkeletonBlock className="wide" /></div>
        <div className="skeleton-terminal-body">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonBlock key={index} className={index % 3 === 0 ? "line short" : "line"} />
          ))}
        </div>
      </div>
      <div className="skeleton-dashboard-row">
        <div className="skeleton-dashboard-card"><SkeletonBlock className="circle" /><SkeletonBlock className="caption" /></div>
        <div className="skeleton-dashboard-card"><div className="skeleton-pipeline"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /></div><SkeletonBlock className="caption" /></div>
      </div>
    </div>
  );
}

export default function HomePageSkeleton() {
  return (
    <div className="route-skeleton" data-route-loading="home">
      <p className="sr-only" role="status">Loading the Software Testing Basics homepage.</p>
      <LoadingHeader />
      <main>
        <section className="skeleton-home-hero">
          <div className="orb skeleton-orb-one" />
          <div className="container skeleton-home-grid">
            <div className="skeleton-home-copy">
              <SkeletonBlock className="eyebrow" />
              <SkeletonBlock className="headline" />
              <SkeletonBlock className="headline medium" />
              <SkeletonBlock className="headline short" />
              <div className="skeleton-copy-lines"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /></div>
              <div className="skeleton-actions"><SkeletonBlock /><SkeletonBlock /></div>
              <div className="skeleton-stats">{Array.from({ length: 3 }, (_, index) => <div key={index}><SkeletonBlock /><SkeletonBlock /></div>)}</div>
            </div>
            <DashboardSkeleton />
          </div>
        </section>
        <div className="skeleton-ticker" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <SkeletonBlock key={index} />)}</div>
        <section className="skeleton-articles-section">
          <div className="container">
            <SkeletonBlock className="section-kicker" />
            <SkeletonBlock className="section-title" />
            <SkeletonBlock className="section-copy" />
            <SkeletonBlock className="skeleton-search" />
            <div className="skeleton-filters">{Array.from({ length: 6 }, (_, index) => <SkeletonBlock key={index} />)}</div>
            <div className="articles-grid skeleton-card-grid">
              {Array.from({ length: 6 }, (_, index) => (
                <div className="skeleton-article-card" key={index}>
                  <div className="skeleton-card-top"><SkeletonBlock /><SkeletonBlock /></div>
                  <SkeletonBlock className="skeleton-card-icon" />
                  <SkeletonBlock className="skeleton-card-title" />
                  <SkeletonBlock className="skeleton-card-title short" />
                  <SkeletonBlock className="skeleton-card-copy" />
                  <SkeletonBlock className="skeleton-card-copy short" />
                  <div className="skeleton-card-meta"><SkeletonBlock /><SkeletonBlock /></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
