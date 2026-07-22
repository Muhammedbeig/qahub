import Link from "next/link";
import Image from "next/image";
import { Clock, ExternalLink } from "lucide-react";
import { authorSameAs } from "@/app/lib/site";

function linkLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "External profile";
  }
}

export default function AuthorProfile({ author }) {
  const avatar = author.avatar_url || author.avatar;
  const sameAs = authorSameAs(author);

  return (
    <div className="author-page-shell">
      <main id="main-content">
        <section className="author-profile-hero">
          <div className="orb author-profile-orb" />
          <div className="container author-profile-hero-inner">
            <Link href="/" className="author-back-link">&larr; Software Testing Basics</Link>
            <div className="author-profile-heading">
              <div className="author-profile-avatar">
                {avatar ? <Image src={avatar} alt={author.name} width={112} height={112} priority /> : <span>{author.name.charAt(0)}</span>}
              </div>
              <div>
                <span className="tag author-profile-tag">Contributor</span>
                <h1>{author.name}</h1>
                {author.role && <p>{author.role}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="container author-profile-content">
          <div className="author-profile-bio">
            <h2>About {author.name}</h2>
            <p>{author.bio || `${author.name} contributes to Software Testing Basics.`}</p>
            {sameAs.length > 0 && (
              <div className="author-profile-links" aria-label={`${author.name} profiles`}>
                {sameAs.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                    {linkLabel(url)} <ExternalLink size={13} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="author-articles-section">
            <div>
              <p className="author-section-eyebrow">Published work</p>
              <h2>Articles</h2>
            </div>
            {author.articles?.length ? (
              <div className="author-articles-grid">
                {author.articles.map((article) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`} className="card author-article-card">
                    {article.heroImage && (
                      <div className="author-article-image">
                        <Image
                          src={article.heroImage}
                          alt=""
                          fill
                          sizes="(min-width: 700px) 50vw, 100vw"
                        />
                      </div>
                    )}
                    <span className="tag" style={{ color: article.catColor, background: article.catBg }}>{article.cat}</span>
                    <h3>{article.title}</h3>
                    {article.subtitle && <p>{article.subtitle}</p>}
                    <span className="author-article-time"><Clock size={13} /> {article.readTime} read</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="author-empty-state">No published articles are assigned to this profile yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
