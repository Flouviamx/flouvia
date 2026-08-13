import { getSql } from '../../../lib/neon';
import {
  capabilitiesForRole,
  isOpsRole,
  type OpsMembership,
  type OpsRole,
} from './opsAccess.types';

const OWNER_EMAILS = new Set(['flouvia.mx@gmail.com']);

export async function ensureOpsMembership(input: {
  userId: string;
  email: string;
}): Promise<OpsMembership | null> {
  const sql = getSql();
  const email = input.email.trim().toLowerCase();
  const bootstrapRole: OpsRole = OWNER_EMAILS.has(email) ? 'owner' : 'collaborator';

  await sql`
    INSERT INTO ops_memberships (user_id, role, status)
    VALUES (${input.userId}, ${bootstrapRole}, 'active')
    ON CONFLICT (user_id) DO UPDATE SET
      role = CASE
        WHEN ${bootstrapRole} = 'owner' THEN 'owner'
        ELSE ops_memberships.role
      END,
      status = CASE
        WHEN ${bootstrapRole} = 'owner' THEN 'active'
        ELSE ops_memberships.status
      END
  `;

  const rows = await sql`
    SELECT role, status, permissions
      FROM ops_memberships
     WHERE user_id = ${input.userId}
     LIMIT 1
  ` as Array<Record<string, unknown>>;
  const row = rows[0];
  if (!row || !isOpsRole(row.role)) return null;

  return {
    role: row.role,
    status: row.status === 'revoked' ? 'revoked' : 'active',
    capabilities: capabilitiesForRole(row.role, row.permissions),
  };
}
