import SkeletonBlock from "@/app/components/loading/SkeletonBlock";

export default function LoadingHeader() {
  return (
    <div className="skeleton-header" aria-hidden="true">
      <div className="container skeleton-header-inner">
        <div className="skeleton-brand">
          <SkeletonBlock className="skeleton-logo" />
          <div><SkeletonBlock className="skeleton-brand-name" /><SkeletonBlock className="skeleton-brand-subtitle" /></div>
        </div>
        <div className="skeleton-nav-links">
          {Array.from({ length: 5 }, (_, index) => <SkeletonBlock key={index} className="skeleton-nav-link" />)}
        </div>
        <SkeletonBlock className="skeleton-header-action" />
      </div>
    </div>
  );
}
