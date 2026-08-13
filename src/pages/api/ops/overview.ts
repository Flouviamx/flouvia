export const prerender = false;

import type { APIRoute } from 'astro';
import { getOpsOverview } from '../../../features/ops/overview/opsOverview.service';
import { opsJson, opsProblem } from '../../../features/ops/shared/opsHttp';
import {
  requireOperatorCapability,
  requireOperatorHost,
  requireOperatorIdentity,
} from '../../../features/ops/operatorAccess';

export const GET: APIRoute = async ({ locals, request, url }) => {
  const requestId = crypto.randomUUID();
  try {
    requireOperatorHost(request);
    const identity = await requireOperatorIdentity(locals);
    requireOperatorCapability(identity, 'ops:read');
    return opsJson(await getOpsOverview(identity), requestId);
  } catch (error) {
    return opsProblem(error, requestId, url.pathname);
  }
};
