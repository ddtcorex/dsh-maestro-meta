import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve against this file so the suite runs regardless of process cwd.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('dsh-maestro-meta v2', () => {
  it('cordis.patch.yml contains 7 maestro rows', () => {
    const yml = readFileSync(join(repoRoot, 'cordis.patch.yml'), 'utf8');
    expect(yml).toContain('maestro-remote');
    expect(yml).toContain('maestro-review');
    expect(yml).toContain('maestro-govard');
    expect(yml).toContain('maestro-memory');
    expect(yml).toContain('maestro-mobile');
    expect(yml).toContain('maestro-notifier');
    expect(yml).toContain('maestro-config');
    // count ids
    const count = (yml.match(/- id: maestro-/g) || []).length;
    expect(count).toBe(7);
  });

  it('package.json depends on 7 granular packages + skills', () => {
    // pnpm saves workspace deps with the `workspace:` protocol prefix; accept both spellings.
    const ws = (range: string | undefined, pattern: string) => expect(range).toMatch(new RegExp(`^(workspace:)?${pattern}`));
    const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-notifier'], '\\^0\\.1\\.0');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-config'], '\\^0\\.1\\.0');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-remote'], '\\^0\\.1\\.0');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-review'], '\\^0\\.1\\.0');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-govard'], '\\^0\\.1\\.0');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-memory'], '\\^1\\.');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-mobile'], '\\^1\\.');
    expect(pkg.dependencies['@ddtcorex/maestro-skills']).toBeDefined();
  });

  it('does not contain old harness monolith rows', () => {
    const yml = readFileSync(join(repoRoot, 'cordis.patch.yml'), 'utf8');
    expect(yml).not.toContain('maestro-gitlab-webhook');
    expect(yml).not.toContain('maestro-orchestrator');
  });
});
