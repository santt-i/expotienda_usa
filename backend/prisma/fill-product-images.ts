import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────────

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error('❌ Falta PEXELS_API_KEY en .env');
  process.exit(1);
}

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error('❌ Faltan variables de Cloudinary en .env');
  process.exit(1);
}

// ─────────────────────────────────────────────
// CLOUDINARY
// ─────────────────────────────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─────────────────────────────────────────────
// HINTS POR CATEGORÍA
// ─────────────────────────────────────────────

const CATEGORY_HINTS: Record<string, string> = {
  Café: 'colombian coffee',
  Natural: 'organic cosmetic',
  Moda: 'fashion product',
  Hogar: 'home decor',
  Tecnología: 'tech product',
  Alimentos: 'food product',
  Joyería: 'luxury jewelry',
  Deporte: 'sports equipment',
};

// ─────────────────────────────────────────────
// GENERAR QUERIES INTELIGENTES
// ─────────────────────────────────────────────

function buildQueries(
  productName: string,
  categoryName: string,
): string[] {
  const hint = CATEGORY_HINTS[categoryName] || '';

  return [
    `${productName} ${hint}`,
    `${productName} ecommerce`,
    `${productName} isolated`,
    `${productName} white background`,
    `${productName} product photo`,
    `${categoryName} product`,
  ];
}

// ─────────────────────────────────────────────
// PROBAR API KEY
// ─────────────────────────────────────────────

async function testPexelsKey() {
  try {
    const res = await axios.get(
      'https://api.pexels.com/v1/search',
      {
        headers: {
          Authorization: PEXELS_API_KEY!,
        },
        params: {
          query: 'test',
          per_page: 1,
        },
      },
    );

    console.log(`✅ API Key válida (${res.status})`);
    return true;
  } catch (error: any) {
    console.error(
      '❌ Error con API Key:',
      error.response?.status || error.message,
    );

    return false;
  }
}

// ─────────────────────────────────────────────
// BUSCAR IMAGEN EN PEXELS
// ─────────────────────────────────────────────

async function getPexelsImage(
  query: string,
): Promise<string | null> {
  try {
    const res = await axios.get(
      'https://api.pexels.com/v1/search',
      {
        headers: {
          Authorization: PEXELS_API_KEY!,
        },
        params: {
          query,
          per_page: 10,
        },
      },
    );

    const photos = res.data.photos?.filter(
      (photo: any) =>
        photo.width >= 500 &&
        photo.height >= 500,
    );

    if (!photos?.length) {
      return null;
    }

    // Elegir aleatoria para variar resultados
    const randomPhoto =
      photos[Math.floor(Math.random() * photos.length)];

    return randomPhoto.src.large;
  } catch (err) {
    console.error(
      `⚠️ Error buscando "${query}":`,
      err instanceof Error ? err.message : err,
    );

    return null;
  }
}

// ─────────────────────────────────────────────
// SUBIR A CLOUDINARY
// ─────────────────────────────────────────────

async function uploadToCloudinary(
  imageUrl: string,
  folder: string,
  publicId: string,
): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(
      imageUrl,
      {
        folder: `expotienda/products/${folder}`,
        public_id: publicId,
        overwrite: true,
      },
    );

    return result.secure_url;
  } catch (err) {
    console.error(
      `⚠️ Error subiendo a Cloudinary: ${
        err instanceof Error ? err.message : err
      }`,
    );

    return null;
  }
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

async function main() {
  console.log('\n🎨 Iniciando asignación de imágenes...\n');

  const keyValid = await testPexelsKey();

  if (!keyValid) {
    process.exit(1);
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  console.log(`📦 Productos encontrados: ${products.length}\n`);

  let updatedProducts = 0;

  for (const product of products) {

    if (!product.category) {
      console.log(`⚠️ Producto sin categoría: ${product.name}`);
      continue;
    }
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 ${product.name}`);
    console.log(`📂 ${product.category.name}`);

    const queries = buildQueries(
      product.name,
      product.category.name,
    );

    let imageUrl: string | null = null;

    for (const query of queries) {
      process.stdout.write(`🔍 ${query} ... `);

      imageUrl = await getPexelsImage(query);

      if (imageUrl) {
        console.log('✅');
        break;
      }

      console.log('❌');
    }

    if (!imageUrl) {
      console.log('⚠️ No se encontró imagen');
      continue;
    }

    const folderName = product.category.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const publicId = product.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_');

    console.log('☁️ Subiendo a Cloudinary...');

    const cloudinaryUrl = await uploadToCloudinary(
      imageUrl,
      folderName,
      publicId,
    );

    if (!cloudinaryUrl) {
      console.log('❌ Error subiendo imagen');
      continue;
    }

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        images: [cloudinaryUrl],
      },
    });

    updatedProducts++;

    console.log('✅ Imagen asignada correctamente');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🎉 Proceso completado`);
  console.log(`✅ Productos actualizados: ${updatedProducts}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((error) => {
    console.error('❌ Error general:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });