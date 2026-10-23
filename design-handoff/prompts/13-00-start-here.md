# 13 · Producer iPad fixes · start here

Do these as separate tasks, in order, one commit each: 13-01 through 13-07. Finish and push one before starting the next.

Ground rules for every task:
- Work only on the redesign branch. Never commit to main, never merge into main, never run vercel --prod, never promote or redeploy anything to production. The original Show Partner on main must stay untouched.
- Only change the iPad producer view and the files each task names. The phone layouts and other roles stay as they are.
- Before editing, report the files and line numbers you will change. After editing, report what changed with line numbers.
- Match the PNG and its .dc.html source for each screen exactly: layout, spacing, sizes, copy. Photos show as broken image icons in the PNGs; use the app's existing photos there.
- No em dashes in any UI copy.

Step 1, before any task: copy this zip's screens/13-ipad-fixes/ into design-handoff/screens/, design-source/*.dc.html into design-handoff/design-source/, and prompts/13-*.md into design-handoff/prompts/. List the copied files back to me, commit "Add design handoff 13", push to redesign. Prompt 12's files never made it into the repo last time; do not skip this.

Accessible colors (WCAG AA, light and dark). Use these for text everywhere in the iPad view:
- Light mode text on #F5F2EE or white: red #A33D28, green #3F6B45, amber #8A6516. Never use #C4614A, #7A9E7E or #D4A853 as text color.
- Dark mode text: red #E8826B. Keep status chip labels #111 on the chip colors in both modes.
- Muted text: #4A4743 light, #B5B0AA dark.

Focus: remove the browser's blue focus ring across the iPad view. Use :focus-visible with a 2px #111 outline (light) or #F0EDE8 (dark), 2px offset.
