# Public source integration

Public Git publication was explicitly authorized on 7 October 2026 after local review. It does not establish design acceptance, learning benefits or measured usability.

Implementation began on main `6f3944309604ed2e10784cd62119b2d429c9a7e2`. Remote main was refreshed and fast-forwarded to `cad72abf335c4acf825ce840074834297c18d524`, preserving the concurrent Party Race documentation and file-inventory update. The publication changes only this new package, one README guide row, and one research-index section/local URL. Every other preexisting path is checked against that publication base.

The current runtime and browser harness are byte-identical to the source frozen before `review-candidate-2`: **25/25 browser scenarios, zero captured browser errors**, 58 original screen PNGs and three contact sheets. Public preparation adds documentation and publication verification; it does not rerun or relabel old browser outcomes. All earlier failures and superseded outputs remain separately archived. Run metadata's publication flags describe the time each run happened.

Bounded checks:

```sh
node research/menu_placement_v1/verify-local.mjs
node research/menu_placement_v1/verify-public.mjs
```

When intentionally refreshing the publication receipt, run `build-manifest.mjs`, `verify-public.mjs --record`, then `build-manifest.mjs` and the read-only verifier again. The last manifest includes the refreshed receipt; neither verifier changes runtime or captured browser evidence.

`checks/public-validation.json` records scoped preservation, original-package protection, frozen-source equality, local navigation, no external runtime requests, rights/approval boundaries, sensitive-data scan and package-manifest integrity. It is a source publication check, not a new interaction test or comprehensive secret-detection guarantee. `PACKAGE_MANIFEST.json` covers this package's exact bytes, excluding itself; the unchanged root inventory predates this addition and does not inventory the new package.

This package's `.gitattributes` keeps text as LF and PNGs unconverted, preserving manifest and frozen-source hashes across Git checkouts, including systems configured with automatic CRLF conversion.

All graphic assets and captured screens are original synthetic material. Official game references remain links and bounded observations. No third-party screenshot bytes, source article bodies, external fonts, credentials, workstation paths or private input records are included. No new reuse license is selected. The public package retains roughly 91MB of original current and development evidence.

The resulting commit and normal push are verified against remote main in the publication response; the commit cannot embed its own final hash. Physical devices/controllers, software keyboards, screen readers, Firefox/WebKit, native 200% zoom, external reviewers and human usability participants remain unrun. Final user design approval is pending. No Site edit or plugin installation is performed.
