import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const categories = [
  { name: "Breakfast", slug: "breakfast", description: "Morning meals" },
  { name: "Lunch", slug: "lunch", description: "Midday meals" },
  { name: "Dinner", slug: "dinner", description: "Evening meals" },
  { name: "Dessert", slug: "dessert", description: "Sweet treats" },
  { name: "Vegetarian", slug: "vegetarian", description: "Plant-based recipes" },
  { name: "Quick & Easy", slug: "quick-easy", description: "Under 30 minutes" },
];

const recipes = [
  {
    title: "Quick Vegetable Pasta",
    description: "A simple vegetarian pasta for busy weeknights.",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    categorySlugs: ["dinner", "vegetarian", "quick-easy"],
    ingredients: [
      { name: "Pasta", amount: "12 oz" },
      { name: "Olive oil", amount: "2 tbsp" },
      { name: "Garlic", amount: "3 cloves" },
      { name: "Mixed vegetables", amount: "2 cups" },
      { name: "Parmesan cheese", amount: "1/2 cup" },
    ],
    directions: [
      "Cook pasta according to package instructions.",
      "Heat olive oil in a large pan and cook garlic for 1 minute.",
      "Add mixed vegetables and cook until tender.",
      "Toss pasta with vegetables and parmesan cheese.",
    ],
  },
  {
    title: "Berry Yogurt Parfait",
    description: "A quick breakfast with yogurt, berries, and granola.",
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    categorySlugs: ["breakfast", "quick-easy"],
    ingredients: [
      { name: "Greek yogurt", amount: "2 cups" },
      { name: "Mixed berries", amount: "1 cup" },
      { name: "Granola", amount: "1/2 cup" },
      { name: "Honey", amount: "2 tsp" },
    ],
    directions: [
      "Add yogurt to two serving glasses.",
      "Layer berries and granola over the yogurt.",
      "Drizzle honey on top and serve immediately.",
    ],
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const seedUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {
      name: "Demo User",
    },
    create: {
      name: "Demo User",
      email: "demo@example.com",
      password: "seed-password-placeholder",
    },
  });

  await prisma.recipe.deleteMany({
    where: {
      authorId: seedUser.id,
    },
  });

  for (const recipe of recipes) {
    await prisma.recipe.create({
      data: {
        title: recipe.title,
        description: recipe.description,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        authorId: seedUser.id,
        ingredients: {
          create: recipe.ingredients.map((ingredient, index) => ({
            ...ingredient,
            position: index + 1,
          })),
        },
        directions: {
          create: recipe.directions.map((text, index) => ({
            text,
            position: index + 1,
          })),
        },
        recipeCategories: {
          create: recipe.categorySlugs.map((slug) => ({
            category: {
              connect: { slug },
            },
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
