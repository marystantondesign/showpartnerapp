# 16-06 · Two color bugs

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes in any copy. Copy is gender-neutral (they, not she).

Scope: src/views/ProducerIPadView.jsx only. Before editing, confirm the line numbers below still match.

1. Count tiles: the All tile's count is hardcoded countColor '#fff' (around line 2369). When another tile is selected, the All count is white on a white tile and disappears. Use the normal text color when unselected and the inverse text color when selected, same as the other tiles.
2. Dark mode on Assistants: the selected filter chip (around line 1119) and the selected incident-type chip (around line 1259) use TX as the background but hardcoded '#fff' text. In dark mode TX is light, so the label vanishes. Use 'var(--sp-inverse-text)' for selected chip text. Search the file for any other selected state that pairs a TX background with '#fff' text and fix those too. List them.

Acceptance: the All count is visible in every state, and selected chips on Assistants are readable in light and dark mode. Report changes, build, commit and push to redesign.
