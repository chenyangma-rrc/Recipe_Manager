import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

type CategoryDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryDetailsPage({
  params,
}: CategoryDetailsPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
    include: {
      recipeCategories: {
        include: {
          recipe: {
            include: {
              author: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main>
      <Link href="/categories">Back to categories</Link>

      <h1>{category.name}</h1>

      {category.description ? <p>{category.description}</p> : null}

      <h2>Recipes</h2>

      {category.recipeCategories.length === 0 ? (
        <p>No recipes in this category yet.</p>
      ) : (
        <ul>
          {category.recipeCategories.map(({ recipe }) => (
            <li key={recipe.id}>
              <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
              <p>{recipe.description}</p>
              <p>
                By {recipe.author.name ?? recipe.author.email} · Prep:{" "}
                {recipe.prepTime} min · Cook: {recipe.cookTime} min
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

