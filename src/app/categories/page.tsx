import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          recipeCategories: true,
        },
      },
    },
  });

  return (
    <main>
      <h1>Categories</h1>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/categories/${category.slug}`}>
                {category.name}
              </Link>{" "}
              <span>({category._count.recipeCategories} recipes)</span>
              {category.description ? <p>{category.description}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

