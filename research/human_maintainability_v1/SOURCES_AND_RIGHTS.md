# Primary sources, provenance and rights

Checked 2026-10-08. These are primary author/documentation sources; the guide is an original bounded synthesis, not copied article text or an official standard for every project.

| Source | Grounded guidance / limit |
|---|---|
| [Google Engineering Practices: what to look for in code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html) | Review design, functionality, complexity, tests, names, comments and docs. Avoid speculative overengineering; comments usually explain reasons, while public documentation explains use and behavior. These criteria support review questions, not a mandatory layer count |
| [Martin Fowler: Definition of Refactoring](https://martinfowler.com/bliki/DefinitionOfRefactoring.html) | Structural changes preserve observable behavior. Our parity checks are bounded evidence for this case, not exhaustive proof or human maintenance measurement |
| [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) | Explicit import/export contracts and browser module loading. Serving over HTTP matters; splitting a module is not itself evidence of maintainability |
| [MDN: removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) | Removal matches listener type/function and capture setting. The controller retains exact callback identities; the application owns unbinding before node removal |
| [Node.js: test runner](https://nodejs.org/api/test.html) | Built-in test execution used without new test-framework dependencies |
| [Git: gitattributes](https://git-scm.com/docs/gitattributes) | Unsetting `text` prevents end-of-line conversion. The policy is scoped to this package's byte-exact specimens and source receipts; it does not change user/global settings |

The baseline is the existing project-authored synthetic [Fleet command demo](../strategy_controls_oct4/demo/index.html), from public commit `43a966e44f61d9c42aa4c17603a4982efa200ca5`. [provenance.json](provenance.json) lists exact source/copy paths, bytes and SHA-256 values for the seven retained baseline files. `after/state.mjs`, `after/focus.mjs` and `after/fixture.json` also stay exact. The new modules, tests, patch and technical instructions are authored for this package. No deliberately weakened baseline, third-party code, product screenshot, font binary, private user data or new external service is included. Existing links inside the retained demo remain its historical design-source links.

No reuse license has been selected for this repository. Public publication is authorized by the owner but is not an MIT/Creative Commons grant or a legal ownership certification. This addition makes no license choice. External pages retain their respective rights; they are linked with original bounded paraphrases, and their code/media is not redistributed. Local verification screenshots are captures of the original synthetic UI, kept outside the public package; the public report retains their hashes and equality outcomes.
