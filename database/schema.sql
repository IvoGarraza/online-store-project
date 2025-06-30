-- Crear la base de datos (ejecutar esto primero si no existe)
-- CREATE DATABASE online_store;

-- Conectar a la base de datos
-- \c online_store;

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category VARCHAR(100) DEFAULT 'general',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Insertar algunos productos de ejemplo
INSERT INTO products (name, description, price, stock, category) VALUES
('Laptop Gaming', 'Laptop de alto rendimiento para juegos', 1299.99, 10, 'tecnologia'),
('Mouse Inalámbrico', 'Mouse ergonómico inalámbrico', 29.99, 50, 'accesorios'),
('Teclado Mecánico', 'Teclado mecánico con switches Cherry MX', 89.99, 25, 'accesorios'),
('Monitor 4K', 'Monitor de 27 pulgadas con resolución 4K', 399.99, 15, 'tecnologia'),
('Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 149.99, 30, 'audio');

-- Crear función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 