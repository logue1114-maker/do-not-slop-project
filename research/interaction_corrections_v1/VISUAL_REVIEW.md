# Visual capture inspection

Implementer inspection of actual PNG pixels, separate from automated geometry/input checks. This is an AI artifact review, not a human usability study or user design approval. The screens are authored failure/correction proposals.

Pre-final inspection covered all six corrected desktop specimens at 1165×747 (`captures/repair-2/*-corrected-1165x747.png`), all six corrected phone specimens from `repair-1`, and the complete phone teaching frame `repair-2/input-corrected-full-390x844.png`. All six `repair-2/*-problem-390x844.png` specimens were inspected as deliberate fault states. Additional inspection covered the 200% text/keyboard model, expired invitation and out-of-order save reply. These are inspection samples, not a claim that every captured frame was independently reviewed.

Findings:

- Encounter: world buttons, radio field and side-effect counts are legible. The problem and corrected versions keep the same scene; their action differences become visible through the counters/procedure.
- Dispatch: objective, hazard and grouped rewards have different jobs; chat is inspectable separately. Phone layout scrolls vertically. The clock distinguishes cue expiry and action deadline; expired invitation history visibly disables acceptance.
- Workbench: a stat ledger shows current/after/change; material quantities and a warning label explain disabled craft. At 320 px actions wrap. Inspection found a real CSS defect: `.shop-list` displayed even when its native hidden attribute was present. The old capture shows “Open shop” above visible items. Fixed with an explicit hidden display rule and a disclosure visibility regression. Historical image/source remain.
- Editor: long labels wrap; enlargement preserves the selected native text range. The keyboard model leaves the focused field in a reachable internal scroll area. Oversized content/actions scroll; the image does not imply a native keyboard was opened. The deliberately fixed-width problem clips its content.
- Notebook: query/empty explanation, editable draft, acknowledgment ledger and actual save status remain separate. The out-of-order frame retains “Newer draft,” acknowledged revision 2 and ignoredLate 1.
- Beacon: selected channel persists; pressed, pending and result are distinct. A failure includes a visible symbol plus specific text. Reduced motion preserves the text outcome; no hearing/vibration assessment was made.

Final verification inspected `captures/final-2/decisions-problem-390x844.png` (closed shop hidden), `decisions-corrected-390x844.png` (open shop), `adaptation-corrected-text-keyboard.png` (enlarged label and selected text), plus corrected `overload`, `input`, and `recovery` at 320×720. The earlier 320×720 decision and feedback frames were also inspected. The final browser run recaptures all six at desktop/phone/narrow/landscape targets and records source hashes. The relevant preserved states and final pixels are linked in [captures/README.md](captures/README.md).

Typography, margins and grouping remain task-specific: an arena, dispatch rail, selection/stat bench, route form, notebook and control/timeline. Color supports state labels rather than carrying their meaning alone. Original geometry and system fonts only; no downloaded game media.

No clipping/overlap defect was found in the inspected corrected samples beyond ordinary intentional scroll containment. Automated no-horizontal-overflow/control-boundary checks cover the wider executed matrix. This is not a complete contrast/raster/accessibility audit, universal design judgment, physical safe-area check, participant result or commercial visual-readiness claim. User design acceptance remains pending. [Declared text-role contrast checks](checks/package-results.json) are narrower than full accessibility verification.
