# @ddtcorex/dsh-maestro-meta

> **Meta-bundle for Maestro Harness** — one `dsh plugin add` to install the whole DSH side of the stack.

This package contains **no runtime code**. Its `cordis.patch.yml` is a thin v2 aggregator that re-exports the rows of the granular plugins:

| # | Row id | Package | What it brings |
|---|--------|---------|----------------|
| 1 | **maestro-remote** | `@ddtcorex/dsh-maestro-remote` | Cloudflare tunnel + remote proxy + PIN + startup notification trigger |
| 2 | **maestro-review** | `@ddtcorex/dsh-maestro-review` | Pluggable MR review pipeline (GitLab implemented, GitHub stubbed) |
| 3 | **maestro-govard** | `@ddtcorex/dsh-maestro-govard` | Govard bridge tooling for PHP/Magento/Laravel projects |
| 4 | **maestro-memory** | `@ddtcorex/dsh-maestro-memory` | Durable memory 5 tracks + todos + confirmation queue |
| 5 | **maestro-mobile** | `@ddtcorex/dsh-maestro-mobile` | Mobile drawer/sheets for DSH Web (<1024px) |
| 6 | **maestro-notifier** | `@ddtcorex/dsh-maestro-notifier` | Provider-neutral notification service (`maestroNotifier`, Telegram first) |
| 7 | **maestro-config** | `@ddtcorex/dsh-maestro-config` | Shared settings store (`~/.dsh/maestro/settings.json`) + Settings card |
| 8 | **dsh-maestro-dashboard** | `@ddtcorex/dsh-maestro-dashboard` | Dev dashboard surface for the Maestro harness |

`@ddtcorex/maestro-skills` is also a dependency — it serves skills through its own provider and needs no row here.

Govard itself is a Go binary (not a DSH plugin) and is installed separately — see `govard/README.md`. DeepSeek Harness (`deepseek-harness`) is the host.

## Install

```sh
# One-liner for the whole DSH side of Maestro Harness
dsh plugin --profile web add @ddtcorex/dsh-maestro-meta

# Equivalent manual install (what the meta does for you)
dsh plugin --profile web add @ddtcorex/dsh-maestro-remote
dsh plugin --profile web add @ddtcorex/dsh-maestro-review
dsh plugin --profile web add @ddtcorex/dsh-maestro-govard
dsh plugin --profile web add @ddtcorex/dsh-maestro-memory
dsh plugin --profile web add @ddtcorex/dsh-maestro-mobile
dsh plugin --profile web add @ddtcorex/dsh-maestro-notifier
dsh plugin --profile web add @ddtcorex/dsh-maestro-config
dsh plugin --profile web add @ddtcorex/dsh-maestro-dashboard
```

`@ddtcorex/dsh-maestro-guard` is intentionally **opt-in** (approval gate; not part of this bundle until published).


For local development (`link:`):

```sh
dsh plugin --profile web add link:/path/to/maestro-harness/dsh-maestro-meta
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
- **No code duplication** — this package is patch-only, delegates to the granular bundles under `packages/`
- Keeps the local umbrella workspace at `/path/to/maestro-harness` as the source of truth.

## Versioning

Bump `version` here when you want to publish a new curated set (new row added or removed ⇒ minor bump). The component versions are pinned as `workspace:^x.y.z` ranges locally and `^x.y.z` when published — update them when components publish changes.

## See also

The umbrella workspace is local-only, not a published Git repository. From an
umbrella checkout, consult its `README.md`, `AGENTS.md`, `docs/architecture.md`,
and `docs/specs/`.

## Installing with plain pnpm

`pnpm add @ddtcorex/dsh-maestro-meta` needs overrides for the DSH internal
packages that are only published as prereleases under the `next` dist-tag
(their published ranges are clean `^0.1.x`, which prereleases cannot satisfy).
Add this `pnpm-workspace.yaml` next to your `package.json`:

```yaml
packages:
  - .
overrides:
  '@deepseek-ai/dsh-invariants': 0.1.1-rc.2
  '@deepseek-ai/dsh-typert-registry': 0.1.1-rc.2
  '@deepseek-ai/dsh-typert-protocol': 0.1.1-rc.2
  '@deepseek-ai/dsh-scope': 0.1.1-rc.2
  '@deepseek-ai/dsh-brand': 0.1.1-rc.2
  '@deepseek-ai/dsh-attachment': 0.1.0-rc.8
  '@deepseek-ai/dsh-timeout': 0.1.0-rc.8
```

Installing through the DSH CLI (`dsh plugin add @ddtcorex/dsh-maestro-meta`)
does not need this — the CLI resolves the pinned set itself. Individual
granular packages (`@ddtcorex/dsh-maestro-*`) install with plain pnpm without
overrides; only the full meta bundle hits the shared peer graph.
