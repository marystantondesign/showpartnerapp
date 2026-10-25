# 15 · Producer iPad Home metrics (Metrics K)

Scope: the top of the producer iPad Home in src/views/ProducerIPadView.jsx: the four metric cards, the filter chips, and the Home table's columns. Match screens/15-home-metrics/k-home-metrics.png and design-source/Metrics-K.dc.html exactly. Don't change the right panel, the menu, or other screens.

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own.

Step 1: copy the PNG into design-handoff/screens/ and the .dc.html into design-handoff/design-source/. List them back to me. Open both before coding.
Step 2: before editing, report the file and line numbers for the metric cards, the filter chips, the table header and row cells, and where the producer's discipline (makeup, hair or nails) is stored.

The producer's discipline: each producer owns one discipline (the top bar says "Makeup · 3:45 PM"). Everything below that says Makeup uses the signed-in producer's discipline. A hair producer sees Hair in the same places.

1. Metrics card. Replace the four cards (Fully ready, Hair done, Makeup done, Nails done) with one white card: 14px radius, 1px #E0DDD8 border, padding 14px 18px, items centered, 22px gap.
   - Left (with a 1px #E0DDD8 divider on its right, 22px padding): an 84px ring, 9px stroke, #E8E4DF track, #7A9E7E arc for the share of models fully ready (all three disciplines done), with the percent in the middle in Georgia 20px. Beside it, three lines in 13px #4A4743 with the values bold #111: "Fully ready 8 of 30", "Show in 2h 15m" (counting down to show time), "Not arrived 3". These count all disciplines, because she still needs to know when every model is ready.
   - Right: the producer's discipline only. "Makeup" in Georgia 18px with "Your team" in 12px #4A4743. Under it, one row per status, each with its own single-color bar: Done (#7A9E7E), In progress (#D4A853), Paused (#8A9BB0). Rows are a grid of label (92px, 13px), bar (10px tall, 5px radius, #F0EDE8 track, fill = count / total models), and the count on the right ("17 /30", count in Georgia 18px). Use the same status words as the table chips. No multi-color segmented bars anywhere.
2. Count tiles replace the filter chips. Five equal tiles in a row, 8px gap, 52px tall, 12px radius, padding 0 14px: count in Georgia 24px, label in 12px beside it. All (selected: #111 background, white count, #E8E4DF label), Needs attention (count in #A33D28), Not arrived, Not paired, Ready (count in #3F6B45). Unselected: white with 1px #E0DDD8 border. Tapping a tile filters the table, same as the chips did.
3. Table:
   - First column header "#", showing each model's show order number (01, 05, 06...). Not the look letter.
   - Status columns ordered with the producer's discipline first: Makeup, Hair, Nails for a makeup producer.
   - Unpaired model: the + PAIR button (#111, white, 32px tall, pill) goes in the producer's own discipline cell, in place of that status chip. The name line still says "Arrived 3:44 · Not paired". Once paired, the cell shows the status chip again. Remove the Pair button from the name column.
4. Use real counts from the model data for every number. The ring, the bars, the tiles and the table must agree.
5. Dark mode: follow prompt 14's colors (ring track #4A4743, card #242220, tile text and borders from the variables, selected tile inverted).

Acceptance: the top of Home is one card plus the tile row, Makeup is the only discipline shown on the right of the card for a makeup producer, numbers match the table, and Pair sits in the Makeup cell. Report file names and line numbers changed, run the build, commit and push to redesign.
