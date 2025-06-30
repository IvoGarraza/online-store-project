# Guía de Prisma - ORM para Next.js

## ¿Qué es Prisma?

Prisma es un ORM (Object-Relational Mapping) moderno para Node.js y TypeScript que te permite trabajar con bases de datos de manera más eficiente y segura. Es muy similar a Sequelize pero con mejor tipado y una sintaxis más intuitiva.

## Ventajas de Prisma vs Sequelize

- ✅ **Mejor tipado**: Soporte nativo de TypeScript
- ✅ **Sintaxis más limpia**: Menos código boilerplate
- ✅ **Prisma Studio**: Interfaz visual para la base de datos
- ✅ **Migraciones automáticas**: Generación automática de migraciones
- ✅ **Validación automática**: Validación de esquemas en tiempo de compilación

## Estructura de Modelos

### Comparación con Sequelize

**Sequelize:**
```javascript
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: DataTypes.STRING,
  password: DataTypes.STRING
});
```

**Prisma:**
```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  name     String
  password String
}
```

## Comandos de Prisma

### 1. Generar el cliente
```bash
npm run db:generate
```

### 2. Sincronizar esquema con la base de datos
```bash
npm run db:push
```

### 3. Crear y aplicar migraciones
```bash
npm run db:migrate
```

### 4. Abrir Prisma Studio (interfaz visual)
```bash
npm run db:studio
```

### 5. Poblar la base de datos con datos de ejemplo
```bash
npm run db:seed
```

## Uso de los Servicios

### UserService (Equivalente a UserController en Sequelize)

```javascript
import { UserService } from '@/services/userService';

// Obtener todos los usuarios
const users = await UserService.findAll({
  where: { role: 'USER' },
  include: { orders: true },
  take: 10,
  skip: 0
});

// Obtener usuario por ID
const user = await UserService.findById(1, {
  orders: true,
  reviews: true
});

// Crear usuario
const newUser = await UserService.create({
  email: 'user@example.com',
  name: 'Juan Pérez',
  password: 'hashedPassword',
  role: 'USER'
});

// Actualizar usuario
const updatedUser = await UserService.update(1, {
  name: 'Juan Carlos Pérez'
});

// Eliminar usuario
await UserService.delete(1);
```

### ProductService (Equivalente a ProductController en Sequelize)

```javascript
import { ProductService } from '@/services/productService';

// Obtener todos los productos
const products = await ProductService.findAll({
  where: { category: 'tecnologia' },
  orderBy: { price: 'asc' },
  take: 20
});

// Buscar productos por nombre
const searchResults = await ProductService.searchByName('laptop');

// Obtener productos por categoría
const techProducts = await ProductService.findByCategory('tecnologia');

// Obtener productos más vendidos
const bestSellers = await ProductService.findBestSellers(10);

// Obtener productos con stock bajo
const lowStock = await ProductService.findLowStock(5);
```

## Relaciones (Como en Sequelize)

### Relaciones Uno a Muchos
```prisma
model User {
  id     Int      @id @default(autoincrement())
  email  String   @unique
  orders Order[]  // Un usuario puede tener muchas órdenes
}

model Order {
  id     Int   @id @default(autoincrement())
  userId Int   @map("user_id")
  user   User  @relation(fields: [userId], references: [id])
}
```

### Relaciones Muchos a Muchos
```prisma
model Product {
  id       Int      @id @default(autoincrement())
  name     String
  categories ProductCategory[]
}

model Category {
  id       Int      @id @default(autoincrement())
  name     String
  products ProductCategory[]
}

model ProductCategory {
  productId  Int
  categoryId Int
  product    Product  @relation(fields: [productId], references: [id])
  category   Category @relation(fields: [categoryId], references: [id])

  @@id([productId, categoryId])
}
```

## Consultas Avanzadas

### Incluir relaciones
```javascript
// Obtener usuario con sus órdenes y productos
const userWithOrders = await UserService.findWithOrders(1);

// Obtener producto con reviews y usuarios
const productWithReviews = await ProductService.findWithReviews(1);
```

### Filtros complejos
```javascript
// Productos con precio entre $50 y $200
const products = await prisma.product.findMany({
  where: {
    price: {
      gte: 50,
      lte: 200
    },
    isActive: true
  }
});

// Usuarios que han hecho más de 5 órdenes
const activeUsers = await prisma.user.findMany({
  where: {
    orders: {
      _count: {
        gt: 5
      }
    }
  }
});
```

### Agregaciones
```javascript
// Total de ventas por categoría
const salesByCategory = await prisma.product.groupBy({
  by: ['category'],
  _sum: {
    price: true
  }
});

// Promedio de ratings por producto
const avgRatings = await prisma.review.groupBy({
  by: ['productId'],
  _avg: {
    rating: true
  }
});
```

## Migraciones

### Crear una nueva migración
```bash
npx prisma migrate dev --name add_user_phone
```

### Aplicar migraciones en producción
```bash
npx prisma migrate deploy
```

### Resetear la base de datos
```bash
npx prisma migrate reset
```

## Variables de Entorno

Asegúrate de tener configurado tu archivo `.env.local`:

```env
DATABASE_URL="postgresql://postgres:tala123@localhost:5432/online-store"
```

## Prisma Studio

Prisma Studio es una interfaz visual para tu base de datos:

```bash
npm run db:studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde puedes:
- Ver todas las tablas
- Editar datos directamente
- Ejecutar consultas
- Ver relaciones entre tablas

## Mejores Prácticas

1. **Usar servicios**: Encapsula la lógica de negocio en servicios
2. **Validación**: Usa Zod o Joi para validar datos de entrada
3. **Transacciones**: Usa transacciones para operaciones complejas
4. **Índices**: Agrega índices para mejorar el rendimiento
5. **Soft deletes**: Usa `isActive` en lugar de eliminar registros

## Ejemplo de Transacción

```javascript
// Crear orden con items
const order = await prisma.$transaction(async (tx) => {
  // Crear la orden
  const newOrder = await tx.order.create({
    data: {
      userId: 1,
      total: 299.99,
      shippingAddress: 'Calle Principal 123'
    }
  });

  // Crear items de la orden
  await tx.orderItem.createMany({
    data: [
      {
        orderId: newOrder.id,
        productId: 1,
        quantity: 2,
        price: 149.99
      }
    ]
  });

  // Actualizar stock
  await tx.product.update({
    where: { id: 1 },
    data: {
      stock: {
        decrement: 2
      }
    }
  });

  return newOrder;
});
```

¡Con Prisma tienes una ORM moderna y potente que te permitirá trabajar con tu base de datos de manera más eficiente que con Sequelize! 