import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const duplicates = await prisma.$queryRawUnsafe(`
    SELECT name, array_agg(id) as ids
    FROM "Product"
    GROUP BY name
    HAVING COUNT(*) > 1
  `);

  console.log(JSON.stringify(duplicates, null, 2));
}

main().finally(() => prisma.$disconnect());