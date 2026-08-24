# AGENTS.md — maestro-harness-meta

> `CLAUDE.md` at the repo root is a symlink to `AGENTS.md`. Claude Code follows the same rule set as Codex CLI. Only edit `AGENTS.md` — never edit `CLAUDE.md` directly or replace the symlink with a copy.

## Purpose

Patch-only **meta-bundle** for Maestro Harness. Re-exports the whole DSH side of the harness in one install:

- **9 rows total**: 6 from `@ddtcorex/dsh-maestro-harness` (`maestro-gitlab-webhook`, `maestro-orchestrator`, `maestro-tunnel`, `maestro-telegram`, `maestro-settings-rpc`, `maestro-client`) + 1 each from `@ddtcorex/dsh-maestro-memory`, `@ddtcorex/dsh-maestro-mobile`, `@ddtcorex/maestro-skills`.
- Contains **no runtime code** — only `cordis.patch.yml` + `package.json` + docs. Govard is a Go binary and stays separate (see `../govard`).
- Installing this bundle is equivalent to adding the four component bundles individually: `dsh plugin --profile web add @ddtcorex/maestro-harness-meta`.

Umbrella workspace is `../` (see `../AGENTS.md`, `../README.md`, `../docs/architecture.md`).

## Workflow: Superpowers skills are mandatory

Every change to this repository MUST follow the Superpowers skill workflow, in order:

1. **brainstorming** — explore intent/requirements/design before coding. For cross-repo changes, record in `../docs/specs/YYYY-MM-DD-<topic>-design.md`; for meta-only, in local `docs/specs/` if needed.
2. **writing-plans** — turn the approved spec into a task plan in `../docs/plans/YYYY-MM-DD-<topic>.md` with precise test/implementation sketches.
3. **executing-plans** — implement each task with strict TDD (RED → GREEN), one task = one commit, no bundling, no commit while red.

Small single-row tweaks (e.g., config default) still require presenting a short design and getting approval before implementing — see `using-superpowers` skill.

## Repository Layout

```
maestro-harness-meta/
├── AGENTS.md            # this file (CLAUDE.md is a symlink)
├── CLAUDE.md -> AGENTS.md
├── package.json         # dsh.bundle.patch + dependencies on 4 components
├── cordis.patch.yml     # 9 insert rows (6 harness + 1 memory + 1 mobile + 1 skills)
├── README.md            # install & equivalence docs
└── .gitignore
```

No `src/`, no `lib/`, no build step. This is a **patch-only** bundle (like `@deepseek-ai/dsh-base`).

## Development

No build or test is required for this repo itself (no TypeScript, no Go). Validation is structural:

```sh
# Validate patch is parseable by DSH loader (supports !!js)
node -e "import('js-yaml').then(m=>m.load(require('fs').readFileSync('cordis.patch.yml','utf8')))"  # expect !!js tag error in plain js-yaml — use DSH loader instead

# Validate the 9 rows match the components' own patches
diff -u <(grep -E '^\s*- id:' cordis.patch.yml) <(cat ../dsh-maestro-harness/cordis.patch.yml ../dsh-maestro-memory/cordis.patch.yml ../dsh-maestro-mobile/cordis.patch.yml ../maestro-skills/cordis.patch.yml | grep -E '^\s*- id:')

# Dry-run install against the web profile (link: for local dev)
dsh plugin --profile web add link:$(pwd)
dsh --profile web --dump-config | grep -E 'maestro-'

# To remove
dsh plugin --profile web remove @ddtcorex/maestro-harness-meta
```

When a component bumps (e.g., `dsh-maestro-harness@0.3.0`), update the `^x.y.z` range in `package.json` dependencies and the corresponding row in `cordis.patch.yml` if its patch changed, then bump this package's `version`.

## Git Workflow

- Do not commit directly to `master`. Use `feat/<topic>` or `fix/<topic>`, rebase when base moves.
- Conventional Commits in imperative mood (`feat:`, `fix:`, `docs:`, `chore:`).
- One TDD task = one commit during `executing-plans`; squash per plan if required.
- Push branch and open PR/MR linked to its plan.

## DSH Rules

- This bundle re-exports rows by **whole-config replace** — profile layers above it can override any row by `id`. There is no deep merge.
- Do not duplicate rows in the profile's own `cordis.patch.yml` — duplicate `id` crashes the loader.
- Prefer editing a component repo over editing this meta's patch, unless you are intentionally curating a new set.
- Do not kill/restart the `dsh web` process serving a live session to test a patch change — build + verify first, then restart at a user-approved time and check `ss -tlnp` for ports 3000/3080.

## See Also

- Umbrella: `../README.md`, `../AGENTS.md`, `../docs/architecture.md`, `../docs/specs/`, `../maestro-harness.code-workspace`
- Components: `../dsh-maestro-harness/`, `../dsh-maestro-memory/`, `../dsh-maestro-mobile/`, `../maestro-skills/`, `../govard/`
- DSH bundle docs: `../deepseek-harness/packages/bundle/base/README.md`, `../deepseek-harness/docs/architecture.md` (Profiles and bundles)
