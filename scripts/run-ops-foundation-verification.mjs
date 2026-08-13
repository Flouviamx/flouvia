import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const directory = await mkdtemp(join(tmpdir(), 'flouvia-ops-foundation-'));
const output = join(directory, 'verify.mjs');

try {
  const build = spawnSync(resolve('node_modules/.bin/esbuild'), [
    'scripts/verify-ops-foundation.ts',
    '--bundle',
    '--platform=node',
    '--format=esm',
    `--outfile=${output}`,
  ], { stdio: 'inherit' });

  if (build.status !== 0) process.exitCode = build.status || 1;
  else await import(pathToFileURL(output).href);
} finally {
  await rm(directory, { recursive: true, force: true });
}
