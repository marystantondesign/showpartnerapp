# 08 · iPad layout: resizable panel and spacing

Screens: design-handoff/screens/2-ipad-layout/ (L1 to L3 landscape, P1 and P2 portrait), sources Layout-*.dc.html. This refines the producer screen from prompt 03.

Spacing fixes (both orientations):
- Metric cards: label "Hair done", number "14 /30". Nothing wraps (white-space: nowrap). The legend items stay one line each and wrap as whole items.
- Filter chips: one row, horizontal scroll, never wrap.
- Table: Look 40px, photo 40px, Model flexible, Hair, Makeup, Nails fixed 104px each, Assistant flexible. Names and sub-lines are single line with ellipsis.

Landscape:
- L1: right panel default 340px. A 14px drag handle on its left edge (vertical grip). A collapse chevron in the panel header.
- Drag to resize between about 300 and 600px. Below about 200px it snaps to collapsed. Remember the width and collapsed state per device (localStorage).
- When the main area gets narrow (under about 720px), fold the Assistant column into the model's sub-line ("Ready · Sofia R") and show + Pair inline next to the name.
- L2: at 480px and wider, the panel stacks the timeline (taller rows) above Announcements with more spacing, and the two buttons sit side by side.
- L3: collapsed to a 72px rail: expand chevron, walkthrough countdown, announcement acks (22/26), and a black Start Walkthrough button at the bottom. The table gets full width and the Assistant column returns.

Portrait:
- No side panel. A bottom drawer with a grab bar and two stops.
- P1 collapsed: one row with the walkthrough countdown pill, latest announcement status, Announce and Start Walkthrough.
- P2 pulled up (about 40 percent of the height): timeline and announcements side by side, buttons below.
- The table keeps the Assistant column in portrait.

Also fix the mock data: rows must match the metric counts (8 fully ready, hair 14 done, makeup 17 done, nails 9 done). Right now every row shows Done.

Acceptance: test at 1180x820 and 820x1180. Nothing wraps into multiple lines in the metrics, chips or table. Drag, collapse and the portrait drawer all work with touch.
