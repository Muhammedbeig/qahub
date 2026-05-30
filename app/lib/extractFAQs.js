export function extractFAQs(sections) {
  const faqs = [];
  let inFaq = false;
  let currentQ = null;
  for (const sec of sections) {
    if (sec.type === "h2" && sec.text === "Frequently Asked Questions") {
      inFaq = true;
      continue;
    }
    if (inFaq && sec.type === "h2") break;
    if (inFaq && sec.type === "h3") { currentQ = sec.text; continue; }
    if (inFaq && sec.type === "p" && currentQ) {
      faqs.push({ q: currentQ, a: sec.text });
      currentQ = null;
    }
  }
  return faqs;
}
