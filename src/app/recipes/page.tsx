import { RecipeList } from "@/components/RecipeList/RecipeList";
import { prisma } from "@/lib/db/prisma";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      recipeCategories: {
        include: {
          category: true,
        },
      },
    },
  });

  const recipeListItems = recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    authorName: recipe.author.name ?? recipe.author.email,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    categories: recipe.recipeCategories.map(({ category }) => ({
      name: category.name,
      slug: category.slug,
    })),
  }));

  return (
    <main>
      <h1>Recipes</h1>
      <RecipeList recipes={recipeListItems} />
    </main>
  );
}




