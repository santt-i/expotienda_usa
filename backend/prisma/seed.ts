import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Ciudades colombianas reales para que los datos se vean auténticos
const COLOMBIAN_CITIES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta', 'Ibagué',
  'Cúcuta', 'Villavicencio', 'Pasto', 'Montería', 'Neiva',
];

// Nombres de tiendas colombianas realistas
const STORE_NAMES = [
  'Café de los Andes', 'Artesanías Colombia', 'Moda Paisa',
  'Esencias del Caribe', 'TechColombia', 'Hogar Andino',
  'Sabores de Colombia', 'Joyería Muisca', 'Deportes Tropicales',
  'Natural Colombia', 'Café Huila Premium', 'Textiles del Valle',
  'Electrónica Bogotá', 'Moda Caleña', 'Productos del Campo',
  'Artesanos del Pacífico', 'Café Nariño', 'Moda Costeña',
  'Tecnología Andina', 'Sabores Paisa',
];

// Productos típicos colombianos por categoría
const PRODUCTS_BY_CATEGORY: Record<string, string[]> = {
  'Café': [
    'Café Especial Huila 500g', 'Café Supremo Nariño 250g',
    'Café Orgánico Sierra Nevada 1kg', 'Café Excelso Antioquia 500g',
    'Café Tostado Artesanal 250g', 'Café Verde sin Tostar 500g',
  ],
  'Natural': [
    'Aceite de Rosa Mosqueta 30ml', 'Crema de Caléndula Natural 50g',
    'Jabón Artesanal de Uchuva', 'Shampoo de Aguacate 250ml',
    'Mascarilla de Barro del Amazonas', 'Serum de Vitamina C Natural',
  ],
  'Moda': [
    'Mochila Wayuu Multicolor', 'Sombrero Vueltiao Original',
    'Ruana de Lana Artesanal', 'Bolso de Cuero Bogotano',
    'Alpargatas Colombianas', 'Camiseta de Algodón Premium',
  ],
  'Hogar': [
    'Hamaca de Algodón Artesanal', 'Mantel Bordado a Mano',
    'Canasta de Mimbre Trenzada', 'Florero de Cerámica Artesanal',
    'Porta Velas de Madera', 'Cojín Bordado Wayuu',
  ],
  'Tecnología': [
    'Audífonos Bluetooth Pro', 'Cargador Solar Portátil',
    'Teclado Mecánico RGB', 'Mouse Inalámbrico Ergonómico',
    'Hub USB-C 7 puertos', 'Soporte para Laptop Ajustable',
  ],
  'Alimentos': [
    'Bocadillo Veleño Artesanal', 'Arequipe Tradicional 500g',
    'Chocolate de Mesa 1kg', 'Panela Orgánica 500g',
    'Maracuyá Deshidratado 200g', 'Guanábana en Almíbar 400g',
  ],
  'Joyería': [
    'Collar de Esmeraldas Colombianas', 'Aretes de Filigrana en Oro',
    'Pulsera de Plata Artesanal', 'Anillo de Oro con Esmeralda',
    'Dije de Tumbaga', 'Collar de Semillas Naturales',
  ],
  'Deporte': [
    'Guayos de Fútbol Profesional', 'Balón de Fútbol Profesional',
    'Camiseta Deportiva Transpirable', 'Guantes de Ciclismo',
    'Rodilleras de Voleibol', 'Maletín de Natación',
  ],
};

