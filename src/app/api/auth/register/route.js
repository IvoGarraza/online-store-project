import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        status: 'error',
        message: 'Todos los campos son obligatorios',
      }, { status: 400 });
    }

    // Verificar si el email ya esta registrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({
        status: 'error',
        message: 'El email ya está registrado',
      }, { status: 409 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: userWithoutPassword,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
} 