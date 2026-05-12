type IngredientListProps = {
  ingredients: {
    id: string;
    amount: string;
    name: string;
  }[];
};

export function IngredientList({ ingredients }: IngredientListProps) {
  if (ingredients.length === 0) {
    return <p>No ingredients listed.</p>;
  }

  return (
    <ul>
      {ingredients.map((ingredient) => (
        <li key={ingredient.id}>
          {ingredient.amount} {ingredient.name}
        </li>
      ))}
    </ul>
  );
}
