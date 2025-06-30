import { NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';

// GET - Obtener todos los productos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = parseInt(searchParams.get('skip')) || 0;
    const orderBy = searchParams.get('orderBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let products;

    if (search) {
      products = await ProductService.searchByName(search, {
        take: limit,
        skip,
        orderBy: { [orderBy]: order },
      });
    } else if (category) {
      products = await ProductService.findByCategory(category, {
        take: limit,
        skip,
        orderBy: { [orderBy]: order },
      });
    } else {
      products = await ProductService.findAll({
        take: limit,
        skip,
        orderBy: { [orderBy]: order },
      });
    }
    
    return NextResponse.json({
      status: 'success',
      data: products,
      count: products.length,
      pagination: {
        limit,
        skip,
        hasMore: products.length === limit,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
}

// POST - Crear un nuevo producto
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category, imageUrl } = body;

    // Validación básica
    if (!name || !price) {
      return NextResponse.json({
        status: 'error',
        message: 'Nombre y precio son requeridos',
      }, { status: 400 });
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category: category || 'general',
      imageUrl,
      isActive: true,
    };

    const product = await ProductService.create(productData);

    return NextResponse.json({
      status: 'success',
      message: 'Producto creado exitosamente',
      data: product,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
} 