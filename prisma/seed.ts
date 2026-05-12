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
    title: "General Tso's Chicken",
    description: "Crispy chicken tossed in a sweet, tangy, and slightly spicy sauce.",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    categorySlugs: ["dinner"],
    ingredients: [
      { name: "Chicken thighs", amount: "1.5 lb" },
      { name: "Cornstarch", amount: "1/2 cup" },
      { name: "Soy sauce", amount: "3 tbsp" },
      { name: "Rice vinegar", amount: "2 tbsp" },
      { name: "Sugar", amount: "2 tbsp" },
      { name: "Dried red chilies", amount: "4" },
    ],
    directions: [
      "Coat chicken pieces with cornstarch.",
      "Pan-fry the chicken until golden and cooked through.",
      "Mix soy sauce, rice vinegar, and sugar in a bowl.",
      "Cook dried chilies briefly, then add the sauce.",
      "Toss the chicken in the sauce until evenly coated.",
    ],
  },
  {
    title: "Beef and Broccoli Stir-Fry",
    description: "A classic Chinese-American takeout favorite with tender beef and crisp broccoli.",
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    categorySlugs: ["dinner", "quick-easy"],
    ingredients: [
      { name: "Beef sirloin", amount: "1 lb" },
      { name: "Broccoli florets", amount: "3 cups" },
      { name: "Soy sauce", amount: "1/4 cup" },
      { name: "Oyster sauce", amount: "2 tbsp" },
      { name: "Garlic", amount: "3 cloves" },
      { name: "Cornstarch", amount: "1 tbsp" },
    ],
    directions: [
      "Slice beef thinly and toss with cornstarch.",
      "Stir-fry beef until browned, then remove from the pan.",
      "Cook broccoli until bright green and tender-crisp.",
      "Add garlic, soy sauce, and oyster sauce.",
      "Return beef to the pan and toss everything together.",
    ],
  },
  {
    title: "Vegetable Fried Rice",
    description: "A quick fried rice with eggs, vegetables, and savory soy sauce.",
    prepTime: 10,
    cookTime: 12,
    servings: 3,
    categorySlugs: ["lunch", "vegetarian", "quick-easy"],
    ingredients: [
      { name: "Cooked rice", amount: "3 cups" },
      { name: "Eggs", amount: "2" },
      { name: "Mixed vegetables", amount: "1.5 cups" },
      { name: "Soy sauce", amount: "3 tbsp" },
      { name: "Green onions", amount: "2" },
      { name: "Sesame oil", amount: "1 tsp" },
    ],
    directions: [
      "Scramble the eggs in a hot pan and set aside.",
      "Stir-fry mixed vegetables for 2 to 3 minutes.",
      "Add cooked rice and break up any clumps.",
      "Add soy sauce, eggs, green onions, and sesame oil.",
      "Stir-fry until the rice is hot and evenly seasoned.",
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
      name: "Chenyang",
    },
    create: {
      name: "Chenyang",
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
