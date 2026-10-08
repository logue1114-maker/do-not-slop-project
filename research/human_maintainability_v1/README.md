# Human-maintainable code: a worked refactoring

Make a change in the role that owns it, with a contract and checks that protect the rest. This package refactors a copy of the existing authored Fleet command demo. Its actual baseline is retained byte-for-byte; it was not made worse for this comparison. The original public example and prior reviews stay unchanged.

[Run before](before/index.html) · [Run after](after/index.html) · [Reusable AI instructions](AI_INSTRUCTIONS.md) · [Maintainer quickstart](MAINTAINER_QUICKSTART.md) · [Acceptance checklist](ACCEPTANCE_CHECKLIST.md)

An actual ownership change, from the retained [entry script](before/app.mjs) to the new [application](after/application.mjs) and [controller](after/controllers.mjs):

```js
// Before: app.mjs also loads the fixture, builds SVG/DOM, renders and owns state.
for (const button of document.querySelectorAll('[data-preset]'))
  button.addEventListener('click', () => dispatch({ type: 'PRESET', name: button.dataset.preset }));

// After: application.mjs keeps state/dispatch; controllers.mjs owns input binding.
const unbind = bindControls({ document, scenes, comparison: view.comparison, fixture, dispatch });
// Application disposal removes the bindings before removing their scene nodes.
```

The domain reducer and focus-recovery helper were already separate and remain exact. The refactoring extracts real boundaries from the intertwined entry script: view, vector assets, input, browser loading, and instance lifecycle. It adds no framework, service, persistence, or generic manager.

- [Dependency map, change map and contracts](MAINTAINER_QUICKSTART.md)
- [Isolated theme change: exact patch and reasons](change-example/README.md)
- [Executed checks, failures/repairs and unrun limits](VERIFICATION.md)
- [Primary sources and rights](SOURCES_AND_RIGHTS.md) · [Baseline hashes](provenance.json)

From the repository root, serve the examples with `python -m http.server 8765 --bind 127.0.0.1`, then open `/research/human_maintainability_v1/before/` or `/research/human_maintainability_v1/after/`. Use the quickstart commands for tests. GitHub displays source; it does not execute these HTML modules.

This is a behavior-preserving authored refactoring case, not an AI instruction-effect experiment or a measured improvement in human maintenance time. The tested theme change demonstrates a bounded edit and protected behavior. Easier navigation/review is a hypothesis for future human evaluation; more files alone are not evidence of reduced effort.
