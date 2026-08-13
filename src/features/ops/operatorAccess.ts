import {
  getPortalPrimaryEmail,
  PortalAccessError,
  type PortalClerkUser,
} from '../../lib/portalAccess';
import { upsertAppUser, type PortalIdentity } from '../../lib/portalDb';
import { ensureOpsMembership } from './access/opsAccess.repository';
import type { OpsCapability, OpsRole } from './access/opsAccess.types';

export interface OperatorIdentity extends PortalIdentity {
  operator: true;
  opsRole: OpsRole;
  capabilities: OpsCapability[];
}

const TEAM_DOMAIN = '@flouvia.com';
const OWNER_EMAILS = new Set([
  'flouvia.mx@gmail.com',
]);

export function isOperatorEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(TEAM_DOMAIN) || OWNER_EMAILS.has(normalized);
}

export async function requireOperatorIdentity(locals: any): Promise<OperatorIdentity> {
  const { userId } = await locals.auth();
  if (!userId) {
    throw new PortalAccessError('Unauthorized', 401);
  }

  // OPS is an internal product. Unlike OS clients, team members are authorized
  // by their verified company identity and do not need a client invitation.
  const user = await locals.currentUser() as PortalClerkUser | null;
  if (!user?.id) {
    throw new PortalAccessError('Authenticated user could not be loaded', 503);
  }
  const { address, email } = getPortalPrimaryEmail(user);

  if (!isOperatorEmail(email)) {
    throw new PortalAccessError('Flouvia team account required', 403);
  }

  // OPS never trusts an address that Clerk has not explicitly verified.
  if (address?.verification?.status !== 'verified') {
    throw new PortalAccessError('Verified Flouvia email required', 403);
  }

  const identity = await upsertAppUser(user);
  const membership = await ensureOpsMembership({ userId: identity.id, email });
  if (!membership || membership.status !== 'active') {
    throw new PortalAccessError('Active Flouvia operator membership required', 403);
  }
  return {
    ...identity,
    operator: true,
    opsRole: membership.role,
    capabilities: membership.capabilities,
  };
}

export function requireOperatorCapability(
  identity: OperatorIdentity,
  capability: OpsCapability,
) {
  if (!identity.capabilities.includes(capability)) {
    throw new PortalAccessError('Operator permission required', 403);
  }
}

export function isOperatorHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === 'ops.flouvia.com') return true;
  return import.meta.env.DEV && (host === 'localhost' || host === '127.0.0.1');
}

export function requireOperatorHost(request: Request) {
  const hostname = new URL(request.url).hostname;
  if (!isOperatorHost(hostname)) {
    throw new PortalAccessError('Operator console host required', 403);
  }
}

export function requireOperatorRequestOrigin(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('origin');
  if (!origin) throw new PortalAccessError('Trusted operator origin required', 403);

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    throw new PortalAccessError('Trusted operator origin required', 403);
  }

  const sameOrigin = originUrl.protocol === requestUrl.protocol
    && originUrl.host.toLowerCase() === requestUrl.host.toLowerCase();
  if (!sameOrigin || !isOperatorHost(originUrl.hostname)) {
    throw new PortalAccessError('Trusted operator origin required', 403);
  }
}
