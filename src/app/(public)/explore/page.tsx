import { getArticles } from "@/lib/cms/articles";
import ArticleCard from "@/components/ArticleCard";
import ClientExplorePage from "./ClientExplorePage";

export default async function ExplorePage() {
  const articles = await getArticles();
  return <ClientExplorePage articles={articles} />;
}
