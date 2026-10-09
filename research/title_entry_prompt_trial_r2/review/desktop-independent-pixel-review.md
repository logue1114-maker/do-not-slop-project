# TIDELINE desktop title-screen comparison

## Scope

Reviewed only the rendered initial screenshots `A-desktop-initial.jpg` and `B-desktop-initial.jpg`. Ignored the shared comparison wrapper. Both game frames are 1365 × 768 CSS pixels. No source, assignment guidance, other experiments, interaction tests, or phone captures were inspected for this review.

## Bottom line

B makes a clear local improvement in menu legibility and reduces decorative clutter. It does not establish a clear overall visual-quality win. A has the stronger title presence, a more explicitly bounded primary action, and a more conspicuous disabled-state cue. B's smaller title, large title-to-menu gap, diagonal action arrow, and less explicit disabled treatment introduce tradeoffs.

The screens are meaningfully different in typography, grouping, active-button finish, ornament, and the amount of visible scenery. They remain the same basic game-entry concept: a left-hand title/menu over the same full-bleed coastal radio-dish image. Neither screenshot demonstrates a substantially new world/image composition or a new whole-screen layout architecture.

## Visible differences

### Title and information architecture

- A puts a very large, widely tracked TIDELINE title in the upper-middle left. A short expedition kicker sits above it, and THE SHORE REMEMBERS sits below. The title is the dominant UI element and forms a relatively compact sequence with the primary action underneath.
- B moves a smaller, more tightly set title toward the upper-left. BEYOND THE LAST SIGNAL and a short line ornament sit below it. The menu stays around mid-screen, leaving a conspicuously large blank interval between title/tagline and first action.
- A includes a small PELAGUS / SURVEY AUTHORITY identity in the upper-left, a FIELD SYSTEM / LOCAL-style status in the upper-right, a right-side location label, coordinates at lower-left, a bottom-center atmospheric sentence, and tiny bottom-right title/version text.
- B removes those peripheral elements and adds a keyboard instruction strip at lower-left. Its title and menu have an especially clean shared left edge.

### World and image integration

- Both use the same striking coastal scene: stormy sea and sky, a sunset near the horizon, a huge decaying radio dish at upper-right, and a lone small figure on the rocky ledge. The scene gives both a credible, memorable game-world premise.
- Both preserve the dish and figure as the main image subjects rather than covering them with a UI panel. The left-side darkness provides space for the menu.
- A's rendered scene appears more heavily shaded, particularly across the lower rocks and water. B exposes more texture and brightness in the foreground and allows the image to read more directly. This observation does not establish which source or rendering mechanism caused the difference.
- A's distant relay/location annotation ties the interface to the depicted world, but the other micro-labels make the image feel more like a branded expedition dossier. B feels more like a spare cinematic game menu.
- B's cleaner presentation gives the scene more room, but its large empty left-middle interval is not used to introduce another meaningful visual relationship. The change is primarily UI treatment over a shared scene.

### Button shape, material, and color

- A's New expedition is a broad smoky translucent rectangle with a fine warm border, a pale warm left-side accent, a small item number, and a horizontal forward arrow. The closed outline makes the whole target feel explicit. Its restrained glass-like finish fits the darker atmosphere.
- B uses a darker, softly fading rectangular highlight with a cool pale vertical indicator outside its left edge, a larger bold label, and a diagonal up-right arrow. It feels lighter and less boxed, with a stronger text emphasis.
- Both retain a rectangular, left-stacked menu. The treatment is more than a tiny color swap, but neither introduces a substantially new button silhouette or material concept.
- B's up-right arrow is a semantic weakness: it commonly signals an external destination or opening something elsewhere. A's forward arrow is more natural for starting a game expedition. This is a visible affordance risk, not a claim about actual behavior.

### Type, spacing, and control hierarchy

- B's menu labels are noticeably larger and clearer. Settings and Credits remain easy to identify without the small numbering/icon column. Its primary label has strong weight and contrast.
- A's title has more impact and gives the name a stronger marquee-like identity. B's compact title is tidy but less commanding relative to the broad scene.
- A makes a tighter title → subtitle → active action sequence. B uses two distant visual groups, title above and menu below. That separation can feel spacious, but it weakens the immediate title-to-entry connection.
- B's menu spacing is generous. Continue's explanatory line forms a small secondary block; Settings and Credits are comfortably separated underneath.
- A's small menu numbering and utility icons add structure but provide limited practical value beside the already explicit labels. The visual hierarchy relies more on the active rectangle than on large type.
- A's disabled Continue is very faint and includes a lock. B's Continue is dimmer than the active action and has a clearer explanation, but the label is comparatively prominent and has no lock. In a static screenshot B gives less certainty that this is unavailable.

## Copy and metadata

- B's “No saved expedition” is clearer than A's “No expedition in this session.” A's wording could leave a player unsure whether a prior save exists but is excluded by the current session.
- A has much more lore-like microcopy. Several corner/footer strings are so small and low contrast at native size that they are largely atmospheric texture rather than useful information. If they are meant to convey actual status, the presentation is inadequate.
- The screenshots alone do not establish that the lore labels, coordinates, or status text are false. They also do not demonstrate that the labels serve a real gameplay or navigation purpose. Avoid crediting their quantity as functional richness.
- B's keyboard guide is useful in principle and more relevant to entering the game than A's footer ornament. It is still quite small. Whether it accurately reflects keyboard interaction needs the separate flow test.
- Both taglines are plausible thematic copy. B's signal reference connects naturally to the large radio dish; A's shore reference connects to the coastline. This is a thematic difference rather than evidence that one is objectively better.

## Strengths and weaknesses by screen

### A

Strengths: impressive title hierarchy; clear bounded primary target; forward arrow appropriate to progression; lock reinforces Continue's unavailable state; coherent cinematic/dossier identity; preserves the key image subjects.

Weaknesses: smaller and sometimes low-contrast menu type; numerous nearly unreadable metadata strings; decorative numbering and status add noise; heavier shading sacrifices foreground scene detail; Continue explanation is ambiguous.

### B

Strengths: larger, simpler, more readable menu; less peripheral clutter; clean title/menu alignment; more visible environmental detail; clearer save-state explanation; relevant keyboard guidance if the actual controls support it.

Weaknesses: reduced title impact; very large title-to-menu gap; diagonal arrow can imply the wrong action; active target boundary is less explicit; Continue looks more like a normal selectable row; keyboard help remains small.

## What the pixels support

There is a defensible improvement in B's readable controls and restraint. There is no defensible claim, from these two screenshots alone, that B is a comprehensive whole-screen quality improvement. A and B express different balances of atmosphere, title impact, and interface clarity. A fair result is a tradeoff, not a forced winner.

Before deciding overall entry UX, check actual keyboard focus/selection, disabled Continue behavior, primary-action destination, Settings/Credits return behavior, and the phone layout. Those are outside this desktop screenshot review.
