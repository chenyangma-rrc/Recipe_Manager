import { RecipeCard } from "@/components/RecipeCard/RecipeCard";

type RecipeListProps = {
  recipes: {
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
  }[];
};

export function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return <p>No recipes found.</p>;
  }

  return (
    <div>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          id={recipe.id}
          title={recipe.title}
          description={recipe.description}
          authorName={recipe.authorName}
          prepTime={recipe.prepTime}
          cookTime={recipe.cookTime}
          categories={recipe.categories}
        />
      ))}
    </div>
  );
}
