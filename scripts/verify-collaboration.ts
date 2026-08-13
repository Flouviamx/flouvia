import { getSql } from '../src/lib/neon';
import type { PortalIdentity, PortalRole } from '../src/lib/portalDb';
import {
  changeCollaborationThread,
  CollaborationError,
  createCollaborationComment,
  createCollaborationThread,
  getCollaborationSnapshot,
} from '../src/features/collaboration/collaboration.service';

type UserRow = {
  id: string;
  clerk_user_id: string;
  primary_email: string;
  display_name: string;
  role: PortalRole;
};

function identity(row: UserRow): PortalIdentity {
  return {
    id: row.id,
    clerkUserId: row.clerk_user_id,
    email: row.primary_email,
    displayName: row.display_name,
    role: row.role,
  };
}

async function expectStatus(action: () => Promise<unknown>, status: number) {
  try {
    await action();
  } catch (error) {
    if (error instanceof CollaborationError && error.status === status) return;
    throw error;
  }
  throw new Error(`Expected collaboration error ${status}`);
}

const sql = getSql();
const users = await sql`
  SELECT id, clerk_user_id, primary_email, display_name, role
    FROM app_users
   WHERE status = 'active'
     AND clerk_user_id IS NOT NULL
   ORDER BY role DESC, created_at
` as UserRow[];

const adminRow = users.find((user) => user.role === 'flouvia_admin');
const clientRow = users.find((user) => user.role === 'client');
if (!adminRow || !clientRow) throw new Error('Verification requires one admin and one client');

const admin = identity(adminRow);
const client = identity(clientRow);
let threadId = '';

try {
  threadId = await createCollaborationThread(client, {
    workspaceId: client.id,
    title: '[verification] Collaboration permissions',
    body: 'Temporary row created by the automated permission verification.',
    isImportant: true,
  });

  await createCollaborationComment(client, {
    threadId,
    body: 'Shared client verification comment.',
    visibility: 'shared',
  });
  await expectStatus(() => changeCollaborationThread(client, {
    threadId,
    status: 'resolved',
  }), 403);
  await expectStatus(() => createCollaborationComment(client, {
    threadId,
    body: 'This must never be created.',
    visibility: 'internal',
  }), 403);
  await expectStatus(() => getCollaborationSnapshot(client, admin.id), 404);

  await changeCollaborationThread(admin, {
    threadId,
    status: 'in_progress',
    pinned: true,
  });
  await createCollaborationComment(admin, {
    threadId,
    body: 'Internal admin verification note.',
    visibility: 'internal',
  });

  const clientSnapshot = await getCollaborationSnapshot(client);
  const adminSnapshot = await getCollaborationSnapshot(admin, client.id);
  const clientThread = clientSnapshot.threads.find((thread) => thread.id === threadId);
  const adminThread = adminSnapshot.threads.find((thread) => thread.id === threadId);

  if (!clientThread || !adminThread) throw new Error('Created thread was not returned');
  if (clientThread.status !== 'in_progress' || !clientThread.pinned) {
    throw new Error('Admin status or pin update was not persisted');
  }
  if (clientThread.comments.some((comment) => comment.visibility === 'internal')) {
    throw new Error('Client snapshot exposed an internal note');
  }
  if (!adminThread.comments.some((comment) => comment.visibility === 'internal')) {
    throw new Error('Admin snapshot did not include its internal note');
  }

  console.log('Collaboration verification passed: tenant isolation, RBAC, shared comments, and internal notes.');
} finally {
  if (threadId) {
    await sql`DELETE FROM collaboration_threads WHERE id = ${threadId}`;
  }
}
