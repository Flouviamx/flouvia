import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let sqlClient: NeonQueryFunction<false, false> | null = null;

function connectionString() {
  return import.meta.env?.DATABASE_URL
    || import.meta.env?.FLOUVIA_DATABASE_URL
    || process.env.DATABASE_URL
    || process.env.FLOUVIA_DATABASE_URL
    || '';
}

export function isNeonConfigured() {
  return Boolean(connectionString());
}

export function getSql() {
  if (sqlClient) return sqlClient;

  const url = connectionString();
  if (!url) {
    throw new Error('DATABASE_URL is not configured. Provision Neon before using the portal.');
  }

  sqlClient = neon(url);
  return sqlClient;
}
