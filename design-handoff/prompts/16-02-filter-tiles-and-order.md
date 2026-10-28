# 16-02 · Filter tiles and show order (R6, R7)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes anywhere in the UI, including as an empty-value placeholder. Copy is gender-neutral (they, not she).

Scope: the Home count tiles and the Home table sort in src/views/ProducerIPadView.jsx. Match screens/16-home-fixes/r6-paired.png and r7-all-clear.png, with design-source/Fix-R6-Paired.dc.html and Fix-R7-AllClear.dc.html.

Before editing, report the line numbers of the tile array, the filter state, and where the filtered table rows are sorted.

1. Rename the first tile from "All" to "Models" ("30 Models").
2. Models and Ready always show. Needs attention, Not arrived and Not paired only show when their count is above 0. When one hits 0, that tile disappears.
3. If the selected tile disappears (for example you pair the last unpaired model while on Not paired), the selection jumps back to Models and the right panel returns to the default.
4. Tiles keep their natural width. Don't stretch the remaining tiles to fill the row. R7 (everyone arrived, everyone paired, nothing needs attention) shows only "30 Models" and "8 Ready", left-aligned.
5. Sort order: every view of the table, on every tile, is sorted by show number ascending (01, 02, 03...). Never by status. On Not arrived, Irina (03) comes before Priya (09) and Hana (12). On Needs attention: 01, 04, 06, 11, 13. On Models: 01 through 30 with no gaps.
6. Use real counts from the model data, so the tiles, ring, bars and table always agree.

Acceptance: tiles with 0 disappear, Models and Ready always show, a disappearing selected tile falls back to Models, and every filtered list is in show-number order. Report changes, build, commit and push to redesign.
