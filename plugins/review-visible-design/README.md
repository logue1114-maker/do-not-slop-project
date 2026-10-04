# Visible-design review runtime · draft.3

Version 0.1.0-draft.3 supplies one bounded review skill, its references, a standard-library Python helper and synthetic contract fixtures. It is a source input, not a verified installable release or officially approved plugin.

The manifest's existing provisional name is retained. Repository naming does not imply a new publisher, package identity or approval.

## Included

- plugin.json
- skills/review-visible-design/SKILL.md and product-facing references
- skills/review-visible-design/scripts/review_contract.py
- tests/: authored normalized requests, comparison/report cases, exact-byte hash fixtures and known-null regressions

From this directory:

    python3 skills/review-visible-design/scripts/review_contract.py route --input tests/sample_request.json
    python3 skills/review-visible-design/scripts/review_contract.py compare --input tests/sample_comparison.json
    python3 skills/review-visible-design/scripts/review_contract.py hash-json --input tests/hash_fixture.json
    python3 skills/review-visible-design/scripts/review_contract.py check-report --input tests/sample_report.json

Required references are package-relative. The helper does not supply the host's screen, browser or editing capabilities. Normalized synthetic fixture checks are distinct from model activation, rendered before/after, input/accessibility, source-currentness and user review.

Draft.3 treats null as an explicitly empty control state only for the exact schema-declared initial_state.selectedId/focusId/pressedId family when all three keys are present. Missing/unknown metadata, other null paths and unknown environments remain inconclusive. A null-to-real-ID change is a mismatch. These semantics and their fixture bytes are unchanged in this bundle.

## Public-copy validation

A new standard-library validator, truthful draft status and exact public package inventory accompany this source release:

    python3 validation/validate_package.py

The validator runs every included request/comparison/report/hash/invalid-JSON fixture, including the exact known-null schema and preserved raw-byte/canonical hash expectations. It also relocates the package to a temporary directory and runs its CLI samples. See [project verification](../../docs/VERIFICATION.md). Runtime and synthetic fixture bytes are unchanged.

No reuse license has been selected. External source rights remain unknown. Browser/input/rendered-before-after, model activation, source currentness, host loading and user review remain not_run in [DRAFT_STATUS.json](DRAFT_STATUS.json). No installation, official approval or usability effectiveness is established. [PROVENANCE.json](PROVENANCE.json) records bounded public-source authorization, not downstream licensing permission.
