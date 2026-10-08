# AI instructions for button construction

Use this contract for a bounded button/control implementation or correction. Read [GUIDE.md](GUIDE.md) and the actual target before coding. Keep the existing task, labels, records, consequences and handler behavior unless their change is authorized.

1. **Inventory the rendered target.** Record its role, semantic element, action, real state/input support, neighboring rank, loaded font and target/silhouette/face/ink bounds. Inspect existing hover/focus/press behavior; do not claim a state is missing from CSS alone.
2. **Classify meaning.** Separate command rank (primary/secondary/tertiary), hazard (destructive), presentation (icon/text) and context (web/app/game HUD). Use links for navigation; persistent toggles, exclusive segments, tabs and menu rows need their own semantics. Read-only meters are not buttons.
3. **Name the change axes.** Before implementation, state exactly which anatomy/state axes must change and which must stay. Require only those changes. If the brief names silhouette, face/body, inner layout or glyph-system work, a color/background/font-only pass is incomplete.
4. **Choose the family from context.** Coherent filled/outline/flat web controls, soft-raised app actions with quiet rows/tabs, and tactile/game-native actions with low-relief HUD/menu controls are valid choices. Deliberate flat/text-only controls are valid. Never impose a universal icon, bevel, shadow, pill, polygon, color or shape.
5. **Build usable anatomy.** Budget real label width, line height, padding, optional icon slots, rim and body separately. Keep labels/costs/conditions readable, test the longest supported text and distinguish CSS/engine units from source/device pixels. Treat recipe numbers as authored trials, then measure actual runtime values.
6. **Check type and icon craft.** Set label typography explicitly; verify loaded font, actual glyphs, baseline and wrapping after cascade/shorthand effects. Match icon optical mass and drawing language at the real size; remove unnecessary icons. Name icon-only actions; hide decorative SVGs from accessibility naming.
7. **Implement supported states.** Hover is transient, focus is independent, pressed is momentary, selected/on/current persists, pending is unfinished operation and disabled is real unavailability. Give each relevant meaning a static readable signal. Do not invent production states to complete a sheet. Guard duplicate commitment and preserve actual recovery/cancellation.
8. **Preserve input behavior.** Use real buttons and native controls where suitable. Adding children must not break `event.target`, ID or label-update contracts. Keep the outer target/sibling layout stationary during tactile press. Verify pointer release-away, Tab, Enter/Space, selection keyboard behavior and focus return. Avoid duplicate key/click activation.
9. **Keep focus and reduced motion working.** Focus remains identifiable over selected/pressed surfaces. Essential unavailable reasons must be reachable without hover. Native `disabled` and focusable `aria-disabled` have different behavior; the latter needs an activation guard. Reduced motion removes animation while preserving static feedback.
10. **Submit a before → intent → actually rendered ledger.** Include target/silhouette, surface/rim/body or intentional flatness, typography, optional glyph system, internal layout, role hierarchy and supported states. Each rendered result names the exact revision/state and crop or measured/input evidence. A source declaration or a redesigned page background is not rendered component proof.
11. **Verify and report limits.** Compare the same fixture, labels/data, viewport, DPR, zoom, locale, background and milestone. Test actual input plus matching full-screen/context and component crops. Separate source, structural, browser, physical-device, assistive-technology, human-review and production-parity evidence. Mark failed/blocked/unrun checks honestly; never infer approval or measured usability gains.
12. **Keep this package local.** Its specimens are original authored comparisons and network-disabled simulations, not generated experimental outputs or production implementations. No live room creation, external service call, upload, purchase, deployment or publication is authorized by these examples. Keep the isolated golf proposal out of global web/app styling.

## Required implementation handback

- Role/family decision and protected meaning/behavior
- Named required changes plus deliberate preserved/no-body/no-icon decisions
- Changed files and before → intent → rendered ledger with evidence links
- Checks actually run, their results and unresolved limitations

Acceptance requires the requested axes to appear in the actual component and supported interactions to work. When a structural requirement is missing, fix and recheck it; do not relabel the missing change as an intentional flat exception.

한국어 핵심 지시: 역할과 맥락에 맞는 버튼 가족을 먼저 정하고, 요청한 구조 변경을 실제 렌더에서 확인한다. 구조 변경을 요청받았다면 색만 바꾼 결과로 완료 처리하지 않는다. 의도적인 평면·텍스트 전용 버튼은 유효하며, 모든 버튼에 아이콘·베벨·그림자를 강제하지 않는다.
