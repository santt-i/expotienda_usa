import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Tecnología', icon: '📱', slug: 'tecnologia' },
    { name: 'Café', icon: '☕', slug: 'cafe' },
    { name: 'Natural', icon: '🌿', slug: 'natural' },
    { name: 'Moda', icon: '👜', slug: 'moda' },
    { name: 'Hogar', icon: '🏠', slug: 'hogar' },
    { name: 'Deporte', icon: '⚽', slug: 'deporte' },
    { name: 'Alimentos', icon: '🍎', slug: 'alimentos' },
    { name: 'Joyería', icon: '💎', slug: 'joyeria' },
  ];

  // upsert significa: si ya existe (por el slug) actualiza, si no existe crea
  // Así puedes correr el script varias veces sin duplicar categorías
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`✅ Categoría creada: ${category.icon} ${category.name}`);
  }

  console.log('🎉 Categorías listas');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());