#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || process.env.FLOUVIA_DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL or FLOUVIA_DATABASE_URL is required');
}

const migrationsUrl = new URL('../neon/migrations/', import.meta.url);
const migrationFiles = (await readdir(migrationsUrl))
  .filter((file) => file.endsWith('.sql'))
  .sort((a, b) => a.localeCompare(b));
if (!migrationFiles.length) throw new Error('No Neon migrations found');

const sql = neon(databaseUrl);
for (const file of migrationFiles) {
  const migration = await readFile(new URL(file, migrationsUrl), 'utf8');
  const statements = splitSqlStatements(migration);
  if (!statements.length) throw new Error(`No SQL statements found in ${file}`);
  await sql.transaction(statements.map((statement) => sql`${sql.unsafe(statement)}`));
}

const rows = await sql`
  SELECT COUNT(*)::int AS table_count
    FROM information_schema.tables
   WHERE table_schema = 'public'
     AND table_name IN (
       'app_users', 'profiles', 'projects', 'finance_configs', 'invoices',
       'vault_files', 'roadmap_items', 'tickets', 'ticket_counters',
       'notifications', 'announcements', 'changelog', 'push_subscriptions',
       'collaboration_threads', 'collaboration_comments', 'workspaces',
       'workspace_members', 'ops_memberships', 'ops_audit_events',
       'ops_idempotency_keys'
     )
`;

console.log(`Neon schema applied: ${rows[0].table_count}/20 portal tables present (${migrationFiles.length} migrations).`);

function splitSqlStatements(source) {
  const statements = [];
  let current = '';
  let singleQuoted = false;
  let doubleQuoted = false;
  let lineComment = false;
  let blockComment = false;
  let dollarTag = null;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      current += char;
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      current += char;
      if (char === '*' && next === '/') {
        current += next;
        index += 1;
        blockComment = false;
      }
      continue;
    }
    if (dollarTag) {
      if (source.startsWith(dollarTag, index)) {
        current += dollarTag;
        index += dollarTag.length - 1;
        dollarTag = null;
      } else {
        current += char;
      }
      continue;
    }
    if (!singleQuoted && !doubleQuoted && char === '-' && next === '-') {
      current += char + next;
      index += 1;
      lineComment = true;
      continue;
    }
    if (!singleQuoted && !doubleQuoted && char === '/' && next === '*') {
      current += char + next;
      index += 1;
      blockComment = true;
      continue;
    }
    if (!singleQuoted && !doubleQuoted && char === '$') {
      const match = source.slice(index).match(/^\$[A-Za-z_][A-Za-z0-9_]*\$|^\$\$/);
      if (match) {
        dollarTag = match[0];
        current += dollarTag;
        index += dollarTag.length - 1;
        continue;
      }
    }
    if (!doubleQuoted && char === "'") {
      current += char;
      if (singleQuoted && next === "'") {
        current += next;
        index += 1;
      } else {
        singleQuoted = !singleQuoted;
      }
      continue;
    }
    if (!singleQuoted && char === '"') {
      current += char;
      if (doubleQuoted && next === '"') {
        current += next;
        index += 1;
      } else {
        doubleQuoted = !doubleQuoted;
      }
      continue;
    }
    if (!singleQuoted && !doubleQuoted && char === ';') {
      if (current.trim()) statements.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  if (current.trim()) statements.push(current.trim());
  if (singleQuoted || doubleQuoted || dollarTag || blockComment) {
    throw new Error('Migration SQL contains an unterminated quote or comment');
  }
  return statements;
}
