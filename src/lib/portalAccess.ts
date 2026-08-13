import { createClerkClient } from '@clerk/astro/server';

interface ClerkEmail {
  id?: string;
  emailAddress?: string;
  verification?: {
    status?: string | null;
  } | null;
}

export interface PortalClerkUser {
  id: string;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  primaryEmailAddressId?: string | null;
  primaryEmailAddress?: ClerkEmail | null;
  emailAddresses?: ClerkEmail[];
  publicMetadata?: Record<string, unknown>;
}

export class PortalAccessError extends Error {
  constructor(message: string, public status: 401 | 403 | 500 | 503) {
    super(message);
    this.name = 'PortalAccessError';
  }
}

const requestCache = new WeakMap<object, Promise<PortalClerkUser>>();

export function getPortalPrimaryEmail(user: PortalClerkUser) {
  const address = user.primaryEmailAddress
    ?? user.emailAddresses?.find((item) => item.id === user.primaryEmailAddressId)
    ?? user.emailAddresses?.[0];
  return {
    address,
    email: address?.emailAddress?.trim().toLowerCase() ?? '',
  };
}

export function requirePortalAccess(locals: any): Promise<PortalClerkUser> {
  if (locals && typeof locals === 'object') {
    const cached = requestCache.get(locals);
    if (cached) return cached;
    const pending = authorize(locals);
    requestCache.set(locals, pending);
    return pending;
  }
  return authorize(locals);
}

async function authorize(locals: any): Promise<PortalClerkUser> {
  const { userId } = await locals.auth();
  if (!userId) throw new PortalAccessError('Unauthorized', 401);

  const user = await locals.currentUser() as PortalClerkUser | null;
  if (!user?.id) {
    throw new PortalAccessError('Authenticated user could not be loaded', 503);
  }

  if (user.publicMetadata?.flouvia_invited === true) return user;

  const { email } = getPortalPrimaryEmail(user);
  if (!email) throw new PortalAccessError('Authenticated user has no email address', 403);

  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new PortalAccessError('Clerk server credentials are not configured', 500);

  try {
    const clerk = createClerkClient({ secretKey });
    const list = await clerk.invitations.getInvitationList({
      status: 'accepted',
      query: email,
    });
    const invited = list.data?.some(
      (invitation) => invitation.emailAddress?.toLowerCase() === email,
    );
    if (!invited) throw new PortalAccessError('Invitation required', 403);

    const updated = await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { ...user.publicMetadata, flouvia_invited: true },
    });
    return updated as PortalClerkUser;
  } catch (error) {
    if (error instanceof PortalAccessError) throw error;
    throw new PortalAccessError('Could not verify invitation', 503);
  }
}

export function isPortalAccessError(error: unknown): error is PortalAccessError {
  return error instanceof PortalAccessError;
}

export function portalAccessErrorResponse(error: unknown) {
  const status = isPortalAccessError(error) ? error.status : 500;
  const message = status === 401
    ? 'Unauthorized'
    : status === 403
      ? 'Invitation required'
      : 'Could not verify portal access';
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
