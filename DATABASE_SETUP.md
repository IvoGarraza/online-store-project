# Configuración de Base de Datos PostgreSQL

## Pasos para configurar PostgreSQL

### 1. Instalar PostgreSQL
- **Windows**: Descarga desde [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### 2. Crear la base de datos
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE online_store;

# Conectar a la base de datos
\c online_store

# Ejecutar el script de esquema
\i database/schema.sql
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Configuración de PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=online_store
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_password

# URL de conexión completa (opcional)
DATABASE_URL=postgresql://tu_usuario:tu_password@localhost:5432/online_store
```

### 4. Probar la conexión
```bash
npm run dev
```

Luego visita: `http://localhost:3000/api/health`

## Endpoints de la API

### Salud de la API
- **GET** `/api/health` - Verificar estado de la API y conexión a BD

### Productos
- **GET** `/api/products` - Obtener todos los productos
- **POST** `/api/products` - Crear un nuevo producto
- **GET** `/api/products/[id]` - Obtener un producto específico
- **PUT** `/api/products/[id]` - Actualizar un producto
- **DELETE** `/api/products/[id]` - Eliminar un producto

## Ejemplo de uso

### Crear un producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Producto",
    "description": "Descripción del producto",
    "price": 99.99,
    "stock": 10,
    "category": "tecnologia"
  }'
```

### Obtener todos los productos
```bash
curl http://localhost:3000/api/products
```

## Estructura de la tabla products

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único del producto |
| name | VARCHAR(255) | Nombre del producto |
| description | TEXT | Descripción del producto |
| price | DECIMAL(10,2) | Precio del producto |
| stock | INTEGER | Cantidad en stock |
| category | VARCHAR(100) | Categoría del producto |
| image_url | VARCHAR(500) | URL de la imagen |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización | 