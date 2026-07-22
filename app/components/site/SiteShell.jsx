"use client";

import { createContext, useContext, useEffect, useState } from "react";
import SiteHeader from "@/app/components/site/SiteHeader";

const HeaderArticlesContext = createContext(null);

function articleSummary(article, index) {
  const order = Number(article.sortOrder ?? index + 1);
  return {
    id: article.id || article.slug,
    title: article.title,
    cardTitle: article.cardTitle || article.title,
    catColor: article.catColor || "#00F4C8",
    num: article.num || String(Number.isFinite(order) ? order : index + 1).padStart(2, "0"),
  };
}

export function HeaderArticlesSync({ articles }) {
  const setArticles = useContext(HeaderArticlesContext);

  useEffect(() => {
    if (setArticles && articles?.length) {
      setArticles(articles.map(articleSummary));
    }
  }, [articles, setArticles]);

  return null;
}

export default function SiteShell({ children, initialArticles }) {
  const [articles, setArticles] = useState(() => initialArticles.map(articleSummary));

  return (
    <HeaderArticlesContext.Provider value={setArticles}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <SiteHeader articles={articles} />
      {children}
    </HeaderArticlesContext.Provider>
  );
}
