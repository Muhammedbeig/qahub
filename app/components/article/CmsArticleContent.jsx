"use client";

import { useEffect, useRef } from "react";

function citationSource(root, sourceId) {
  return [...root.querySelectorAll("[id]")].find((element) => element.id === sourceId) || null;
}

function synchronizeCitationPopovers(root) {
  root.querySelectorAll('a.citation-ref[href^="#"]').forEach((reference) => {
    const sourceId = reference.getAttribute("href")?.slice(1);
    const source = sourceId ? citationSource(root, sourceId) : null;
    const popover = reference.querySelector(".citation-popover");
    if (!source || !popover) return;

    const title = popover.querySelector(".citation-popover-title");
    const sourceParagraph = source.querySelector("p") || source;
    const sourceAnchor = sourceParagraph.querySelector('a[href^="http"]');
    const sourceLink = document.createElement("span");
    sourceLink.className = "citation-popover-link";
    sourceLink.textContent = "View source ↗";
    if (sourceAnchor?.href) sourceLink.dataset.href = sourceAnchor.href;

    popover.replaceChildren();
    if (title) popover.append(title);
    popover.append(document.createTextNode(sourceParagraph.textContent?.trim() || ""));
    if (sourceAnchor?.href) popover.append(sourceLink);
  });
}

export default function CmsArticleContent({ html }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    synchronizeCitationPopovers(root);
    root.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    const handleClick = (event) => {
      if (!(event.target instanceof Element)) return;

      const popoverLink = event.target.closest(".citation-popover-link");
      if (popoverLink?.dataset.href) {
        event.preventDefault();
        event.stopPropagation();
        window.open(popoverLink.dataset.href, "_blank", "noopener,noreferrer");
        return;
      }

      const reference = event.target.closest('a.citation-ref[href^="#"]');
      if (!reference) return;

      const sourceId = reference.getAttribute("href")?.slice(1);
      const source = sourceId ? citationSource(root, sourceId) : null;
      if (!source) return;

      event.preventDefault();
      const nextHash = `#${sourceId}`;
      if (window.location.hash === nextHash) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
      window.location.hash = sourceId;
    };

    root.addEventListener("click", handleClick);
    return () => root.removeEventListener("click", handleClick);
  }, [html]);

  return <div ref={rootRef} className="cms-rich-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
