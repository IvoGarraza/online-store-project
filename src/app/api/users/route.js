import { NextResponse } from 'next/server';
import { UserService } from '@/services/userService';

// GET - Obtener todos los usuarios
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = parseInt(searchParams.get('skip')) || 0;

    const options = {
      where: role ? { role } : {},
      take: limit,
      skip,
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    };

    const users = await UserService.findAll(options);
    
    return NextResponse.json({
      status: 'success',
      data: users,
      count: users.length,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
}

// POST - Crear un nuevo usuario
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, password, role } = body;

    // Validación básica
    if (!email || !name || !password) {
      return NextResponse.json({
        status: 'error',
        message: 'Email, nombre y contraseña son requeridos',
      }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({
        status: 'error',
        message: 'El email ya está registrado',
      }, { status: 409 });
    }

    const userData = {
      email,
      name,
      password, // En producción, hashear la contraseña
      role: role || 'USER',
    };

    const user = await UserService.create(userData);

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      status: 'success',
      message: 'Usuario creado exitosamente',
      data: userWithoutPassword,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
} 