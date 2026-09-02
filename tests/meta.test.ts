import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve against this file so the suite runs regardless of process cwd.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Caret `^x.y.z` satisfier (0.x keeps the minor; else keeps major, minor >= base). */
function caretSatisfies(version: string, range: string): boolean {
  const caret = range.replace(/^workspace:\^/, '^')
  if (!caret.startsWith('^')) return false
  const [vMaj, vMin] = version.split('.').map(Number)
  const [rMaj, rMin] = caret.slice(1).split('.').map(Number)
  if (rMaj === 0) return vMaj === 0 && vMin === rMin
  return vMaj === rMaj && vMin >= rMin
}

/** Published dependency name -> sibling checkout relative to this repo. */
const SIBLING_DIRS: Record<string, string> = {
  '@ddtcorex/dsh-maestro-dashboard': '../packages/dsh-maestro-dashboard',
  '@ddtcorex/dsh-maestro-remote': '../packages/dsh-maestro-remote',
  '@ddtcorex/dsh-maestro-review': '../packages/dsh-maestro-review',
  '@ddtcorex/dsh-maestro-govard': '../packages/dsh-maestro-govard',
  '@ddtcorex/dsh-maestro-memory': '../packages/dsh-maestro-memory',
  '@ddtcorex/dsh-maestro-mobile': '../packages/dsh-maestro-mobile',
  '@ddtcorex/dsh-maestro-notifier': '../packages/dsh-maestro-notifier',
  '@ddtcorex/dsh-maestro-config': '../packages/dsh-maestro-config',
  '@ddtcorex/maestro-skills': '../maestro-skills',
}

describe('dsh-maestro-meta v2', () => {
  it('cordis.patch.yml contains seven maestro rows plus dashboard and no retired dev toolkit', () => {
    const yml = readFileSync(join(repoRoot, 'cordis.patch.yml'), 'utf8');
    for (const id of [
      'maestro-remote',
      'maestro-review',
      'maestro-govard',
      'maestro-memory',
      'maestro-mobile',
      'maestro-notifier',
      'maestro-config',
      'dsh-maestro-dashboard',
    ]) {
      expect(yml).toContain(`- id: ${id}`);
    }
    expect(yml).not.toContain('maestro-devkit');
    expect((yml.match(/^\s+- id:/gm) || [])).toHaveLength(8);
    expect((yml.match(/- id: maestro-/g) || [])).toHaveLength(7);
  });

  it('package.json ranges agree with the sibling checkouts (no hardcoded version literals)', () => {
    const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
    expect(pkg.dependencies['@ddtcorex/dsh-maestro-devkit']).toBeUndefined();
    for (const [name, rel] of Object.entries(SIBLING_DIRS)) {
      const range = pkg.dependencies[name];
      expect(range, `${name} declared in meta dependencies`).toBeTruthy();
      const siblingPkg = join(repoRoot, rel, 'package.json');
      expect(existsSync(siblingPkg), `${name} sibling checkout at ${rel}`).toBe(true);
      const version = JSON.parse(readFileSync(siblingPkg, 'utf8')).version;
      // Compare the range to the sibling's own version — a bump outside the
      // caret range must fail here in the same PR, never silently at CI time
      // (house rule: version-literal assertions drift — maestro-skills PR #39).
      expect(caretSatisfies(version, range), `${name}: ${version} outside meta range ${range}`).toBe(true);
    }
  });

  it('does not contain old harness monolith rows', () => {
    const yml = readFileSync(join(repoRoot, 'cordis.patch.yml'), 'utf8');
    expect(yml).not.toContain('maestro-gitlab-webhook');
    expect(yml).not.toContain('maestro-orchestrator');
  });
});