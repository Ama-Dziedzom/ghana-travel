import { getRecipes } from "@/lib/cms/recipes";
import ClientTastePage from "./ClientTastePage";

export default async function TastePage() {
  const recipes = await getRecipes();
  return <ClientTastePage recipes={recipes} />;
}
