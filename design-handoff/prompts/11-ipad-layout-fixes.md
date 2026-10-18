# 11 · iPad layout fixes from device testing

Before starting: copy this zip's screens/2-ipad-layout/*.png and design-source/Layout-*.dc.html into design-handoff/, replacing the old versions. Read Layout-L-Collapsed, Layout-P-Collapsed and Layout-P-Expanded (source and PNG) before coding.

1. Landscape collapsed rail: the Start button text is rotated sideways. Never rotate text. The button is 56px wide: a pause icon on top, "Start" (10px, semibold) under it and "walkthru" (9px) under that, all horizontal. The countdown ("15m") and the acks ("22/26 got it") items follow the same stacked horizontal pattern.

2. Portrait drawer, pulled up (P2): the dark Walkthrough row runs edge to edge and the text touches the edges. Keep two columns (timeline left, announcements right), but everything must fit inside its own column:
   - Columns are minmax(0, 1fr) each with a 24px gap and 24px outer padding.
   - Every timeline row has 14px left and right padding and a 10px radius. The dark highlighted row sits inside the column (no negative margins, no full-bleed background).
   - Time column 72px wide. "Push walkthrough time" lines up with the row text (14px inset).
   - The announcement card fills its column width and never overflows.
   - Footer: Start Walkthrough · Pause All (black, left) and New Announcement (outline, right), equal width (1fr 1fr), 52px tall.

3. Portrait drawer, collapsed (P1): two rows, not one crowded row.
   - Row 1 left: a dark 44px clock tile, then "Walkthrough at 4:00" with "in 15 min" under it.
   - Row 1 right: one line, centered over the right button: "15 min warning sent" (13px semibold) followed by "22 got it · 4 waiting" (13px, gray #4A4743).
   - Row 2: Start Walkthrough · Pause All (black, left) and New Announcement (outline, right), equal width (1fr 1fr), 52px tall.
   - 24px side padding, 20px bottom padding, 14px between rows.

4. The drawer must swipe. Tapping the grab bar is not enough:
   - Pointer events (touch and pencil) on the grab bar and the drawer header area. The drawer follows the finger while dragging.
   - On release, snap to the nearest stop (collapsed or pulled up). A quick flick goes to the next stop in that direction regardless of distance.
   - When the drawer content is scrolled to the top, dragging down on the content also moves the drawer. Otherwise the content scrolls normally.
   - Animate the snap (about 250ms ease-out). Use touch-action: none on the handle so the page doesn't scroll instead.
   - Apply the same swipe behavior to the phone bottom sheets from prompt 01 if they aren't already working.

Acceptance: on a real iPad, landscape rail has no rotated text. In portrait, nothing in the drawer touches a column edge, the collapsed bar matches P1, both button pairs are equal width with Start on the left, and the drawer opens and closes by swiping in both directions. Commit and push to the redesign branch and tell me what to check on the preview.
