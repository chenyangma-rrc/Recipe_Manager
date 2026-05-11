import Link from "next/link";

export function Navigation() {
  return (
    <header>
      <nav>
        <Link href="/">Recipe Manager</Link>
        <Link href="/recipes">Recipes</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </nav>
    </header>
  );
}
