# Maintainer quickstart for the button specimens

Use this package to inspect and change control construction while preserving a bounded local task. Start with the relevant role in [role-contracts.json](role-contracts.json), the decision in [GUIDE.md](GUIDE.md) and the exact change contract in [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md).

The specimens are original authored fixtures. Their baseline and contextual treatment use the same local content/state/handlers. This is a control-construction demonstration, not a controlled model-output experiment. The isolated golf example is an authored proposal grounded in an entry-control observation, with no production-handler or course-rendering parity claim.

## Open the local specimens

From the checkout root, use an existing local static server that serves `.mjs` as JavaScript. For example, if Python 3 is already available:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory research/universal_button_system
```

Open `http://127.0.0.1:8765/specimens/index.html`. Context links are:

- `specimens/index.html?context=web&revision=after`
- `specimens/index.html?context=app&revision=after`
- `specimens/index.html?context=game&revision=after`
- Use `revision=before` for each matching authored starting family
- `specimens/golf.html` is the separate observed-anatomy proposal

Serve over local HTTP rather than assuming `file://` module loading will work. Do not install dependencies or connect a backend merely to open these static fixtures. Browser access to a local server does not require network access to an outside service. The fixture's network-action restrictions must remain in place.

## Find the right edit boundary

| Need | Primary location | Keep separate |
| --- | --- | --- |
| Core ink, focus, spacing/type defaults and shared control shell | `specimens/tokens.css` | Context-specific material and rank overrides |
| Before/after role surfaces and state appearance | `specimens/families.css` | Actual action/state transitions |
| Context layout and scenery | `specimens/contexts.css` | Button anatomy changes claimed in the ledger |
| Shared action markup and original glyphs | `specimens/components/actions.mjs` | State transitions and context layout |
| Shared tab markup and panel-link attributes | `specimens/components/selection.mjs` | Actual selection model and keyboard activation policy |
| State model and reusable selection keyboard behavior | `specimens/semantics.mjs` | CSS-only interaction illusions |
| Context composition, labels, action binding and local result rendering | `specimens/render.mjs`, importing the shared component modules | Production integration or external services |
| Local golf construction | `specimens/golf.html` and `specimens/golf.css` | Shared web/app/game family rules |
| Role/state/ledger review contract | `role-contracts.json` and this guide set | Claims that the browser actually passed a check |
| Required-change rows and actual evidence status | `records/change-ledger.json` | Recipe values and implementation intentions |
| Actual validation results, blockers and available captures | `BROWSER_REPORT.md` and linked evidence records | An unexecuted check presented as a pass |

These boundaries describe the package, not a mandate to split every product into the same files. Preserve a simpler existing implementation when it already owns the right behavior. Find the actual imports/selectors before editing; filenames alone do not prove dependency scope.

## Change one family without changing the task

1. Choose the context/role and the exact required axes, such as `game primary / separate face / press bounds`
2. Save the original fixture state, revision and matching capture configuration
3. Edit the relevant family rule, scoped by context and treatment; do not turn every `button` into a game object
4. Keep label and action semantics, costs, conditions, selection values and state transitions unchanged unless expressly included in the brief
5. Verify computed runtime properties and actual state feedback after the final cascade
6. Fill the before → intent → rendered ledger, linking the exact state/crop/revision
7. Recheck affected roles, supported input paths and dependent states, then update the browser report accurately

If a token changes, inspect every family that inherits it. If an inner-face selector changes, inspect only the implementations that actually use it plus any unintended selector matches. If a shared event handler changes, test all action/selection roles that import it. A smaller focused check is useful, but label its scope.

## Preserve state and keyboard semantics

- Keep primary/secondary/tertiary visual rank separate from destructive consequence
- Keep persistent toggle/selection marks separate from pointer hover and keyboard focus
- A toggle using `aria-pressed` retains its identity label; represent on/off with state and a separate marker
- Segmented choices use their radio/exclusivity contract; they are not independent pressed commands
- Tabs retain correctly linked tab/panel semantics and the documented activation policy
- Ordinary navigation rows remain links; disclosure rows do not acquire menu roles unless a full menu contract is implemented
- Native button activation already covers Enter/Space. Do not independently commit again in a keyboard handler
- Adding face/label/SVG children requires a check of target lookup and label replacement; keep decorative glyphs out of naming
- A pending local operation guards repeat commitment, settles truthfully and cannot write a stale result into a reset/replaced context
- Disabled controls retain a readable label and a real reason reachable without hover; focusable unavailable variants need their own input guard
- Tactile press changes the inner face while the target, focus shell and sibling geometry stay fixed

## Focused manual regression

Run the pure local model/keyboard-helper tests from the checkout root with an existing Node runtime:

```sh
node --test research/universal_button_system/tests/semantics.test.mjs
node research/universal_button_system/tests/verify.mjs
```

The model tests use keyboard test doubles and do not validate browser elements, native activation, CSS rendering or the accessibility tree. The verifier is a structural/package check; it cannot establish the rendered result. Use the package's additional recorded commands in [README.md](README.md). The static serving example above only opens the fixture; it does not validate it.

The package's current browser route is blocked by the documented cloud localhost `ERR_BLOCKED_BY_CLIENT` and command Chromium socket restriction. Final component/state captures and runtime rendering are therefore unverified, with actual result fields marked blocked in the browser report/change ledger. Do not fill those fields from authored CSS. Resume the following checks in an authorized working browser before claiming a rendered pass:

1. Open each affected context/treatment and compare protected content before interacting
2. Trigger actual rest, pointer hover, keyboard focus and held press; measure target bounds during press
3. Release inside, release away and cancel input. Verify one intended activation and no accidental commit
4. Tab through controls, use Enter/Space on action buttons and verify selected/focus distinction in options/tabs
5. Activate local pending operation twice, wait for settle, then reset during another wait; verify truthful count/result and no stale completion
6. Change contexts/revisions while state is active; verify the documented state preservation/reset policy
7. Exercise the unavailable case, local removal/resource limit, Back/Close/Escape and Reset where supported
8. Inspect narrow view, longest labels, text enlargement, reduced motion and relevant contrast/high-contrast cases
9. Check console errors, missing module/style assets and page/control overflow

Record actual viewport, DPR, zoom, text setting, input route and state milestone. A forced CSS class or synthetic event can support targeted diagnostics but does not replace actual pointer/keyboard evidence. Browser rendering at a phone width is not physical phone/touch testing. A local simulation is not production validation.

## Ledger review before accepting a change

For every required axis, require observed before, intended change and actual rendered result. Include source declaration and runtime value as separate evidence when the CSS cascade matters. Record deliberate unchanged/no-body/no-icon decisions too. Values must identify whether they are authored trials, source-art units or measured runtime units.

Reject a structural brief's incomplete rows when only color/background/font changed. Conversely, accept a deliberate flat control when the brief and role justify it and its actual geometry, hierarchy, semantics and states pass. Do not reward decorative layer count.

Use `passed`, `failed`, `blocked`, `not_run` and `not_applicable` with reasons. Preserve previous evidence instead of overwriting an unsuccessful result with a prettier screenshot. No source check, authored comparison or visual crop establishes user approval, measured usability improvement, controlled-model superiority or production parity.

## Before reusing in a product

Inspect that product's real handler, input model, labels, fonts, availability/pending rules, layout and art. Import a decision or bounded component contract, not the entire specimen page. Revalidate against actual scene/background and supported devices. The golf sign proposal does not grant permission to alter room creation, join production rooms or deploy a live game revision. Publication, installation and external actions need their own authorization and rights review.
