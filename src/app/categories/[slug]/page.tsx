import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipeList } from "@/components/RecipeList/RecipeList";
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
              recipeCategories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const recipes = category.recipeCategories.map(({ recipe }) => ({
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
      <Link href="/categories">Back to categories</Link>

      <h1>{category.name}</h1>

      {category.description ? <p>{category.description}</p> : null}

      <h2>Recipes</h2>

      <RecipeList recipes={recipes} />
    </main>
  );
}



