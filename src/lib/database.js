import { Pool } from 'pg';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'online-store',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'tala123',
  // Configuraciones adicionales para producción
  max: 20, // máximo número de conexiones en el pool
  idleTimeoutMillis: 30000, // tiempo de inactividad antes de cerrar conexión
  connectionTimeoutMillis: 2000, // tiempo de espera para conexión
});

// Función para probar la conexión
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    return false;
  }
}

// Función para ejecutar consultas
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query ejecutada en', duration, 'ms');
    return res;
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  }
}

// Función para obtener un cliente del pool
export async function getClient() {
  return await pool.connect();
}

export default pool; 