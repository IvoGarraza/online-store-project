import { prisma } from '@/lib/prisma';

export class UserService {
  // Obtener todos los usuarios
  static async findAll(options = {}) {
    const { include, where, orderBy, skip, take } = options;
    
    return await prisma.user.findMany({
      where,
      include,
      orderBy,
      skip,
      take,
    });
  }

  // Obtener usuario por ID
  static async findById(id, include = {}) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include,
    });
  }

  // Obtener usuario por email
  static async findByEmail(email, include = {}) {
    return await prisma.user.findUnique({
      where: { email },
      include,
    });
  }

  // Crear nuevo usuario
  static async create(userData) {
    return await prisma.user.create({
      data: userData,
    });
  }

  // Actualizar usuario
  static async update(id, userData) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: userData,
    });
  }

  // Eliminar usuario
  static async delete(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  }

  // Obtener usuario con sus órdenes
  static async findWithOrders(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  // Obtener usuario con sus reviews
  static async findWithReviews(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviews: {
          include: {
            product: true,
          },
        },
      },
    });
  }
} 