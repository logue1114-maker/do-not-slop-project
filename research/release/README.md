# Do Not Slop: whole-screen production framework

A reusable English production packet for designing and implementing a complete interface sequence across game tasks, engines and input platforms. It turns source craft into conditional construction work, not a universal skin or a collection of isolated redesign opinions.

**Status:** finished research/framework package; all new `DNS-*` recipes remain draft extensions. No functioning target-game redesign, target visual-quality pass, watched video/Short, exhaustive cross-genre validation or user design approval is claimed.

## Start here

1. Read [the production process](PRODUCTION_FRAMEWORK.md)
2. Give a maker [the exact AI instructions](AI_INSTRUCTIONS.md), a filled brief and the selected [recipe records](recipe-catalog.json)
3. Use [the input schema](brief.schema.json), [original authored trials](examples/README.md) and [source-owner roles](IMPLEMENTATION_ROLES.md)
4. Validate declarations, then perform actual rendering/input/parity checks separately

```sh
python validator.py package --root .
python validator.py brief examples/painted-entry.brief.json
python validator.py brief examples/industrial-adaptation.brief.json
PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tests -v
```

Python 3.9+, standard library only; validation is local, read-only and self-contained. The validator checks structure, references and optional declared state/event/token consistency. Resolved token-referenced spacing appears in its structural report; arbitrary prose and runtime truth remain unauthenticated. It never executes a game, assesses pixels, authenticates reviewer claims or grants implementation/publication permission.

## What is included

- Seven production stages and 20 merged conditional recipes
- All 30 original candidate construction details and their merge map; private source provenance omitted
- Task-led genre branches and four explicitly authored hypothetical application scenarios
- Two concrete authored geometry/material/input packets, with unrun target gates
- Exact canonical authority identities, maintained source-owner guidance, rights limits and future comparison protocol
- `display.json`: compact reader data; `sources.json`: attributed observations/access/limits

The existing 14-file canonical snapshot at `d82e373...` remains unchanged. [Authority index](authority-index.json) retains its exact pins and draft/uninstalled/unapproved status. Supplementary `7d25ff6...` research does not replace it. English synthesis does not rewrite original conditions, exceptions or supported routes.

Public evidence: four web construction sources content-verified; actual studio artwork and a separately linked creator example viewed. Private source identities, build metadata and inspection records are omitted from this public copy. Long-video and Shorts frames/transcripts were unavailable. [Exact boundaries and rights](RIGHTS_AND_EVIDENCE.md)

No private screenshot/build/source-code bytes or outside artwork/fonts are bundled. No repo-wide license is selected or inferred. This package is ready to read and structurally validate; target production acceptance is a separate, evidence-bearing task.
