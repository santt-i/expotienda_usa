import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

// Configura Cloudinary (usando .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tu API Key de Pexels (obtén una gratis en https://www.pexels.com/api/)
const PEXELS_API_KEY = 'VfNcRDvK8AvXYAvC0NJ3d7WeOfMCOsXlGUPvbGGRrbcpThxNCsWwRXTo';
if (!PEXELS_API_KEY) {
  console.error('❌ Falta PEXELS_API_KEY en el archivo .env');
  process.exit(1);
}

// Mapeo de categorías a queries de búsqueda en Pexels
const CATEGORY_QUERIES: Record<string, string> = {
  'Café': 'colombian coffee beans',
  'Natural': 'natural skincare organic',
  'Moda': 'colombian fashion clothing',
  'Hogar': 'colombian home decor',
  'Tecnología': 'technology gadgets',
  'Alimentos': 'colombian food',
  'Joyería': 'gold jewelry colombian',
  'Deporte': 'sports colombian',
};

async function getPexelsImage(query: string): Promise<string | null> {
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: { Authorization: PEXELS_API_KEY },
      params: { query, per_page: 1, orientation: 'square' },
    });
    const photo = response.data.photos?.[0];
    return photo?.src?.medium || null;
  } catch (error) {
    console.error(`❌ Error en Pexels (${query}):`, error instanceof Error ? error.message : error);
    return null;
  }
}

async function uploadToCloudinary(imageUrl: string, folder: string, publicId: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `expotienda/categories/${folder}`,
      public_id: publicId,
    });
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error subiendo a Cloudinary:`, error instanceof Error ? error.message : error);
    return null;
  }
}

async function main() {
  console.log('🌱 Iniciando asignación de imágenes desde Pexels...\n');

  const categories = await prisma.category.findMany();
  console.log(`📂 Categorías encontradas: ${categories.length}`);

  for (const category of categories) {
    const categoryName = category.name;
    const query = CATEGORY_QUERIES[categoryName];
    if (!query) {
      console.warn(`⚠️ No hay query definida para la categoría "${categoryName}". Se omite.`);
      continue;
    }

    console.log(`🔍 Buscando imagen para "${categoryName}" con query: ${query}`);
    const pexelsUrl = await getPexelsImage(query);
    if (!pexelsUrl) {
      console.warn(`⚠️ No se encontró imagen para "${categoryName}"`);
      continue;
    }

    console.log(`📸 Subiendo imagen a Cloudinary...`);
    const folderName = categoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cloudinaryUrl = await uploadToCloudinary(pexelsUrl, folderName, `pexels_${Date.now()}`);
    if (!cloudinaryUrl) {
      console.warn(`⚠️ No se pudo subir imagen para "${categoryName}"`);
      continue;
    }

    // Actualizar todos los productos de esta categoría que no tengan imagen (o incluso todos)
    const updated = await prisma.product.updateMany({
      where: { categoryId: category.id, images: { equals: [] } },
      data: { images: [cloudinaryUrl] },
    });
    console.log(`✅ ${updated.count} productos de "${categoryName}" actualizados con imagen ${cloudinaryUrl}\n`);
  }

  console.log('🎉 Proceso completado.');
}

main()
  .catch((error) => {
    console.error('❌ Error general:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());