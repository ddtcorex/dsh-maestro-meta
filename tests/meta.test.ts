import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('dsh-maestro-meta v2', () => {
  it('cordis.patch.yml contains 6 maestro rows', () => {
    const yml = readFileSync('dsh-maestro-meta/cordis.patch.yml', 'utf8');
    expect(yml).toContain('maestro-remote');
    expect(yml).toContain('maestro-review');
    expect(yml).toContain('maestro-govard');
    expect(yml).toContain('maestro-memory');
    expect(yml).toContain('maestro-mobile');
    expect(yml).toContain('maestro-notifier');
    // count ids
    const count = (yml.match(/- id: maestro-/g) || []).length;
    expect(count).toBe(6);
  });

  it('package.json depends on 6 granular packages + skills', () => {
    // pnpm saves workspace deps with the `workspace:` protocol prefix; accept both spellings.
    const ws = (range: string | undefined, pattern: string) => expect(range).toMatch(new RegExp(`^(workspace:)?${pattern}`));
    const pkg = JSON.parse(readFileSync('dsh-maestro-meta/package.json', 'utf8'));
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-notifier'], '\\^0\\.1\\.0');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-remote'], '\\^0\\.1\\.0');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-review'], '\\^0\\.1\\.0');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-govard'], '\\^0\\.1\\.0');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-memory'], '\\^1\\.');
    ws(pkg.dependencies['@ddtcorex/dsh-maestro-mobile'], '\\^1\\.');
    expect(pkg.dependencies['@ddtcorex/maestro-skills']).toBeDefined();
  });

  it('does not contain old harness monolith rows', () => {
    const yml = readFileSync('dsh-maestro-meta/cordis.patch.yml', 'utf8');
    expect(yml).not.toContain('maestro-gitlab-webhook');
    expect(yml).not.toContain('maestro-orchestrator');
  });
});
