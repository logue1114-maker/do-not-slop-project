# General button construction and correction

**Status: runnable source candidate; browser rendering and visual acceptance are blocked, not passed.** This package covers game, web and app controls. Golf is one isolated audit case, not the system's scope.

Start with [the short AI instruction](AI_INSTRUCTIONS.md), then the relevant role and construction in [GUIDE.md](GUIDE.md). [Role contracts](role-contracts.json) distinguish action rank, hazard, selection, navigation and game HUD. A flat text-only control is valid when its task calls for one. There is no universal bevel, icon, shadow, radius or control height.

## Runnable specimens

From the repository root with existing Python 3:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory research/universal_button_system
```

Open `http://127.0.0.1:8765/specimens/index.html`. A [self-contained HTML source candidate](delivery/Button-lab-source-candidate.html) also bundles the three contexts for offline file review; its hashed inline policy still blocks service connections. This bundle has not been browser-rendered here. No dependencies or service connection are needed. The CSP forbids network actions. The page offers the same fixed content and local state under an authored ordinary-quality starting family and a context-specific construction:

- White web: filled execution, outlined alternative, deliberately flat utilities, persistent tab panels, stable-label toggle and a bounded local waiting operation
- Compact app: soft-raised footer action, quiet saved toggle, native exclusive segments, linked navigation rows and a normal disclosure with local action/link rows
- Game station: a stationary execution shell and inner press face, low-relief HUD controls, native route choices, a real local resource limit and a CSS-authored scene
- [Observed golf anatomy fixture](specimens/golf.html): the actual audited control geometry/cascade as a reduced system-font reproduction, plus a smaller-corner sign-family proposal. No production handlers, room actions or course assets

Use `?context=web|app|game&revision=before|after` for fixed starting views. Labels, content, task, scene and handlers stay shared. These are authored specimens, not a matched ordinary/guided AI experiment or evidence of measured improvement.

[Maintainer quickstart](MAINTAINER_QUICKSTART.md) maps actions, selection, state, family styling and context layout to the right files. [Sources and rights](SOURCES_AND_RIGHTS.md) link six distinct historical/reference families without redistributing their screenshots or fonts. No reuse license has been selected.

## The acceptance gate

When a task names structural changes, submit before → intent → actually rendered rows for those axes, with matched full-context and native component/state crops. A palette/background/font-only revision does not pass a face/body/layout/geometry brief. Deliberately unchanged flat/no-icon/no-body decisions must be recorded too.

[The current ledger](records/change-ledger.json) records authored source changes and leaves actual rendering blocked. It does not use authored CSS values as measured runtime values. [Capture requirements](captures/README.md) define the matching evidence still needed. This package must not be presented as visually verified until that gate is satisfied.

## Checks that can run without a browser

```sh
node --test research/universal_button_system/tests/semantics.test.mjs
node research/universal_button_system/tests/verify.mjs
```

The final run passed 22 source/Node check groups and 19 pure state/tab-helper tests. The tests use Node built-ins only. Pure state/DOM-shaped checks are separate from browser/input/geometry checks. Read [BROWSER_REPORT.md](BROWSER_REPORT.md) for exact executed coverage and blockers, [source results](records/source-test-results.json), [changes and retained first pass](CHANGELOG.md), and [publication provenance](provenance.json).

Normal browser inspection, native keyboard/pointer behavior, actual hover/focus/held press, responsive geometry, longest-label/text scaling, reduced motion, physical touch/controller, screen-reader speech, contrast audit and user aesthetic approval remain unestablished. No production game deployment is included.

## Scoped publication inventory

The repository-wide `FILES.sha256.json` is preserved unchanged at the prior published inventory. This addition is covered by [its scoped provenance](provenance.json), including exact new package hashes and named entrypoint changes; it does not republish an unrelated repository/workspace inventory.
