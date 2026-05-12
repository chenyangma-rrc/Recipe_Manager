type DirectionsListProps = {
  directions: {
    id: string;
    text: string;
  }[];
};

export function DirectionsList({ directions }: DirectionsListProps) {
  if (directions.length === 0) {
    return <p>No directions listed.</p>;
  }

  return (
    <ol>
      {directions.map((direction) => (
        <li key={direction.id}>{direction.text}</li>
      ))}
    </ol>
  );
}
