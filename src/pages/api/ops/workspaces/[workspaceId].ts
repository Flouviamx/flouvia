export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { updateOpsClientProfileSchema } from '../../../../features/ops/clients/opsClients.schemas';
import {
  getOpsClientSnapshot,
  updateOpsClientProfile,
} from '../../../../features/ops/clients/opsClients.service';
import { OpsError, opsJson, opsProblem, parseOpsJson } from '../../../../features/ops/shared/opsHttp';
import {
  requireOperatorCapability,
  requireOperatorHost,
  requireOperatorIdentity,
  requireOperatorRequestOrigin,
} from '../../../../features/ops/operatorAccess';
import { rateLimit } from '../../../../lib/rateLimit';

const workspaceIdSchema = z.uuid();

function workspaceId(value: string | undefined) {
  const parsed = workspaceIdSchema.safeParse(value);
  if (!parsed.success) throw new OpsError('INVALID_WORKSPACE_ID', 404, 'No encontramos este cliente.');
  return parsed.data;
}

export const GET: APIRoute = async ({ locals, request, params, url }) => {
  const requestId = crypto.randomUUID();
  try {
    requireOperatorHost(request);
    const identity = await requireOperatorIdentity(locals);
    requireOperatorCapability(identity, 'ops:read');
    return opsJson(await getOpsClientSnapshot(workspaceId(params.workspaceId)), requestId);
  } catch (error) {
    return opsProblem(error, requestId, url.pathname);
  }
};

export const PATCH: APIRoute = async ({ locals, request, params, url }) => {
  const requestId = crypto.randomUUID();
  try {
    requireOperatorHost(request);
    requireOperatorRequestOrigin(request);
    const identity = await requireOperatorIdentity(locals);
    requireOperatorCapability(identity, 'clients:write');
    if (!rateLimit(`ops-client-write:${identity.id}`, 30, 60_000)) {
      throw new OpsError('RATE_LIMITED', 429, 'Espera un momento antes de volver a intentar.');
    }
    const data = await parseOpsJson(request, updateOpsClientProfileSchema);
    return opsJson(await updateOpsClientProfile({
      workspaceId: workspaceId(params.workspaceId),
      actorUserId: identity.id,
      requestId,
      data,
    }), requestId);
  } catch (error) {
    return opsProblem(error, requestId, url.pathname);
  }
};
