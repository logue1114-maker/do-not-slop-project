# Synthetic-fixture visual review

The repository's draft `review-visible-design` skill and evidence contract were read. Route for this four-study teaching surface: **unsupported by its fixed-target domain recipes**. The generic evidence boundaries apply; no RPG/card/fixed-target recipe is imposed. This review is of the original local demo, not any original game.

## Findings and corrections

| Finding | Direct evidence | Correction | Preserved | Final evidence |
| --- | --- | --- | --- | --- |
| Strict falling runner visible in assisted lane | `captures/first-browser/desktop-jump-coyote.png` and `landscape-jump.png` | Clip each `.jump-lane` to its specimen area | Same shared timeline, trajectories, timing and outcomes | `captures/final/desktop-jump-coyote-frame.png`; final containment check |
| Desktop jump buttons below first frame | Same full-page capture: action row below 747 px | Reduce desktop shell/study/controls spacing and lane height | All controls and labels; original game fixture | Final native geometry: Reset bottom 744.59 px; `desktop-jump-coyote-frame.png` |
| Phone checkpoint names overlap | `captures/first-browser/narrow-recovery.png` | Shorten scene labels to Home/Relay; full checkpoint roles remain in choice | Same checkpoint positions and availability | `captures/final/narrow-recovery.png` |
| Configured lane name did not state disabled tolerance | Source + first render, proposal | Name lane Ledge grace on/off or Jump buffer on/off | Fixed strict lane; settings and timestamps | Final runtime label check and grace/buffer captures |
| Scene range heading wraps unnecessarily | `captures/first-browser/narrow-interaction.png` | Use Nearby candidates/Exact aim and 4 m range; keep numeric radius in parameters/spec | Same eligibility and ranking | `captures/final/narrow-interaction.png` |
| Bottom feedback legend has weak contrast over the floor | `captures/pre-contrast/narrow-feedback.png`; foreground #b8c8cb over #506153 computes 3.83:1 | Add a solid #202e33 backing to `.feedback-readout`, leaving world/cues unchanged | Last-hit text, direction, HP, exposure and all controls | Final rendered pair computes 8.11:1; `feedback-legend-rendered-contrast` and final feedback captures |

Directly inspected PNGs: desktop grace frame and buffer full page; all four 390×844 full pages; all four 844×390 full pages. After the legend-backing change, final portrait, landscape and desktop simultaneous-feedback PNGs were inspected again. These preserve state/text, show the corrected lane containment and short checkpoint labels, and show independent threat cues. Metadata-only captures for other states are not represented as a separate human review. Images are unedited browser captures of a fictional UI; viewport-frame and full-page modes are explicitly recorded.

The dark stage remains the dominant object; controls sit beside/below their changed state, and official source boundaries are disclosed. Portrait controls and landscape stages require vertical scrolling. The prototype's 100/120 ms timing and all other constants are proposals, not official values or measured UX effects.

Functional verification: passed within the declared scope. Bounded visual inspection: corrected material issues above. User design approval: pending. No external reviewer or human participant study was run.
