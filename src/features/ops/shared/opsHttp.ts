import { ZodError, type ZodType } from 'zod';
import { isPortalAccessError } from '../../../lib/portalAccess';

export class OpsError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
    readonly field?: string,
  ) {
    super(message);
    this.name = 'OpsError';
  }
}

function secureHeaders(requestId: string) {
  return {
    'Cache-Control': 'private, no-store',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-Request-Id': requestId,
  };
}

export function opsJson(data: unknown, requestId: string, status = 200) {
  return new Response(JSON.stringify({
    data,
    meta: { requestId, timestamp: new Date().toISOString() },
  }), {
    status,
    headers: { 'Content-Type': 'application/json', ...secureHeaders(requestId) },
  });
}

export async function parseOpsJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw new OpsError('INVALID_JSON', 400, 'El contenido enviado no es JSON válido.');
  }
  return schema.parse(value);
}

export function opsProblem(error: unknown, requestId: string, instance: string) {
  let status = 500;
  let code = 'INTERNAL_ERROR';
  let title = 'No pudimos completar la acción';
  let detail = 'Inténtalo nuevamente en unos momentos.';
  let field: string | undefined;

  if (error instanceof OpsError) {
    status = error.status;
    code = error.code;
    detail = error.message;
    field = error.field;
  } else if (error instanceof ZodError) {
    status = 422;
    code = 'VALIDATION_ERROR';
    title = 'Revisa la información';
    detail = 'Uno o más campos no son válidos.';
    field = error.issues[0]?.path.join('.') || undefined;
  } else if (isPortalAccessError(error)) {
    status = error.status;
    code = status === 401 ? 'UNAUTHORIZED' : status === 403 ? 'FORBIDDEN' : 'AUTH_UNAVAILABLE';
    title = status === 401 ? 'Inicia sesión para continuar' : 'No tienes acceso a esta acción';
    detail = status === 401
      ? 'Tu sesión no está disponible.'
      : 'Tu cuenta no tiene el permiso necesario.';
  } else {
    console.error(JSON.stringify({
      level: 'error',
      event: 'ops_request_failed',
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
  }

  return new Response(JSON.stringify({
    type: `/api/errors/${code.toLowerCase().replaceAll('_', '-')}`,
    title,
    status,
    detail,
    instance,
    requestId,
    ...(field ? { errors: [{ field, message: detail, code }] } : {}),
  }), {
    status,
    headers: { 'Content-Type': 'application/problem+json', ...secureHeaders(requestId) },
  });
}
