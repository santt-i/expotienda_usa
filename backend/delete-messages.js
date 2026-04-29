const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.message.deleteMany();
  console.log(`✅ ${deleted.count} mensajes eliminados`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());