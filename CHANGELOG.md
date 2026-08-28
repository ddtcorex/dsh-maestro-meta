# Changelog

All notable changes to this project are documented in this file. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **dsh-maestro-dashboard** row (`dsh-maestro-dashboard`) — aggregated dashboard plugin (PR #15, pending release). Bundle now contains 8 rows (7 granular + dashboard) plus `maestro-skills`.

### Changed

- CI `sibling-repos` includes `dsh-maestro-dashboard` for rehearsal ordering.

## [0.2.0] - 2026-08-26

Published as `@ddtcorex/dsh-maestro-meta@0.2.0` (`npm view` 2026-08-26).

Granular v2 — patch-only bundle re-exporting the seven granular plugins plus `maestro-skills`. No runtime code; `dsh plugin add @ddtcorex/dsh-maestro-meta` is equivalent to adding each granular row individually.

### Added

- **Seven maestro rows** in `cordis.patch.yml`: `maestro-remote`, `maestro-review`, `maestro-govard`, `maestro-memory`, `maestro-mobile`, `maestro-notifier`, `maestro-config` (added in `feat/maestro-config-row` #3) and `maestro-skills` dependency (`^2.2.0`).
- **Standalone workspace manifest** (`pnpm-workspace.yaml` + `pnpm-lock.yaml` honest lockfile) — root stays coordination-only.
- **CI** `.github/workflows/ci.yml` calling `ddtcorex/dsh-maestro-ci` reusable `node-plugin.yml` (pinned SHA) with sibling ordering including `dsh-maestro-config-lib` first; `release.yml` via `node-release.yml`.
- **Community files** per public checklist (#13): `AGENTS.md` (+ `CLAUDE.md -> AGENTS.md`), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `.github/CODEOWNERS`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/bug.yml` & `feature.yml`, `private: false`.
- **Docs** for plain-pnpm installs (`pnpm-workspace.yaml` overrides for prerelease `next` dist-tag DSH peers) and canonical `/path/to` workspace-root paths.

### Changed

- Renamed from `@ddtcorex/maestro-harness-meta` to `@ddtcorex/dsh-maestro-meta` for discoverability.
- Bumped `dsh-maestro-memory` range to `^1.0.1`, `dsh-maestro-mobile` to `^1.0.0`.
- Removed hardcoded absolute host paths; enforce generic `<workspace-root>/...` placeholders.

### Fixed

- Keep workspace-root path generic (`fix/meta: keep workspace-root path generic`).
- Point structural test at the package's own runner (`docs/drop-monolith-test-path`).
- Restore `packageManager: pnpm@11.7.0` after community files rework.

## [0.1.0] - 2026-08-24

Initial meta-bundle — one plugin for whole Maestro Harness (9 rows, pre-granularization).

### Added

- Initial `cordis.patch.yml` aggregating the monolith `dsh-maestro-harness` plus memory/mobile/skills.
- Package `private: false`, MIT license, `dsh.bundle.patch` entry.

[Unreleased]: https://github.com/ddtcorex/dsh-maestro-meta/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/ddtcorex/dsh-maestro-meta/releases/tag/v0.2.0
[0.1.0]: https://github.com/ddtcorex/dsh-maestro-meta/releases/tag/v0.1.0
