import { RecipeCard } from "@/components/RecipeCard/RecipeCard";
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

  return (
    <main>
      <h1>Recipes</h1>

      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <div>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              authorName={recipe.author.name ?? recipe.author.email}
              prepTime={recipe.prepTime}
              cookTime={recipe.cookTime}
              categories={recipe.recipeCategories.map(
                ({ category }) => category.name,
              )}
            />
          ))}
        </div>
      )}
    </main>
  );
}


