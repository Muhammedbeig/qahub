import QAHubApp from "@/app/components/QAHubApp";
import { getArticles } from "@/app/lib/cms";

export default async function Page() {
  const articles = await getArticles();
  return <QAHubApp articles={articles} />;
}
