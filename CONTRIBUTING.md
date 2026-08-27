# Contributing to dsh-maestro-meta

Thank you for contributing to **dsh-maestro-meta** (`@ddtcorex/dsh-maestro-meta`) — a patch-only meta-bundle that re-exports the whole DSH side of Maestro Harness in one install. It aggregates seven granular plugins (`remote`, `review`, `govard`, `memory`, `mobile`, `notifier`, `config`) via `cordis.patch.yml` plus `@ddtcorex/maestro-skills`; it contains no runtime code of its own (`src/`, `lib/` deliberately absent).

Part of the Maestro Harness suite (`dsh-maestro-*`). Install with `dsh plugin --profile web add @ddtcorex/dsh-maestro-meta` — equivalent to adding the seven components individually. Govard (Go binary) stays separate.

## Getting Started

1. **Fork and clone** `github.com/ddtcorex/dsh-maestro-meta`.
2. Install dependencies (requires Node.js 20+, pnpm 10+):

   ```bash
   pnpm install
   ```

3. No build step — this is a patch-only bundle (like `@deepseek-ai/dsh-base`). `cordis.patch.yml` + `package.json` are the only sources of truth. Verify the contract:

   ```bash
   pnpm test        # vitest run — structural contract (patch row count, dependency ranges)
   pnpm verify      # if verify script exists (typecheck); otherwise `pnpm test` is the gate
   ```

4. Open the project in your editor. Key layout:

   ```
   cordis.patch.yml      # 7 rows (remote/review/govard/memory/mobile/notifier/config)
   package.json          # dsh.bundle.patch + workspace:^ deps on granular packages + skills
   pnpm-workspace.yaml   # packages: . + overrides for DSH prereleases
   tests/meta.test.ts    # structural contract test
   AGENTS.md             # workspace conventions for this bundle
   ```

   When a component bumps, update its `^x.y.z` range in `package.json` and the corresponding row in `cordis.patch.yml` if its patch changed, then bump this package's `version`.

## Superpowers 3-Phase Workflow (AGENTS.md)

Every change to this repository **MUST** follow the Superpowers skill workflow defined in `AGENTS.md`, in order:

1. **brainstorming** — explore intent, requirements, and design before writing code. Record the outcome in the PR description.
2. **writing-plans** — turn the approved design into a task-by-task plan with exact test and implementation sketches. Plans are transient working files — delete them once the batch ships.
3. **executing-plans** — implement task by task with strict **TDD**: write a failing test first, verify RED, implement, verify GREEN, then commit that task before starting the next. Do not commit while tests are red.

Do not skip ahead to implementation and do not bundle multiple TDD tasks into one commit during `executing-plans`. Describe durable outcomes in the PR body instead of committing dated spec/plan files.

## Branch Naming

Never commit directly to `master`. Start a feature branch per work session:

- `fix/<topic>` — bug fixes (stale dep range, row mismatch)
- `feat/<topic>` — new features (new aggregated row, new dep)
- `docs/<topic>` — documentation-only changes

Rebase (not merge) when the base moves: `git fetch origin && git rebase origin/master`.

## Conventional Commits

All commit subjects **must** follow [Conventional Commits](https://www.conventionalcommits.org/) in imperative mood:

```
<type>(<scope>): <subject>

<body — why, not what>

Refs: #<issue>
```

- **Types (closed list):** `feat` `fix` `docs` `chore` `refactor` `perf` `test` `build` `ci` `revert`
- **Scope:** optional, without the `dsh-maestro-` prefix — e.g. `feat(meta):`, `fix(deps):`, `docs(readme):`
- **Subject:** imperative, lowercase first word, ≤ 72 chars, no trailing period
- **Body:** explain *why* and trade-offs when non-trivial
- **Breaking changes:** `feat!: <subject>` plus a `BREAKING CHANGE:` footer

One TDD task = one commit while executing a plan; squash at merge time if the history reads better squashed.

## Validation

Run these before opening a PR (match depth to risk):

```bash
pnpm test        # vitest run (structural contract)
pnpm verify      # typecheck if present (tcs --noEmit)
pnpm build       # no-op for this bundle; verifies package scripts don't drift
```

Additional checks when relevant:

```bash
# Patch contract — 7 rows must resolve to published granular packages
dsh plugin --profile web add link:$(pwd)
dsh --profile web --dump-config | grep -E 'maestro-'
dsh plugin --profile web remove @ddtcorex/dsh-maestro-meta

# Publish dry-run — ensure no workspace:/link: left in manifest
pnpm publish --dry-run --access public 2>&1 | grep -q "workspace:" && echo "FAIL" || echo "OK"
```

Meta bumps are drift-sensitive: when any granular `packages/dsh-maestro-*` version bumps, bump the matching `^x.y.z` range here in the same PR (missed `maestro-skills ^2.1.0 -> ^2.2.0` broke the aggregator on 2026-08-26).

Do not claim verified/done/clean without having actually run the checks — be ready to paste exact command output in the PR.

## Pull Requests

1. Push your branch and open a PR into `master`.
2. Fill out `.github/PULL_REQUEST_TEMPLATE.md` (Summary, Why, Changes, Validation, Linked Issues).
3. Link the PR to the plan that produced it when the Superpowers workflow was used.
4. Ensure CI (`pnpm test` / `pnpm verify` via `dsh-maestro-ci` `node-plugin.yml`) is green.

## Package Visibility

This package is public (`"private": false` — field omitted would also default to public, but we set it explicitly). Never set `"private": true` in `package.json`. Publishing uses `pnpm publish --access public` only — never `npm publish` (would leave `workspace:` in the tarball).

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to its terms.

## Questions or Security Reports

- General questions: open a GitHub Discussion or issue.
- Contact maintainer: [kaido4492@gmail.com](mailto:kaido4492@gmail.com)
- Security vulnerabilities: use GitHub's private advisory reporting at `https://github.com/ddtcorex/dsh-maestro-meta/security/advisories` — do not file a public issue.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
