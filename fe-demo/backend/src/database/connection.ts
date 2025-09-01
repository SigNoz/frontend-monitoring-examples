import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sql = neon(process.env.NEON_DATABASE_URL!);

export const initializeDatabase = async () => {
  try {
    // Test the connection
    await sql`SELECT 1`;
    console.log('✅ Database connection established successfully');

    // Initialize schema
    await initializeSchema();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

const initializeSchema = async () => {
  try {
    // Read schema file directly
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Split schema into individual statements and execute
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql(statement);
        } catch (stmtError: any) {
          // Ignore errors for statements that might already exist
          console.log(`Note: Statement execution: ${stmtError.message}`);
        }
      }
    }

    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Schema initialization failed:', error);
    throw error;
  }
};

export { sql };
