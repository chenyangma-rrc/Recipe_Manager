import Link from "next/link";

type RecipeCardProps = {
  id: string;
  title: string;
  description: string;
  authorName: string;
  prepTime: number;
  cookTime: number;
  categories: string[];
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
        <p>Categories: {categories.join(", ")}</p>
      ) : null}
    </article>
  );
}
