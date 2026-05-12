import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
};

export function CategoryBadge({ name, slug }: CategoryBadgeProps) {
  return (
    <Link href={`/categories/${slug}`}>
      <span>{name}</span>
    </Link>
  );
}
