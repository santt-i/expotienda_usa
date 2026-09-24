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

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Faltan variables de Cloudinary en .env');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Palabras que queremos eliminar del nombre para evitar términos genéricos
const STOP_WORDS = [
  'Premium', 'Orgánico', 'Artesanal', 'Natural', 'Pro', 'Plus',
  'Especial', 'Superior', 'Clásico', 'Original', 'Auténtico',
  'Ecológico', 'Sostenible', 'Gourmet', 'Deluxe', 'Standard',
];

// ─────────────────────────────────────────────
// LIMPIEZA DE NOMBRES
// ─────────────────────────────────────────────
function cleanProductName(name: string): string {
  let cleaned = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ');

  STOP_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

// ─────────────────────────────────────────────
// GENERAR QUERIES INTELIGENTES
// ─────────────────────────────────────────────
function buildSpecificQueries(productName: string, categoryName: string): string[] {
  const cleaned = cleanProductName(productName);
  const words = cleaned.split(' ').filter(w => w.length > 3);
  const mainKeywords = words.slice(0, 3).join(' ');

  const queries: string[] = [];

  // 1. Nombre completo limpio
  if (cleaned.length > 3) queries.push(cleaned);

  // 2. Nombre + categoría (si no está en el nombre)
  if (!cleaned.toLowerCase().includes(categoryName.toLowerCase())) {
    queries.push(`${cleaned} ${categoryName}`);
  }

  // 3. Nombre + "producto" (para e‑commerce)
  queries.push(`${cleaned} producto`);

  // 4. Nombre + "fondo blanco" (para imágenes de estudio)
  queries.push(`${cleaned} fondo blanco`);

  // 5. Nombre + "aislado" (fondo uniforme)
  queries.push(`${cleaned} aislado`);

  // 6. Solo palabras clave principales
  if (mainKeywords && mainKeywords !== cleaned) {
    queries.push(mainKeywords);
    queries.push(`${mainKeywords} ${categoryName}`);
  }

  // 7. Nombre original (sin limpiar) como fallback
  if (productName !== cleaned) {
    queries.push(productName);
    queries.push(`${productName} ${categoryName}`);
  }

  // Eliminamos duplicados y queries demasiado cortas
  const unique = [...new Set(queries)].filter(q => q.length >= 4);
  return unique;
}

// ─────────────────────────────────────────────
// PROBAR API KEY
// ─────────────────────────────────────────────
async function testPexelsKey() {
  try {
    await axios.get('https://api.pexels.com/v1/search', {
      headers: { Authorization: PEXELS_API_KEY! },
      params: { query: 'test', per_page: 1 },
    });
    console.log(`✅ API Key válida`);
    return true;
  } catch (error: any) {
    console.error('❌ Error con API Key:', error.response?.status || error.message);
    return false;
  }
}

// ─────────────────────────────────────────────
// BUSCAR IMAGEN EN PEXELS (orientación cuadrada)
// ─────────────────────────────────────────────
async function getPexelsImage(query: string): Promise<string | null> {
  try {
    const res = await axios.get('https://api.pexels.com/v1/search', {
      headers: { Authorization: PEXELS_API_KEY! },
      params: {
        query,
        per_page: 15,
        orientation: 'square',
        size: 'large',
      },
    });

    const photos = res.data.photos?.filter(
      (photo: any) => photo.width >= 800 && photo.height >= 800
    );

    if (!photos?.length) return null;

    // Priorizar fotos con mayor resolución y que no parezcan logos o ilustraciones
    const sorted = photos.sort((a: any, b: any) => b.width * b.height - a.width * a.height);
    return sorted[0].src.large;
  } catch (err) {
    console.error(`⚠️ Error buscando "${query}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

// ─────────────────────────────────────────────
// SUBIR A CLOUDINARY
// ─────────────────────────────────────────────
async function uploadToCloudinary(imageUrl: string, folder: string, publicId: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `expotienda/products/${folder}`,
      public_id: publicId,
      overwrite: true,
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    });
    return result.secure_url;
  } catch (err) {
    console.error(`⚠️ Error subiendo a Cloudinary: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('\n🎨 Asignando imágenes específicas (Pexels + Cloudinary)...\n');

  const keyValid = await testPexelsKey();
  if (!keyValid) process.exit(1);

  const products = await prisma.product.findMany({
    include: { category: true },
  });

  console.log(`📦 Productos encontrados: ${products.length}\n`);

  let updated = 0;

  for (const product of products) {
    if (!product.category) {
      console.log(`⚠️ Producto sin categoría: ${product.name}`);
      continue;
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 ${product.name}`);
    console.log(`📂 ${product.category.name}`);

    const queries = buildSpecificQueries(product.name, product.category.name);
    console.log(`🔎 Queries: ${queries.join(' · ')}`);

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
      console.log('⚠️ No se encontró ninguna imagen');
      continue;
    }

    const folderName = product.category.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const safeName = product.name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
    const publicId = `${folderName}_${safeName}_${product.id}`;

    console.log('☁️ Subiendo a Cloudinary...');
    const cloudinaryUrl = await uploadToCloudinary(imageUrl, folderName, publicId);

    if (!cloudinaryUrl) {
      console.log('❌ Error al subir');
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { images: [cloudinaryUrl] },
    });

    updated++;
    console.log('✅ Imagen asignada correctamente');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🎉 Proceso completado`);
  console.log(`✅ Productos actualizados: ${updated}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());