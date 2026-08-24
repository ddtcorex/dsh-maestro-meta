# @ddtcorex/maestro-harness-meta

> **Meta-bundle for Maestro Harness** — one `dsh plugin add` to install the whole stack (Govard + DSH).

This package contains **no runtime code**. Its `cordis.patch.yml` re-exports four component bundles:

| # | Component | Package | What it brings |
|---|-----------|---------|----------------|
| 1 | **dsh-maestro-harness** | `@ddtcorex/dsh-maestro-harness` | GitLab MR review + `maestro-coder` preset + remote proxy & Cloudflare Tunnel |
| 2 | **dsh-maestro-memory** | `@ddtcorex/dsh-maestro-memory` | Durable memory 5 tracks + todos + confirmation queue |
| 3 | **dsh-maestro-mobile** | `@ddtcorex/dsh-maestro-mobile` | Mobile drawer/sheets for DSH Web (<1024px) |
| 4 | **maestro-skills** | `@ddtcorex/maestro-skills` | 26 Agent Skills (12 Magento/Govard + 14 superpowers) |

Govard itself is a Go binary (not a DSH plugin) and is installed separately — see `govard/README.md`. DeepSeek Harness (`deepseek-harness`) is the host.

## Install

```sh
# One-liner for the whole DSH side of Maestro Harness
dsh plugin --profile web add @ddtcorex/maestro-harness-meta

# Equivalent manual equivalent (what the meta does for you)
dsh plugin --profile web add @ddtcorex/dsh-maestro-harness
dsh plugin --profile web add @ddtcorex/dsh-maestro-memory
dsh plugin --profile web add @ddtcorex/dsh-maestro-mobile
dsh plugin --profile web add @ddtcorex/maestro-skills
```

For local development (link:):

```sh
dsh plugin --profile web add link:/home/kai/Work/htdocs/maestro-harness/maestro-harness-meta
# or link each component individually — same result
```

Verify:

```sh
dsh --profile web --dump-config | grep -E 'maestro-'
```

Any row can still be overridden by a higher profile layer (profile's `cordis.patch.yml` or `--patch`) by targeting its `id`.

## Why a meta-bundle?

- **Single install** for new machines / CI
- **One version to pin** in `~/.dsh/profiles/web/package.json`
- **No code duplication** — this package is patch-only, delegates to the four real bundles
- Keeps the umbrella workspace at `/home/kai/Work/htdocs/maestro-harness` as the source of truth (see `../../README.md` and `../../docs/architecture.md`)

## Versioning

Bump `version` here when you want to publish a new curated set. The four component versions are pinned as `^x.y.z` ranges — update them when the components publish breaking changes.

## See also

- Umbrella README: `../README.md`
- Umbrella AGENTS: `../AGENTS.md`
- Architecture: `../docs/architecture.md`
- Specs: `../docs/specs/`
