import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge/CategoryBadge";

type RecipeCardProps = {
  id: string;
  title: string;
  description: string;
  authorName: string;
  prepTime: number;
  cookTime: number;
  categories: {
    name: string;
    slug: string;
  }[];
};

export function RecipeCard({
  id,
  title,
  description,
  authorName,
  prepTime,
  cookTime,
  categories,
}: RecipeCardProps) {
  return (
    <article>
      <Link href={`/recipes/${id}`}>
        <h2>{title}</h2>
      </Link>

      <p>{description}</p>

      <p>
        By {authorName} - Prep: {prepTime} min - Cook: {cookTime} min
      </p>

      {categories.length > 0 ? (
        <div>
          {categories.map((category) => (
            <CategoryBadge
              key={category.slug}
              name={category.name}
              slug={category.slug}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

