export const prerender = false;
import type { APIRoute } from 'astro';
import { getProject, requirePortalIdentity } from '../../../lib/portalDb';
import { portalAccessErrorResponse } from '../../../lib/portalAccess';

export const GET: APIRoute = async ({ locals }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  let identity;
  try { identity = await requirePortalIdentity(locals); }
  catch (error) { return portalAccessErrorResponse(error); }
  const proyecto = await getProject(identity.id);

  const projectId = proyecto?.vercel_project_id;
  if (!projectId) return Response.json({ deploys: [] });

  const token = import.meta.env.VERCEL_TOKEN;
  if (!token) return Response.json({ deploys: [] });

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=8`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!res.ok) return new Response('Vercel error', { status: 502 });

    const json = await res.json();
    const deploys = (json.deployments ?? []).map((d: any) => ({
      sha:      (d.meta?.githubCommitSha ?? d.uid ?? '').slice(0, 7),
      msg:      d.meta?.githubCommitMessage?.split('\n')[0] ?? d.name ?? 'Deploy',
      branch:   d.meta?.githubCommitRef ?? 'main',
      env:      d.target ?? 'production',
      status:   d.state,
      url:      d.url ? `https://${d.url}` : null,
      duration: d.buildingAt && d.ready ? Math.round((d.ready - d.buildingAt) / 1000) : null,
      when:     d.created,
    }));

    return Response.json({ deploys });
  } catch {
    return Response.json({ deploys: [] });
  }
};
