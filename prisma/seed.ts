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

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
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
