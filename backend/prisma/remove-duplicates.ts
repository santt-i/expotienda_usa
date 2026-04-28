import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const duplicates: any[] = await prisma.$queryRawUnsafe(`
    SELECT 
      name,
      array_agg(id ORDER BY id) as ids
    FROM "Product"
    GROUP BY name
    HAVING COUNT(*) > 1
  `);

  console.log(`🔍 Duplicados encontrados: ${duplicates.length}`);

  let deleted = 0;

  for (const duplicate of duplicates) {

    // PostgreSQL devuelve strings
    const ids = duplicate.ids.map(
      (id: string) => Number(id)
    );

    // Mantener el primero
    const keepId = ids[0];

    // Borrar los demás
    const deleteIds = ids.slice(1);

    console.log(`\n━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 ${duplicate.name}`);
    console.log(`✅ Mantener ID: ${keepId}`);
    console.log(`❌ Eliminar IDs: ${deleteIds.join(', ')}`);

    // ─────────────────────────────
    // BORRAR RELACIONES
    // ─────────────────────────────

    await prisma.orderItem.deleteMany({
      where: {
        productId: {
          in: deleteIds,
        },
      },
    });
    await prisma.orderItem.deleteMany({
  where: {
    productId: {
      in: deleteIds,
    },
  },
});

await prisma.cartItem.deleteMany({
  where: {
    productId: {
      in: deleteIds,
    },
  },
});

    // Si tienes más relaciones,
    // agrégalas aquí.

    // ─────────────────────────────
    // BORRAR PRODUCTOS
    // ─────────────────────────────

    const result = await prisma.product.deleteMany({
      where: {
        id: {
          in: deleteIds,
        },
      },
    });

    deleted += result.count;

    console.log(`🗑️ Eliminados: ${result.count}`);
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 Limpieza completada`);
  console.log(`✅ Productos eliminados: ${deleted}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━`);
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });