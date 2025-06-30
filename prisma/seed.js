const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      password: 'admin123', // En producción, hashear la contraseña
      role: 'ADMIN',
    },
  });
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Usuario Demo',
      password: 'user123', // En producción, hashear la contraseña
      role: 'USER',
    },
  });

  console.log('✅ Usuarios creados');

  // Crear productos
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Laptop Gaming Pro',
        description: 'Laptop de alto rendimiento para juegos',
        price: 1299.99,
        stock: 10,
        category: 'tecnologia',
        imageUrl: 'https://example.com/laptop.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mouse Inalámbrico',
        description: 'Mouse ergonómico inalámbrico',
        price: 29.99,
        stock: 50,
        category: 'accesorios',
        imageUrl: 'https://example.com/mouse.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Teclado Mecánico',
        description: 'Teclado mecánico con switches Cherry MX',
        price: 89.99,
        stock: 25,
        category: 'accesorios',
        imageUrl: 'https://example.com/keyboard.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Monitor 4K',
        description: 'Monitor de 27 pulgadas con resolución 4K',
        price: 399.99,
        stock: 15,
        category: 'tecnologia',
        imageUrl: 'https://example.com/monitor.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Auriculares Bluetooth',
        description: 'Auriculares inalámbricos con cancelación de ruido',
        price: 149.99,
        stock: 30,
        category: 'audio',
        imageUrl: 'https://example.com/headphones.jpg',
      },
    }),
  ]);

  console.log('✅ Productos creados:', products.length);

  // Crear carrito para el usuario demo
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
          },
          {
            productId: products[1].id,
            quantity: 2,
          },
        ],
      },
    },
    include: { items: true },
  });

  console.log('✅ Carrito creado para usuario demo');

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 