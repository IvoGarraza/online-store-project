import { prisma } from '@/lib/prisma';

export class ProductService {
  // Obtener todos los productos
  static async findAll(options = {}) {
    const { include, where, orderBy, skip, take } = options;
    
    return await prisma.product.findMany({
      where: {
        ...where,
        isActive: true, // Solo productos activos por defecto
      },
      include,
      orderBy,
      skip,
      take,
    });
  }

  // Obtener producto por ID
  static async findById(id, include = {}) {
    return await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include,
    });
  }

  // Buscar productos por categoría
  static async findByCategory(category, options = {}) {
    return await prisma.product.findMany({
      where: {
        category,
        isActive: true,
      },
      ...options,
    });
  }

  // Buscar productos por nombre
  static async searchByName(name, options = {}) {
    return await prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive', // Búsqueda case-insensitive
        },
        isActive: true,
      },
      ...options,
    });
  }

  // Crear nuevo producto
  static async create(productData) {
    return await prisma.product.create({
      data: productData,
    });
  }

  // Actualizar producto
  static async update(id, productData) {
    return await prisma.product.update({
      where: { id: parseInt(id) },
      data: productData,
    });
  }

  // Eliminar producto (soft delete)
  static async delete(id) {
    return await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });
  }

  // Obtener productos con reviews
  static async findWithReviews(id) {
    return await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  // Obtener productos más vendidos
  static async findBestSellers(limit = 10) {
    return await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      take: limit,
    });
  }

  // Actualizar stock
  static async updateStock(id, quantity) {
    return await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }

  // Obtener productos con stock bajo
  static async findLowStock(threshold = 10) {
    return await prisma.product.findMany({
      where: {
        stock: {
          lte: threshold,
        },
        isActive: true,
      },
    });
  }
} 