async function main() {
  console.log('🌱 Iniciando seed de datos...\n');

  // ─────────────────────────────────────────
  // PASO 1: Obtener categorías existentes
  // ─────────────────────────────────────────
  const categories = await prisma.category.findMany();
  console.log(`✅ ${categories.length} categorías encontradas`);

  // ─────────────────────────────────────────
  // PASO 2: Crear contraseña hasheada
  // Todos los usuarios de prueba tienen la misma contraseña
  // para facilitar las pruebas
  // ─────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Test1234!', 10);

  // ─────────────────────────────────────────
  // PASO 3: Crear 100 clientes
  // ─────────────────────────────────────────
  console.log('\n👥 Creando clientes...');
    const clients: any[] = [];

  for (let i = 0; i < 100; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const client = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: hashedPassword,
        role: Role.CLIENTE,
        country: 'Colombia',
        phone: `+57 ${faker.string.numeric(10)}`,
      },
    });
    clients.push(client);
  }
  console.log(`✅ ${clients.length} clientes creados`);

  // ─────────────────────────────────────────
  // PASO 4: Crear 20 distribuidores con tiendas
  // ─────────────────────────────────────────
  console.log('\n🏪 Creando distribuidores y tiendas...');
  const stores: any[] = [];

  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    // Creamos el distribuidor
    const distributor = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: `distribuidor${i + 1}@expotienda.com`,
        password: hashedPassword,
        role: Role.DISTRIBUIDOR,
        country: 'Colombia',
        phone: `+57 ${faker.string.numeric(10)}`,
      },
    });

    // Creamos su tienda inmediatamente
    // En nuestro sistema cada distribuidor tiene exactamente una tienda
    const store = await prisma.store.create({
      data: {
        name: STORE_NAMES[i],
        description: faker.commerce.productDescription(),
        ownerId: distributor.id,
      },
    });

    stores.push(store);
  }
  console.log(`✅ ${stores.length} tiendas creadas`);

  // ─────────────────────────────────────────
  // PASO 5: Crear productos para cada tienda
  // ─────────────────────────────────────────
  console.log('\n📦 Creando productos...');
  const products: any[] = [];


  for (const store of stores) {
    // Cada tienda tiene entre 8 y 15 productos
    const productCount = faker.number.int({ min: 8, max: 15 });

    for (let i = 0; i < productCount; i++) {
      // Elegimos una categoría aleatoria
      const category = faker.helpers.arrayElement(categories);

      // Buscamos productos típicos de esa categoría
      const categoryProducts = PRODUCTS_BY_CATEGORY[category.name] ?? [];
      const productName = categoryProducts.length > 0
        ? faker.helpers.arrayElement(categoryProducts)
        : faker.commerce.productName();

      const product = await prisma.product.create({
        data: {
          name: productName,
          description: faker.commerce.productDescription(),
          // Precio en COP entre 15,000 y 500,000
          priceCOP: faker.number.int({ min: 15000, max: 500000 }),
          stock: faker.number.int({ min: 0, max: 200 }),
          storeId: store.id,
          categoryId: category.id,
          images: [],
        },
      });

      products.push(product);
    }
  }
  console.log(`✅ ${products.length} productos creados`);

  // ─────────────────────────────────────────
  // PASO 6: Crear órdenes
  // ─────────────────────────────────────────
  console.log('\n🛒 Creando órdenes...');
  const statuses = Object.values(OrderStatus);
  let orderCount = 0;

  for (let i = 0; i < 500; i++) {
    // Elegimos cliente y tienda aleatoriamente
    const client = faker.helpers.arrayElement(clients);
    const store = faker.helpers.arrayElement(stores);

    // Elegimos entre 1 y 4 productos de esa tienda
    const storeProducts = products.filter(p => p.storeId === store.id);
    if (storeProducts.length === 0) continue;

    const itemCount = faker.number.int({ min: 1, max: Math.min(4, storeProducts.length) });
    const selectedProducts = faker.helpers.arrayElements(storeProducts, itemCount);

    // Calculamos el total de la orden
    let total = 0;
    const items = selectedProducts.map(product => {
      const quantity = faker.number.int({ min: 1, max: 5 });
      const price = Number(product.priceCOP);
      total += price * quantity;
      return { productId: product.id, quantity, price };
    });

    // Fecha aleatoria en los últimos 6 meses
    const createdAt = faker.date.past({ years: 0.5 });

    await prisma.order.create({
      data: {
        buyerId: client.id,
        storeId: store.id,
        status: faker.helpers.arrayElement(statuses),
        total,
        createdAt,
        items: {
          create: items,
        },
      },
    });

    orderCount++;
  }
  console.log(`✅ ${orderCount} órdenes creadas`);

  // ─────────────────────────────────────────
  // PASO 7: Crear eventos de comportamiento
  // ─────────────────────────────────────────
  console.log('\n📊 Creando eventos de comportamiento...');

  // Tipos de eventos que rastreamos
  const eventTypes = [
    'product_view',   // usuario vio un producto
    'add_to_cart',    // usuario agregó al carrito
    'search',         // usuario buscó algo
    'purchase',       // usuario completó una compra
    'category_view',  // usuario exploró una categoría
  ];

  // Términos de búsqueda típicos colombianos
  const searchTerms = [
    'café', 'artesanía', 'mochila wayuu', 'esmeraldas',
    'chocolate', 'ruana', 'panela', 'arequipe', 'aguacate',
    'guayos', 'sombrero', 'hamaca', 'canasta',
  ];

  for (let i = 0; i < 2000; i++) {
    const user = faker.helpers.arrayElement(clients);
    const eventType = faker.helpers.arrayElement(eventTypes);
    const product = faker.helpers.arrayElement(products);
    const category = faker.helpers.arrayElement(categories);

    // El payload varía según el tipo de evento
    let payload: Record<string, any> = {};

    if (eventType === 'product_view' || eventType === 'add_to_cart' || eventType === 'purchase') {
      payload = {
        productId: product.id,
        productName: product.name,
        price: Number(product.priceCOP),
        storeId: product.storeId,
      };
    } else if (eventType === 'search') {
      payload = {
        query: faker.helpers.arrayElement(searchTerms),
        resultsCount: faker.number.int({ min: 0, max: 50 }),
      };
    } else if (eventType === 'category_view') {
      payload = {
        categoryId: category.id,
        categoryName: category.name,
      };
    }

    await prisma.event.create({
      data: {
        userId: user.id,
        type: eventType,
        payload,
        createdAt: faker.date.past({ years: 0.5 }),
      },
    });
  }
  console.log('✅ 2000 eventos creados');

  console.log('\n🎉 Seed completado exitosamente');
  console.log('📧 Contraseña de todos los usuarios de prueba: Test1234!');
  console.log('📧 Distribuidores: distribuidor1@expotienda.com ... distribuidor20@expotienda.com');
}

main()
  .catch((error) => {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());