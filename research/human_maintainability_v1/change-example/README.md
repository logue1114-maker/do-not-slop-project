# A concrete isolated change: selection accent

Request: change the Fleet selection/pressed-control accent from amber `#f1cd75` to pale blue `#d6e9ff`, retaining the exact command rules, data, geometry and input behavior.

[theme.patch](theme.patch) changes one declaration in `after/tokens.css`. That file owns the named visual role. `style.css` already consumes `--amber`; neither the view/controller nor the rule/state module needs to know the color value. This is a demonstration request, not a redesign applied to the preserved baseline or shipped after copy.

The browser harness copies `after/` to a temporary directory, runs `git apply --check` and `git apply` there, and serves that isolated copy. It compares the resulting files to the unpatched source and requires that only `tokens.css` differs. It checks the pressed frame button's actual border changes from `rgb(241, 205, 117)` to `rgb(214, 233, 255)`, while full DOM, geometry, fixture and public state remain equal. Move/relay/Confirm and Attack/hostile/Confirm then create the same two records in both copies. The temporary tree is removed; the main after copy stays unchanged.

For manual inspection, copy this package to an isolated directory and run `git apply --check change-example/theme.patch`, then `git apply change-example/theme.patch` from that copy's root. Serve it as described in the quickstart. Reverse with `git apply -R change-example/theme.patch` or discard the isolated copy.

Exactly what changes:

| File | Reason |
|---|---|
| `after/tokens.css` in temporary copy | The requested visual role value |
| `change-example/theme.patch` | Retained reviewable demonstration of that change |
| `tests/browser.mjs` theme scenario | Protects the domain/DOM/geometry contracts and checks the visible consequence |
| `checks/browser-results.json` | Actual outcome from executing that scenario |

In the old demo, the same value sits at the start of the combined, minified `style.css`; editing it is already possible. The demonstration supports explicit ownership/discovery in the refactored copy, not a measured reduction in time, effort or defect rate. A new rule/cost change would belong to the domain owner and need different tests; a save-format change would require new persistence scope because this demo has none.
