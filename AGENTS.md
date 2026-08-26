# AGENTS.md — dsh-maestro-meta

> `CLAUDE.md` at the repo root is a symlink to `AGENTS.md`. Claude Code follows the same rule set as Codex CLI. Only edit `AGENTS.md` — never edit `CLAUDE.md` directly or replace the symlink with a copy.

## Purpose

Patch-only **meta-bundle** for Maestro Harness. Re-exports the whole DSH side of the harness in one install:

- **6 rows total**, one per granular package: `maestro-remote` (`@ddtcorex/dsh-maestro-remote`), `maestro-review`, `maestro-govard`, `maestro-memory`, `maestro-mobile`, `maestro-notifier` (all `@ddtcorex/dsh-maestro-*`). `@ddtcorex/maestro-skills` is a dependency for its skill provider — it contributes no row.
- Contains **no runtime code** — only `cordis.patch.yml` + `package.json` + docs. Govard the Go binary stays separate (see `../govard`).
- Installing this bundle is equivalent to adding the six granular packages individually: `dsh plugin --profile web add @ddtcorex/dsh-maestro-meta`.

Umbrella workspace is `../` (see `../AGENTS.md`, `../README.md`, `../docs/architecture.md`).

## Workflow: Superpowers skills are mandatory

Every change to this repository MUST follow the Superpowers skill workflow, in order:

1. **brainstorming** — explore intent/requirements/design before coding. For cross-repo changes, record in `../docs/specs/YYYY-MM-DD-<topic>-design.md`; for meta-only, in local `docs/specs/` if needed.
2. **writing-plans** — turn the approved spec into a task plan in `../docs/plans/YYYY-MM-DD-<topic>.md` with precise test/implementation sketches.
3. **executing-plans** — implement each task with strict TDD (RED → GREEN), one task = one commit, no bundling, no commit while red.

Small single-row tweaks (e.g., config default) still require presenting a short design and getting approval before implementing — see `using-superpowers` skill.

## Repository Layout

```
dsh-maestro-meta/
├── AGENTS.md            # this file (CLAUDE.md is a symlink)
├── CLAUDE.md -> AGENTS.md
├── package.json         # dsh.bundle.patch + dependencies on 6 granular packages + skills
├── cordis.patch.yml     # 6 insert rows (remote/review/govard/memory/mobile/notifier)
├── README.md            # install & equivalence docs
└── .gitignore
```

No `src/`, no `lib/`, no build step. This is a **patch-only** bundle (like `@deepseek-ai/dsh-base`).

## Development

No build step. Validation is structural:

```sh
# Structural contract test (6 rows count, dependency ranges) from the umbrella root:
dsh-maestro-harness/node_modules/.bin/vitest run dsh-maestro-meta/tests/meta.test.ts

# Cross-check each meta row resolves to the package whose own patch inserts it:
#   remote/review/govard/notifier ship one whole-package row; memory/mobile likewise.
# NOTE: dsh-maestro-review's own patch has 3 internal rows (webhook/orchestrator/settings-rpc)
# while meta deliberately re-exports a single `maestro-review` alias row — do NOT diff 1:1.

# Dry-run install against the web profile (link: for local dev)
dsh plugin --profile web add link:$(pwd)
dsh --profile web --dump-config | grep -E 'maestro-'

# To remove
dsh plugin --profile web remove @ddtcorex/dsh-maestro-meta
```

When a component bumps, update its `^x.y.z` range in `package.json` dependencies and the corresponding row in `cordis.patch.yml` if its patch changed, then bump this package's `version`.

## Git Workflow

- Do not commit directly to `master`. Use `feat/<topic>` or `fix/<topic>`, rebase when base moves.
- Conventional Commits in imperative mood (`feat:`, `fix:`, `docs:`, `chore:`).
- One TDD task = one commit during `executing-plans`; squash per plan if required.
- Push branch and open PR/MR linked to its plan.

## DSH Rules

- This bundle re-exports rows by **whole-config replace** — profile layers above it can override any row by `id`. There is no deep merge.
- **Documentation links** — Published docs may use relative paths only for targets in this repository. Cross-repository references must use canonical GitHub URLs; never use `../` or `../../` to escape the repository.
- Do not duplicate rows in the profile's own `cordis.patch.yml` — duplicate `id` crashes the loader.
- Prefer editing a component repo over editing this meta's patch, unless you are intentionally curating a new set.
- Do not kill/restart the `dsh web` process serving a live session to test a patch change — build + verify first, then restart at a user-approved time and check `ss -tlnp` for ports 3000/3080.

## See Also

- Umbrella: `../README.md`, `../AGENTS.md`, `../docs/architecture.md`, `../docs/specs/`, `../maestro-harness.code-workspace`
- Components: `../packages/dsh-maestro-{remote,review,govard,memory,mobile,notifier,guard,observe}/`, `../maestro-skills/`, `../govard/`
  (memory + mobile moved under `packages/` on 2026-08-26; the old workspace-root symlinks are gone and the web profile links `packages/dsh-maestro-{memory,mobile}` directly)
- DSH bundle docs: `../deepseek-harness/packages/bundle/base/README.md`, `../deepseek-harness/docs/architecture.md` (Profiles and bundles)
