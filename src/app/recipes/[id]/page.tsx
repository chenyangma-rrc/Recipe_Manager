import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

type RecipeDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipeDetailsPage({
  params,
}: RecipeDetailsPageProps) {
  const { id } = await params;

  const recipe = await prisma.recipe.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      ingredients: {
        orderBy: {
          position: "asc",
        },
      },
      directions: {
        orderBy: {
          position: "asc",
        },
      },
      recipeCategories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!recipe) {
    notFound();
  }

  return (
    <main>
      <Link href="/recipes">Back to recipes</Link>

      <h1>{recipe.title}</h1>

      <p>{recipe.description}</p>

      <p>
        By {recipe.author.name ?? recipe.author.email} - Prep:{" "}
        {recipe.prepTime} min - Cook: {recipe.cookTime} min - Servings:{" "}
        {recipe.servings}
      </p>

      {recipe.recipeCategories.length > 0 ? (
        <p>
          Categories:{" "}
          {recipe.recipeCategories.map(({ category }) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              {category.name}{" "}
            </Link>
          ))}
        </p>
      ) : null}

      <section>
        <h2>Ingredients</h2>

        {recipe.ingredients.length === 0 ? (
          <p>No ingredients listed.</p>
        ) : (
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.amount} {ingredient.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Directions</h2>

        {recipe.directions.length === 0 ? (
          <p>No directions listed.</p>
        ) : (
          <ol>
            {recipe.directions.map((direction) => (
              <li key={direction.id}>{direction.text}</li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

