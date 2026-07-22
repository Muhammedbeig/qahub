import LoadingHeader from "@/app/components/loading/LoadingHeader";
import SkeletonBlock from "@/app/components/loading/SkeletonBlock";

export default function AuthorPageSkeleton() {
  return (
    <div className="route-skeleton" data-route-loading="author">
      <p className="sr-only" role="status">Loading author profile.</p>
      <LoadingHeader />
      <main className="skeleton-author-main">
        <section className="skeleton-author-hero">
          <div className="container">
            <SkeletonBlock className="skeleton-author-back" />
            <div className="skeleton-author-heading">
              <SkeletonBlock className="skeleton-author-avatar" />
              <div><SkeletonBlock className="tagline" /><SkeletonBlock className="name" /><SkeletonBlock className="role" /></div>
            </div>
          </div>
        </section>
        <section className="container skeleton-author-content">
          <div className="skeleton-author-bio"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /><SkeletonBlock className="short" /></div>
          <SkeletonBlock className="skeleton-author-section-title" />
          <div className="author-articles-grid">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="skeleton-author-card" key={index}><SkeletonBlock className="image" /><SkeletonBlock className="title" /><SkeletonBlock /><SkeletonBlock className="short" /></div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
