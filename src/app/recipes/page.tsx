import Link from "next/link";
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
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link href={`/recipes/${recipe.id}`}>
                <h2>{recipe.title}</h2>
              </Link>

              <p>{recipe.description}</p>

              <p>
                By {recipe.author.name ?? recipe.author.email} - Prep:{" "}
                {recipe.prepTime} min - Cook: {recipe.cookTime} min
              </p>

              {recipe.recipeCategories.length > 0 ? (
                <p>
                  Categories:{" "}
                  {recipe.recipeCategories
                    .map(({ category }) => category.name)
                    .join(", ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

