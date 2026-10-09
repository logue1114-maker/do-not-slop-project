# Whole-screen construction atlas

A static, original visual reader for the Do Not Slop production framework. The SVGs are construction diagrams, never target-game screenshots, render acceptance evidence, or before/after experiments.

## Files and ownership

- `index.html`: semantic chapters, accessible controls, exact-record disclosures and link destinations
- `reader.css`: editorial layout, responsive handling, keyboard focus, reduced motion and print styles
- `data.js`: authored task-route navigation and clearly identified pinned research-extract fallback
- `diagrams.js`: original SVG construction geometry with title/description alternatives
- `reader.js`: release adaptation, selection, source records, local copy/download and data-load notice
- `check-reader.py`: 18 browser-free structural gates, including redacted loaded/fallback provenance; no visual acceptance claim
- `check-runtime.cjs`: minimal mock-DOM loaded/fallback and control contract fixture, not a browser test
- `STRUCTURAL_CHECKS.json`: final structural-check results and remaining inspection boundary

No external fonts, assets, embeds, analytics or libraries are loaded. No private sample captures or third-party artwork are copied. Outbound source links retain access and evidence-limit labels.

## Integration contract

The confirmed project Site mount is:

- reader: `/research/production-framework/`
- exact data/documents: `/research/release/`
- reusable production packet: `/research/release/README.md`
- project home: `/`

Keep the reader and release as siblings. `../release/display.json` is the only data fetch. Download paths are supplied by that file and restricted to `../release/`. `../release/README.md` links to the included production packet; `../../` links to the included project overview. For an independently hosted portable package, preserve this mount structure or change these integration links deliberately. Serve files over HTTP(S); file-scheme loading may block the release fetch.

If release JSON fails or is malformed, a prominent status notice says that pinned research extracts are shown, current release stages are unavailable, and download links require the sibling release. It must not be mistaken for the current packet. No successful fetch means no claim that current records loaded.

## Reader behavior

- Twelve authored, task-led routes cover major game families with explicit condition and exception. Route names are navigation aids, not newly promoted universal rules.
- Release `candidate_ids` map the original recipe IDs to the merged production IDs. All release stages and recipes retain exact input, process, output, test, exception and separate avoid lists.
- The source drawer deduplicates source URLs while retaining access, observation and limit. Long videos/Shorts are never represented as watched-frame evidence.
- Sequence, layer, material/underlay and mask controls change teaching diagrams only. They do not simulate or test a game.
- Every selected-route copy/download includes the full common maker instruction base verbatim from release `maker_instructions`, followed by only the relevant conditional recipe records, limits and explicit source-file references. The base is an exact embedding of `AI_INSTRUCTIONS.md`. Fallback without that current base is prominently labeled incomplete in the reader, copied text and JSON metadata; route extracts alone are never called a complete handoff. The actual target brief still must be resolved before implementation.
- Small screens can horizontally pan diagrams whose labels need a larger logical canvas; every figure also has a plain-language caption and SVG accessible description. The page itself reflows without horizontal page overflow.

## Checks and outstanding visual review

Run `python research/production-framework/check-reader.py` from the package root, or pass its absolute location. It checks scripts, HTML IDs/assets, SVG XML/accessibility, route requirements, release recipe mapping, preserved avoid lists and declared release files. It does not operate a browser or claim visual/input acceptance.

The integrating owner still needs actual browser inspection at wide/narrow widths, keyboard traversal, all teaching controls, source-record expansion, copy/download, data-load failure, long records and scrolling. Any target-game implementation needs its own actual render and input evidence; this reader is a construction guide.

## Public package navigation

This public variant omits private source identities, inspection/build metadata and owner-only links from loaded data and fallback exports. Its related-guide link opens the included reusable production packet. No private image/code files are included. See [actual browser checks](BROWSER_REPORT.md).
