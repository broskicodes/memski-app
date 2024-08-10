import { neon } from '@neondatabase/serverless';

if (!process.env.NEON_DB_URL) {
  throw new Error('NEON_DB_URL must be a Neon postgres connection string');
}

const sql = neon(process.env.NEON_DB_URL);

export const addEmail = async (email: string): Promise<{ success: boolean, error?: any}> => {
  try {
    await sql`INSERT INTO emails (email) VALUES (${email})`;
    return { success: true };
  } catch (error) {
    console.error('Error inserting email:', error);
    return { success: false, error };
  }
};