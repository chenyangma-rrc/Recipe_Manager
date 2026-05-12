import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryBadge } from "@/components/CategoryBadge/CategoryBadge";
import { DirectionsList } from "@/components/DirectionsList/DirectionsList";
import { IngredientList } from "@/components/IngredientList/IngredientList";
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
        <div>
          {recipe.recipeCategories.map(({ category }) => (
            <CategoryBadge
              key={category.id}
              name={category.name}
              slug={category.slug}
            />
          ))}
        </div>
      ) : null}

      <section>
        <h2>Ingredients</h2>
        <IngredientList ingredients={recipe.ingredients} />
      </section>

      <section>
        <h2>Directions</h2>
        <DirectionsList directions={recipe.directions} />
      </section>
    </main>
  );
}



