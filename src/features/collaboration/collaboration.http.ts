import { isPortalAccessError } from '../../lib/portalAccess';
import { CollaborationError } from './collaboration.service';

function requestMeta(requestId: string) {
  return { requestId, timestamp: new Date().toISOString() };
}

export function collaborationJson(
  data: unknown,
  requestId: string,
  status = 200,
  extraHeaders?: Record<string, string>,
) {
  return new Response(JSON.stringify({ data, meta: requestMeta(requestId) }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, no-store',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Request-Id': requestId,
      ...extraHeaders,
    },
  });
}

export function collaborationProblem(error: unknown, requestId: string, instance: string) {
  let status = 500;
  let code = 'INTERNAL_ERROR';
  let title = 'No pudimos completar la acción';
  let detail = 'Inténtalo de nuevo en unos momentos.';
  let field: string | undefined;

  if (error instanceof CollaborationError) {
    status = error.status;
    code = error.code;
    detail = error.message;
    field = error.field;
  } else if (isPortalAccessError(error)) {
    status = error.status;
    code = status === 401 ? 'UNAUTHORIZED' : status === 403 ? 'FORBIDDEN' : 'AUTH_UNAVAILABLE';
    title = status === 401 ? 'Inicia sesión para continuar' : 'No tienes acceso a esta acción';
    detail = status === 401 ? 'Tu sesión no está disponible.' : 'Verifica tu acceso con Flouvia.';
  } else {
    console.error(JSON.stringify({
      level: 'error',
      event: 'collaboration_request_failed',
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
  }

  const body = {
    type: `/api/errors/${code.toLowerCase().replaceAll('_', '-')}`,
    title,
    status,
    detail,
    instance,
    requestId,
    ...(field ? { errors: [{ field, message: detail, code }] } : {}),
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/problem+json',
      'Cache-Control': 'private, no-store',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Request-Id': requestId,
    },
  });
}

export async function readJsonObject(request: Request) {
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw new CollaborationError('INVALID_JSON', 400, 'El contenido enviado no es JSON válido.');
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new CollaborationError('INVALID_BODY', 422, 'Revisa la información ingresada.');
  }
  return value as Record<string, unknown>;
}
