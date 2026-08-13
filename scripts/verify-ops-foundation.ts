import { getSql } from '../src/lib/neon';
import { capabilitiesForRole } from '../src/features/ops/access/opsAccess.types';
import { getOpsClientSnapshot, listOpsClients } from '../src/features/ops/clients/opsClients.service';
import { getOpsOverview } from '../src/features/ops/overview/opsOverview.service';
import type { OperatorIdentity } from '../src/features/ops/operatorAccess';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const sql = getSql();
const integrityRows = await sql`
  SELECT
    (SELECT count(*)::int FROM app_users) AS users,
    (SELECT count(*)::int FROM workspaces) AS workspaces,
    (SELECT count(*)::int FROM workspace_members) AS workspace_members,
    (SELECT count(*)::int FROM app_users u
      WHERE NOT EXISTS (
        SELECT 1 FROM workspace_members wm
         WHERE wm.user_id = u.id AND wm.status = 'active'
      )) AS users_without_workspace,
    (SELECT count(*)::int FROM profiles WHERE workspace_id IS NULL) AS profiles_without_workspace,
    (SELECT count(*)::int FROM collaboration_threads WHERE workspace_id IS NULL) AS threads_without_workspace,
    (SELECT count(*)::int FROM ops_memberships WHERE role = 'owner' AND status = 'active') AS active_owners,
    (SELECT count(*)::int FROM pg_trigger
      WHERE tgname = 'trg_ops_audit_no_update' AND NOT tgisinternal) AS immutable_audit_triggers
` as Array<Record<string, unknown>>;

const integrity = integrityRows[0];
assert(integrity, 'OPS integrity query returned no rows');
assert(Number(integrity.users) === Number(integrity.workspaces), 'Every current user must have one backfilled workspace');
assert(Number(integrity.users) === Number(integrity.workspace_members), 'Every current user must have one backfilled membership');
assert(Number(integrity.users_without_workspace) === 0, 'Found app users without an active workspace membership');
assert(Number(integrity.profiles_without_workspace) === 0, 'Found profiles without workspace_id');
assert(Number(integrity.threads_without_workspace) === 0, 'Found collaboration threads without workspace_id');
assert(Number(integrity.active_owners) >= 1, 'OPS must have at least one active owner');
assert(Number(integrity.immutable_audit_triggers) === 1, 'OPS audit log must be protected by its immutable trigger');

const ownerRows = await sql`
  SELECT u.id, u.clerk_user_id, u.primary_email, u.display_name, u.role
    FROM app_users u
    JOIN ops_memberships om ON om.user_id = u.id
   WHERE om.role = 'owner' AND om.status = 'active'
   ORDER BY om.created_at
   LIMIT 1
` as Array<Record<string, unknown>>;
const owner = ownerRows[0];
assert(owner, 'Could not load an OPS owner for overview verification');

const actor: OperatorIdentity = {
  id: String(owner.id),
  clerkUserId: String(owner.clerk_user_id || 'verification'),
  email: String(owner.primary_email),
  displayName: String(owner.display_name || 'Owner'),
  role: owner.role === 'flouvia_admin' ? 'flouvia_admin' : 'client',
  operator: true,
  opsRole: 'owner',
  capabilities: capabilitiesForRole('owner', {}),
};
const overview = await getOpsOverview(actor);
assert(overview.actor.role === 'owner', 'Overview did not preserve the operator role');
assert(overview.metrics.activeWorkspaces === Number(integrity.workspaces), 'Overview workspace count is inconsistent');
assert(Array.isArray(overview.attention), 'Overview attention queue is not available');
assert(Array.isArray(overview.clients), 'Overview client pulse is not available');
assert(Array.isArray(overview.activity), 'Overview activity feed is not available');

const clients = await listOpsClients();
assert(clients.length === Number(integrity.workspaces), 'OPS client directory is inconsistent with workspaces');
const firstClient = clients[0];
assert(firstClient, 'OPS client directory is empty');
const clientSnapshot = await getOpsClientSnapshot(firstClient.workspaceId);
assert(clientSnapshot.workspace.id === firstClient.workspaceId, 'Client 360 loaded a different workspace');
assert(clientSnapshot.profile.companyName.length > 0, 'Client 360 profile has no company name');
assert(Array.isArray(clientSnapshot.projects), 'Client 360 projects are not available');
assert(Array.isArray(clientSnapshot.roadmap), 'Client 360 roadmap is not available');

console.log(JSON.stringify({
  ok: true,
  users: Number(integrity.users),
  workspaces: Number(integrity.workspaces),
  activeOwners: Number(integrity.active_owners),
  attentionItems: overview.attention.length,
  clients: clients.length,
  client360: true,
}));
