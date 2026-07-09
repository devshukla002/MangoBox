import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export const isDatabaseConfigured = !!(
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL !== 'YOUR_DATABASE_URL' &&
  process.env.DATABASE_URL.trim() !== ''
);

const getDatabaseUrl = () => {
  if (isDatabaseConfigured) {
    return process.env.DATABASE_URL!;
  }
  
  const user = process.env.SQL_USER || 'ai_studio_app_user';
  const password = process.env.SQL_PASSWORD || '';
  const host = process.env.SQL_HOST || '';
  const dbName = process.env.SQL_DB_NAME || 'cloud_sql_development_database';
  
  // URL-encode password
  const encodedPassword = encodeURIComponent(password);
  
  if (host.startsWith('/')) {
    // Unix socket connection
    return `postgresql://${user}:${encodedPassword}@localhost/${dbName}?host=${host}`;
  }
  
  return `postgresql://${user}:${encodedPassword}@${host}/${dbName}`;
};

const finalDatabaseUrl = isDatabaseConfigured ? process.env.DATABASE_URL! : getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: isDatabaseConfigured ? finalDatabaseUrl : 'postgresql://dummy_user:dummy_password@localhost:5432/dummy_db',
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

