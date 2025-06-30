import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET - Obtener un producto específico por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Producto no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}

// PUT - Actualizar un producto
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, price, stock, category } = body;

    // Verificar si el producto existe
    const checkResult = await query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Producto no encontrado'
      }, { status: 404 });
    }

    const result = await query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [name, description, price, stock, category, id]
    );

    return NextResponse.json({
      status: 'success',
      message: 'Producto actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}

// DELETE - Eliminar un producto
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Verificar si el producto existe
    const checkResult = await query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Producto no encontrado'
      }, { status: 404 });
    }

    await query('DELETE FROM products WHERE id = $1', [id]);

    return NextResponse.json({
      status: 'success',
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
} 